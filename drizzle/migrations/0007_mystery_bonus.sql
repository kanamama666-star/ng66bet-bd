ALTER TABLE public.profiles ADD COLUMN vip_level int NOT NULL DEFAULT 0 CHECK (vip_level BETWEEN 0 AND 100);
UPDATE public.profiles SET vip_level=1 WHERE vip AND vip_level=0;

CREATE TABLE public.player_messages(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
 title text NOT NULL, body text NOT NULL,
 read boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, UPDATE ON public.player_messages TO authenticated;
GRANT ALL ON public.player_messages TO service_role;
ALTER TABLE public.player_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_messages_read ON public.player_messages FOR SELECT TO authenticated USING (user_id=auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY own_messages_mark ON public.player_messages FOR UPDATE TO authenticated USING (user_id=auth.uid()) WITH CHECK (user_id=auth.uid());

CREATE TABLE public.mystery_bonus_awards(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
 period date NOT NULL,
 vip_level int NOT NULL,
 amount numeric NOT NULL,
 phone text NOT NULL,
 username text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(user_id,period), UNIQUE(phone,period), UNIQUE(username,period));
GRANT SELECT ON public.mystery_bonus_awards TO authenticated;
GRANT ALL ON public.mystery_bonus_awards TO service_role;
ALTER TABLE public.mystery_bonus_awards ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_awards_read ON public.mystery_bonus_awards FOR SELECT TO authenticated USING (user_id=auth.uid() OR public.has_role(auth.uid(),'admin'));

-- Bonus funds still locked by the 1x turnover rule (counted as approved deposits since award).
CREATE OR REPLACE FUNCTION public.locked_bonus_amount(_user_id uuid) RETURNS numeric LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
 SELECT coalesce(sum(a.amount),0) FROM public.mystery_bonus_awards a
 WHERE a.user_id=_user_id AND (SELECT coalesce(sum(r.amount),0) FROM public.payment_requests r WHERE r.user_id=_user_id AND r.kind='deposit' AND r.status='approved' AND r.reviewed_at>=a.created_at) < a.amount $$;
REVOKE EXECUTE ON FUNCTION public.locked_bonus_amount(uuid) FROM PUBLIC, anon;

CREATE OR REPLACE FUNCTION public.validate_payment_request() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$ DECLARE available numeric; pending numeric; BEGIN SELECT balance INTO available FROM public.profiles WHERE id=new.user_id AND status='active' FOR UPDATE; IF NOT FOUND THEN RAISE EXCEPTION 'Account unavailable'; END IF; IF new.kind='withdrawal' THEN IF new.account_number !~ '^01[3-9][0-9]{8}$' THEN RAISE EXCEPTION 'Enter a valid Bangladesh mobile number'; END IF; SELECT coalesce(sum(amount),0) INTO pending FROM public.payment_requests WHERE user_id=new.user_id AND kind='withdrawal' AND status='pending'; IF new.amount>available-pending-public.locked_bonus_amount(new.user_id) THEN RAISE EXCEPTION 'Insufficient available wallet balance'; END IF; END IF; RETURN new; END; $function$;

CREATE OR REPLACE FUNCTION public.distribute_mystery_bonus() RETURNS int LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE p record; per date := date_trunc('month', now())::date; n int := 0; amt numeric; b numeric;
BEGIN
 PERFORM pg_advisory_xact_lock(570020);
 FOR p IN SELECT pr.* FROM public.profiles pr
  WHERE pr.status='active' AND pr.vip_level>=1 AND pr.phone<>''
   AND EXISTS(SELECT 1 FROM public.payment_requests r WHERE r.user_id=pr.id AND r.kind='deposit' AND r.status='approved')
  ORDER BY random()
 LOOP
  amt := 5 * p.vip_level;
  BEGIN
   INSERT INTO public.mystery_bonus_awards(user_id,period,vip_level,amount,phone,username) VALUES(p.id,per,p.vip_level,amt,p.phone,lower(p.username));
  EXCEPTION WHEN unique_violation THEN CONTINUE; END;
  UPDATE public.profiles SET balance=balance+amt WHERE id=p.id RETURNING balance INTO b;
  INSERT INTO public.account_activity(user_id,actor_id,kind,amount,balance_after,reason) VALUES(p.id,p.id,'mystery_bonus',amt,b,'Mystery bonus '||to_char(per,'YYYY-MM')||' (VIP '||p.vip_level||')');
  INSERT INTO public.player_messages(user_id,title,body) VALUES(p.id,'রহস্য পুরস্কার','অভিনন্দন! আপনি ৳'||amt||' রহস্য পুরস্কার পেয়েছেন (VIP লেভেল '||p.vip_level||')। উত্তোলনের আগে ১x শর্ত পূরণ করতে সমপরিমাণ জমা প্রয়োজন।');
  n := n+1;
 END LOOP;
 RETURN n;
END $$;
REVOKE EXECUTE ON FUNCTION public.distribute_mystery_bonus() FROM PUBLIC, anon, authenticated;