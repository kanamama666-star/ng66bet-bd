ALTER TABLE public.profiles ADD COLUMN handle text;
CREATE UNIQUE INDEX profiles_handle_key ON public.profiles (handle) WHERE handle IS NOT NULL;
CREATE UNIQUE INDEX profiles_phone_key ON public.profiles (phone) WHERE phone <> '';
CREATE OR REPLACE FUNCTION public.create_player_profile() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE _u text := nullif(new.raw_user_meta_data->>'username',''); _p text := coalesce(new.raw_user_meta_data->>'phone','');
BEGIN
 INSERT INTO public.profiles(id,username,phone,handle) VALUES(new.id,left(coalesce(_u,nullif(new.raw_user_meta_data->>'display_name',''),nullif(new.raw_user_meta_data->>'full_name',''),'Player'),60),_p,lower(_u));
 RETURN new;
END; $$;
REVOKE EXECUTE ON FUNCTION public.create_player_profile() FROM PUBLIC, anon, authenticated;
CREATE FUNCTION public.player_login_email(_identifier text) RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
 SELECT u.email FROM public.profiles p JOIN auth.users u ON u.id=p.id
 WHERE (p.handle = lower(trim(_identifier)) OR (p.phone <> '' AND p.phone = trim(_identifier))) AND p.status='active' LIMIT 1
$$;
REVOKE EXECUTE ON FUNCTION public.player_login_email(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.player_login_email(text) TO service_role;
CREATE FUNCTION public.player_identity_taken(_handle text,_phone text) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
 SELECT EXISTS(SELECT 1 FROM public.profiles WHERE handle=lower(_handle) OR phone=_phone)
$$;
REVOKE EXECUTE ON FUNCTION public.player_identity_taken(text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.player_identity_taken(text,text) TO service_role;