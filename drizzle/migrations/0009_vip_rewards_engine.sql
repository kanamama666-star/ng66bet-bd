CREATE TABLE public.vip_tiers(
 level int PRIMARY KEY CHECK (level BETWEEN 1 AND 100),
 required_turnover numeric NOT NULL, upgrade_bonus numeric NOT NULL, weekly_bonus numeric NOT NULL,
 monthly_bonus numeric NOT NULL, weekly_mission numeric NOT NULL, monthly_mission numeric NOT NULL DEFAULT 100);
GRANT SELECT ON public.vip_tiers TO anon, authenticated;
GRANT ALL ON public.vip_tiers TO service_role;
ALTER TABLE public.vip_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY tiers_read ON public.vip_tiers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY tiers_admin ON public.vip_tiers FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.vip_bonus_awards(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
 kind text NOT NULL CHECK (kind IN ('upgrade','weekly','monthly')),
 level int NOT NULL, period date NOT NULL, amount numeric NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(user_id,kind,period,level));
GRANT SELECT ON public.vip_bonus_awards TO authenticated;
GRANT ALL ON public.vip_bonus_awards TO service_role;
ALTER TABLE public.vip_bonus_awards ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_vip_awards ON public.vip_bonus_awards FOR SELECT TO authenticated USING (user_id=auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.player_turnover(_user_id uuid, _from timestamptz, _to timestamptz) RETURNS numeric LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $fn$
 SELECT coalesce(sum(amount),0) FROM public.payment_requests WHERE user_id=_user_id AND kind='deposit' AND status='approved' AND reviewed_at>=_from AND reviewed_at<_to
$fn$;
REVOKE EXECUTE ON FUNCTION public.player_turnover(uuid,timestamptz,timestamptz) FROM PUBLIC, anon;

CREATE OR REPLACE FUNCTION public.locked_bonus_amount(_user_id uuid) RETURNS numeric LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $fn$
 SELECT coalesce(sum(a.amount),0) FROM (
  SELECT amount, created_at FROM public.mystery_bonus_awards WHERE user_id=_user_id
  UNION ALL SELECT amount, created_at FROM public.vip_bonus_awards WHERE user_id=_user_id) a
 WHERE public.player_turnover(_user_id, a.created_at, 'infinity'::timestamptz) < a.amount
$fn$;

CREATE OR REPLACE FUNCTION public.credit_vip_bonus(_user_id uuid, _kind text, _level int, _period date, _amount numeric, _label text) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $fn$
DECLARE b numeric;
BEGIN
 IF _amount<=0 THEN RETURN false; END IF;
 BEGIN
  INSERT INTO public.vip_bonus_awards(user_id,kind,level,period,amount) VALUES(_user_id,_kind,_level,_period,_amount);
 EXCEPTION WHEN unique_violation THEN RETURN false;
 END;
 UPDATE public.profiles SET balance=balance+_amount WHERE id=_user_id RETURNING balance INTO b;
 INSERT INTO public.account_activity(user_id,actor_id,kind,amount,balance_after,reason) VALUES(_user_id,_user_id,'vip_'||_kind,_amount,b,'VIP '||_level||' '||_kind||' bonus');
 INSERT INTO public.player_messages(user_id,title,body) VALUES(_user_id,'ভিআইপি '||_label,'অভিনন্দন! আপনি VIP '||_level||' '||_label||' ৳'||_amount||' পেয়েছেন। উত্তোলনের আগে ১x শর্ত পূরণ করতে হবে।');
 RETURN true;
END
$fn$;
REVOKE EXECUTE ON FUNCTION public.credit_vip_bonus(uuid,text,int,date,numeric,text) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.refresh_vip_level(_user_id uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $fn$
DECLARE cur int; nxt int; t record;
BEGIN
 SELECT vip_level INTO cur FROM public.profiles WHERE id=_user_id AND status='active';
 IF NOT FOUND THEN RETURN; END IF;
 SELECT coalesce(max(level),0) INTO nxt FROM public.vip_tiers WHERE required_turnover<=public.player_turnover(_user_id,'-infinity'::timestamptz,'infinity'::timestamptz);
 IF nxt<=cur THEN RETURN; END IF;
 UPDATE public.profiles SET vip_level=nxt, vip=true WHERE id=_user_id;
 FOR t IN SELECT * FROM public.vip_tiers WHERE level>cur AND level<=nxt ORDER BY level LOOP
  PERFORM public.credit_vip_bonus(_user_id,'upgrade',t.level,DATE '2000-01-01',t.upgrade_bonus,'আপগ্রেড বোনাস');
 END LOOP;
END
$fn$;
REVOKE EXECUTE ON FUNCTION public.refresh_vip_level(uuid) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.on_deposit_approved() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $fn$
BEGIN
 IF new.kind='deposit' AND new.status='approved' AND old.status IS DISTINCT FROM 'approved' THEN
  PERFORM public.refresh_vip_level(new.user_id);
 END IF;
 RETURN new;
END
$fn$;
REVOKE EXECUTE ON FUNCTION public.on_deposit_approved() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER vip_on_deposit_approved AFTER UPDATE ON public.payment_requests FOR EACH ROW EXECUTE FUNCTION public.on_deposit_approved();

CREATE OR REPLACE FUNCTION public.distribute_vip_period_bonus(_kind text) RETURNS int LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $fn$
DECLARE p record; n int := 0; s timestamptz; e timestamptz; per date; mission numeric; amt numeric; lbl text;
BEGIN
 IF _kind NOT IN ('weekly','monthly') THEN RAISE EXCEPTION 'bad kind'; END IF;
 PERFORM pg_advisory_xact_lock(570021);
 IF _kind='weekly' THEN
  e := date_trunc('week', now() AT TIME ZONE 'Asia/Dhaka') AT TIME ZONE 'Asia/Dhaka';
  s := e - interval '7 days';
  lbl := 'সাপ্তাহিক বোনাস';
 ELSE
  e := date_trunc('month', now() AT TIME ZONE 'Asia/Dhaka') AT TIME ZONE 'Asia/Dhaka';
  s := e - interval '1 month';
  lbl := 'মাসিক বোনাস';
 END IF;
 per := (s AT TIME ZONE 'Asia/Dhaka')::date;
 FOR p IN SELECT pr.id AS uid, t.* FROM public.profiles pr JOIN public.vip_tiers t ON t.level=pr.vip_level WHERE pr.status='active' AND pr.vip_level>=1 LOOP
  IF _kind='weekly' THEN mission := p.weekly_mission; amt := p.weekly_bonus; ELSE mission := p.monthly_mission; amt := p.monthly_bonus; END IF;
  IF public.player_turnover(p.uid,s,e) >= mission THEN
   IF public.credit_vip_bonus(p.uid,_kind,p.level,per,amt,lbl) THEN n := n+1; END IF;
  END IF;
 END LOOP;
 RETURN n;
END
$fn$;
REVOKE EXECUTE ON FUNCTION public.distribute_vip_period_bonus(text) FROM PUBLIC, anon, authenticated;