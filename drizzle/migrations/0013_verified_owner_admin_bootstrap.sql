CREATE OR REPLACE FUNCTION public.is_authorized_admin_email(_email text, _confirmed_at timestamptz)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = public AS $$
 SELECT _confirmed_at IS NOT NULL AND lower(trim(coalesce(_email, ''))) = 'kanamama666@gmail.com';
$$;
REVOKE ALL ON FUNCTION public.is_authorized_admin_email(text,timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_authorized_admin_email(text,timestamptz) TO service_role;
CREATE OR REPLACE FUNCTION public.bootstrap_verified_owner_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 IF public.is_authorized_admin_email(new.email, new.email_confirmed_at) THEN
  INSERT INTO public.user_roles(user_id,role) VALUES(new.id,'admin') ON CONFLICT (user_id,role) DO NOTHING;
 END IF;
 RETURN new;
END;
$$;
REVOKE ALL ON FUNCTION public.bootstrap_verified_owner_admin() FROM PUBLIC;
CREATE TRIGGER bootstrap_verified_owner_admin_insert AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.bootstrap_verified_owner_admin();
CREATE TRIGGER bootstrap_verified_owner_admin_verified AFTER UPDATE OF email_confirmed_at,email ON auth.users FOR EACH ROW EXECUTE FUNCTION public.bootstrap_verified_owner_admin();
DO $$ BEGIN
 IF public.is_authorized_admin_email('kanamama666@gmail.com',NULL) THEN RAISE EXCEPTION 'Unverified owner must not be admin'; END IF;
 IF NOT public.is_authorized_admin_email('kanamama666@gmail.com',now()) THEN RAISE EXCEPTION 'Verified owner must qualify'; END IF;
 IF public.is_authorized_admin_email('attacker@gmail.com',now()) THEN RAISE EXCEPTION 'Other email must not qualify'; END IF;
END $$;