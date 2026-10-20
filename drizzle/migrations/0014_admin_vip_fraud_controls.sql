CREATE OR REPLACE FUNCTION public.admin_manage_player_access(_user_id uuid,_vip_level integer,_frozen boolean,_reason text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE actor uuid:=auth.uid();
BEGIN
 IF actor IS NULL OR NOT public.has_role(actor,'admin') OR NOT EXISTS(SELECT 1 FROM public.profiles WHERE id=actor AND status='active' AND NOT flagged) THEN RAISE EXCEPTION 'Administrator access required'; END IF;
 IF _reason IS NULL OR length(trim(_reason)) NOT BETWEEN 3 AND 500 OR _frozen IS NULL OR _vip_level IS NULL OR _vip_level<0 OR (_vip_level>0 AND NOT EXISTS(SELECT 1 FROM public.vip_tiers WHERE level=_vip_level)) THEN RAISE EXCEPTION 'Invalid account access settings'; END IF;
 PERFORM 1 FROM public.profiles WHERE id=_user_id FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Account not found'; END IF;
 IF _frozen AND public.has_role(_user_id,'admin') THEN RAISE EXCEPTION 'Remove administrator role before freezing this account'; END IF;
 UPDATE public.profiles SET vip_level=_vip_level,vip=(_vip_level>0),flagged=_frozen,flag_reason=CASE WHEN _frozen THEN trim(_reason) ELSE NULL END,status=CASE WHEN _frozen THEN 'banned' ELSE 'active' END WHERE id=_user_id;
 INSERT INTO public.account_activity(user_id,actor_id,kind,reason) VALUES(_user_id,actor,'access_review','VIP '||_vip_level||'; '||CASE WHEN _frozen THEN 'Frozen' ELSE 'Unfrozen / active' END||': '||trim(_reason));
END;
$$;
REVOKE ALL ON FUNCTION public.admin_manage_player_access(uuid,integer,boolean,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.admin_manage_player_access(uuid,integer,boolean,text) TO authenticated,service_role;