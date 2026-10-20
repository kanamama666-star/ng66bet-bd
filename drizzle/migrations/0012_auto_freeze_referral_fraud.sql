CREATE OR REPLACE FUNCTION public.freeze_referral_fraud(_user uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $fn$
DECLARE r record; fraud text;
BEGIN
 FOR r IN SELECT * FROM public.referrals WHERE (referred_id=_user OR referrer_id=_user) AND status<>'disqualified' LOOP
  fraud := public.referral_fraud_reason(r.referred_id, r.referrer_id);
  IF fraud IS NOT NULL THEN
   UPDATE public.referrals SET status='disqualified', reason=fraud WHERE referred_id=r.referred_id;
   UPDATE public.profiles SET flagged=true, status='banned', flag_reason='Auto-frozen · referral fraud: '||fraud WHERE id IN (r.referred_id, r.referrer_id) AND NOT flagged;
   INSERT INTO public.account_activity(user_id,actor_id,kind,reason)
    SELECT id,id,'auto_freeze','Account frozen automatically: '||fraud FROM unnest(ARRAY[r.referred_id,r.referrer_id]) id;
  END IF;
 END LOOP;
END $fn$;
REVOKE EXECUTE ON FUNCTION public.freeze_referral_fraud(uuid) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.on_fraud_signal() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $fn$
BEGIN PERFORM public.freeze_referral_fraud(new.user_id); RETURN NULL; END $fn$;
REVOKE EXECUTE ON FUNCTION public.on_fraud_signal() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER fraud_check_signal AFTER INSERT ON public.player_signals FOR EACH ROW EXECUTE FUNCTION public.on_fraud_signal();
CREATE TRIGGER fraud_check_payment AFTER INSERT ON public.payment_requests FOR EACH ROW EXECUTE FUNCTION public.on_fraud_signal();

CREATE OR REPLACE FUNCTION public.credit_vip_bonus(_user_id uuid, _kind text, _level int, _period date, _amount numeric, _label text) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $fn$
DECLARE b numeric;
BEGIN
 IF _amount<=0 OR NOT EXISTS(SELECT 1 FROM public.profiles WHERE id=_user_id AND status='active' AND NOT flagged) THEN RETURN false; END IF;
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