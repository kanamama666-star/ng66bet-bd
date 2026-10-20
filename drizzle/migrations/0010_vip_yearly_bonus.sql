ALTER TABLE public.vip_bonus_awards DROP CONSTRAINT vip_bonus_awards_kind_check;
ALTER TABLE public.vip_bonus_awards ADD CONSTRAINT vip_bonus_awards_kind_check CHECK (kind IN ('upgrade','weekly','monthly','yearly'));
CREATE OR REPLACE FUNCTION public.distribute_vip_yearly_bonus() RETURNS int LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $fn$
DECLARE p record; n int := 0; per date := date_trunc('year', now() AT TIME ZONE 'Asia/Dhaka')::date;
BEGIN
 PERFORM pg_advisory_xact_lock(570022);
 FOR p IN SELECT id, vip_level FROM public.profiles WHERE status='active' AND vip_level>=1 LOOP
  IF public.credit_vip_bonus(p.id,'yearly',p.vip_level,per,5*p.vip_level,'বার্ষিক বোনাস') THEN n := n+1; END IF;
 END LOOP;
 RETURN n;
END
$fn$;
REVOKE EXECUTE ON FUNCTION public.distribute_vip_yearly_bonus() FROM PUBLIC, anon, authenticated;