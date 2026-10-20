ALTER TABLE public.profiles ADD COLUMN referral_code text UNIQUE, ADD COLUMN referred_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
 ADD COLUMN flagged boolean NOT NULL DEFAULT false, ADD COLUMN flag_reason text;
UPDATE public.profiles SET referral_code=upper(substr(replace(id::text,'-',''),1,8)) WHERE referral_code IS NULL;

CREATE TABLE public.player_signals(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
 ip text NOT NULL DEFAULT '', device_id text NOT NULL DEFAULT '',
 created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX ON public.player_signals(ip); CREATE INDEX ON public.player_signals(device_id); CREATE INDEX ON public.player_signals(user_id);
GRANT SELECT ON public.player_signals TO authenticated;
GRANT ALL ON public.player_signals TO service_role;
ALTER TABLE public.player_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY admin_signals_read ON public.player_signals FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.referrals(
 referred_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
 referrer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
 status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','valid','disqualified')),
 reason text, qualified_at timestamptz, created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX ON public.referrals(referrer_id);
GRANT SELECT ON public.referrals TO authenticated;
GRANT ALL ON public.referrals TO service_role;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY referrals_read ON public.referrals FOR SELECT TO authenticated USING (referrer_id=auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE TABLE public.referral_milestones(valid_count int PRIMARY KEY, bonus numeric NOT NULL);
GRANT SELECT ON public.referral_milestones TO anon, authenticated;
GRANT ALL ON public.referral_milestones TO service_role;
ALTER TABLE public.referral_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY milestones_read ON public.referral_milestones FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.referral_rewards(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 referrer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
 kind text NOT NULL CHECK (kind IN ('milestone','deposit_commission')),
 milestone int, source_request_id uuid, referred_id uuid,
 amount numeric NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(referrer_id,kind,milestone), UNIQUE(source_request_id));
GRANT SELECT ON public.referral_rewards TO authenticated;
GRANT ALL ON public.referral_rewards TO service_role;
ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY rewards_read ON public.referral_rewards FOR SELECT TO authenticated USING (referrer_id=auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.create_player_profile() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $fn$
DECLARE _u text := nullif(new.raw_user_meta_data->>'username',''); _p text := coalesce(new.raw_user_meta_data->>'phone','');
 _ref text := upper(nullif(new.raw_user_meta_data->>'ref','')); _rid uuid;
BEGIN
 IF _ref IS NOT NULL THEN SELECT id INTO _rid FROM public.profiles WHERE referral_code=_ref AND status='active'; END IF;
 INSERT INTO public.profiles(id,username,phone,handle,referral_code,referred_by) VALUES(new.id,left(coalesce(_u,nullif(new.raw_user_meta_data->>'display_name',''),nullif(new.raw_user_meta_data->>'full_name',''),'Player'),60),_p,lower(_u),upper(substr(replace(new.id::text,'-',''),1,8)),_rid);
 IF _rid IS NOT NULL THEN INSERT INTO public.referrals(referred_id,referrer_id) VALUES(new.id,_rid); END IF;
 RETURN new;
END
$fn$;

CREATE OR REPLACE FUNCTION public.record_player_signal(_user_id uuid, _ip text, _device text) RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path=public AS $fn$
 INSERT INTO public.player_signals(user_id,ip,device_id) VALUES(_user_id,left(coalesce(_ip,''),64),left(coalesce(_device,''),64))
$fn$;
REVOKE EXECUTE ON FUNCTION public.record_player_signal(uuid,text,text) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.referral_fraud_reason(_referred uuid, _referrer uuid) RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $fn$
 WITH grp AS (SELECT _referrer AS id UNION SELECT referred_id FROM public.referrals WHERE referrer_id=_referrer AND referred_id<>_referred),
 me AS (SELECT * FROM public.profiles WHERE id=_referred)
 SELECT CASE
  WHEN EXISTS(SELECT 1 FROM public.player_signals a JOIN public.player_signals b ON b.device_id=a.device_id AND a.device_id<>'' WHERE a.user_id=_referred AND b.user_id IN (SELECT id FROM grp)) THEN 'same device'
  WHEN EXISTS(SELECT 1 FROM public.player_signals a JOIN public.player_signals b ON b.ip=a.ip AND a.ip<>'' WHERE a.user_id=_referred AND b.user_id IN (SELECT id FROM grp)) THEN 'same IP'
  WHEN EXISTS(SELECT 1 FROM public.profiles p, me WHERE p.id IN (SELECT id FROM grp) AND lower(p.username)=lower(me.username)) THEN 'same name'
  WHEN EXISTS(SELECT 1 FROM public.payment_requests a JOIN public.payment_requests b ON b.account_number=a.account_number AND a.account_number<>'' WHERE a.user_id=_referred AND b.user_id IN (SELECT id FROM grp)) THEN 'same bKash/Nagad/Rocket account'
  ELSE NULL END
$fn$;
REVOKE EXECUTE ON FUNCTION public.referral_fraud_reason(uuid,uuid) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.credit_referral(_referrer uuid, _amount numeric, _kind text, _milestone int, _req uuid, _referred uuid, _msg text) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $fn$
DECLARE b numeric;
BEGIN
 IF _amount<=0 THEN RETURN false; END IF;
 BEGIN
  INSERT INTO public.referral_rewards(referrer_id,kind,milestone,source_request_id,referred_id,amount) VALUES(_referrer,_kind,_milestone,_req,_referred,_amount);
 EXCEPTION WHEN unique_violation THEN RETURN false;
 END;
 UPDATE public.profiles SET balance=balance+_amount WHERE id=_referrer AND status='active' AND NOT flagged RETURNING balance INTO b;
 IF NOT FOUND THEN RAISE EXCEPTION 'referrer unavailable'; END IF;
 INSERT INTO public.account_activity(user_id,actor_id,kind,amount,balance_after,reason) VALUES(_referrer,_referrer,'referral_'||_kind,_amount,b,_msg);
 INSERT INTO public.player_messages(user_id,title,body) VALUES(_referrer,'আমন্ত্রণ বোনাস','অভিনন্দন! '||_msg||' ৳'||_amount||' আপনার অ্যাকাউন্টে জমা হয়েছে।');
 RETURN true;
END
$fn$;
REVOKE EXECUTE ON FUNCTION public.credit_referral(uuid,numeric,text,int,uuid,uuid,text) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.evaluate_referral(_referred uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $fn$
DECLARE r public.referrals%ROWTYPE; first_dep numeric; fraud text; cnt int; m record;
BEGIN
 SELECT * INTO r FROM public.referrals WHERE referred_id=_referred FOR UPDATE;
 IF NOT FOUND OR r.status<>'pending' THEN RETURN; END IF;
 SELECT amount INTO first_dep FROM public.payment_requests WHERE user_id=_referred AND kind='deposit' AND status='approved' ORDER BY reviewed_at LIMIT 1;
 IF first_dep IS NULL OR first_dep<300 OR public.player_turnover(_referred,'-infinity'::timestamptz,'infinity'::timestamptz)<3000 THEN RETURN; END IF;
 fraud := public.referral_fraud_reason(_referred, r.referrer_id);
 IF fraud IS NOT NULL THEN
  UPDATE public.referrals SET status='disqualified', reason=fraud WHERE referred_id=_referred;
  UPDATE public.profiles SET flagged=true, flag_reason='Referral fraud: '||fraud WHERE id IN (_referred, r.referrer_id);
  RETURN;
 END IF;
 UPDATE public.referrals SET status='valid', qualified_at=now() WHERE referred_id=_referred;
 SELECT count(*) INTO cnt FROM public.referrals WHERE referrer_id=r.referrer_id AND status='valid';
 FOR m IN SELECT * FROM public.referral_milestones WHERE valid_count<=cnt ORDER BY valid_count LOOP
  PERFORM public.credit_referral(r.referrer_id,m.bonus,'milestone',m.valid_count,NULL,NULL,m.valid_count||' জন বৈধ আমন্ত্রণ বোনাস');
 END LOOP;
EXCEPTION WHEN raise_exception THEN RETURN;
END
$fn$;
REVOKE EXECUTE ON FUNCTION public.evaluate_referral(uuid) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.on_deposit_approved() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $fn$
BEGIN
 IF new.kind='deposit' AND new.status='approved' AND old.status IS DISTINCT FROM 'approved' THEN
  PERFORM public.refresh_vip_level(new.user_id);
  PERFORM public.evaluate_referral(new.user_id);
 END IF;
 RETURN new;
END
$fn$;

CREATE OR REPLACE FUNCTION public.distribute_referral_commission() RETURNS int LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $fn$
DECLARE d record; n int := 0;
BEGIN
 PERFORM pg_advisory_xact_lock(570023);
 FOR d IN SELECT pr.id, pr.amount, pr.user_id, r.referrer_id FROM public.payment_requests pr
  JOIN public.referrals r ON r.referred_id=pr.user_id AND r.status='valid'
  JOIN public.profiles ref ON ref.id=r.referrer_id AND ref.status='active' AND NOT ref.flagged
  WHERE pr.kind='deposit' AND pr.status='approved' AND pr.reviewed_at>=r.qualified_at - interval '365 days'
   AND NOT EXISTS(SELECT 1 FROM public.referral_rewards w WHERE w.source_request_id=pr.id)
  LIMIT 1000
 LOOP
  IF public.credit_referral(d.referrer_id, round(d.amount*0.005,2), 'deposit_commission', NULL, d.id, d.user_id, 'আমন্ত্রিত বন্ধুর জমার 0.5% কমিশন') THEN n := n+1; END IF;
 END LOOP;
 RETURN n;
END
$fn$;
REVOKE EXECUTE ON FUNCTION public.distribute_referral_commission() FROM PUBLIC, anon, authenticated;