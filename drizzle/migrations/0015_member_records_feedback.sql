CREATE POLICY member_ledger_read ON public.financial_ledger FOR SELECT TO authenticated USING(user_id=auth.uid());
CREATE POLICY member_financial_activity_read ON public.account_activity FOR SELECT TO authenticated USING(user_id=auth.uid() AND amount IS NOT NULL);
CREATE TABLE public.player_feedback(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid NOT NULL REFERENCES public.profiles(id),category text NOT NULL DEFAULT 'feedback' CHECK(category IN ('feedback','support')),message text NOT NULL CHECK(char_length(trim(message)) BETWEEN 5 AND 2000),created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT,INSERT ON public.player_feedback TO authenticated;
GRANT ALL ON public.player_feedback TO service_role;
ALTER TABLE public.player_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY feedback_owner_read ON public.player_feedback FOR SELECT TO authenticated USING(user_id=auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY feedback_owner_insert ON public.player_feedback FOR INSERT TO authenticated WITH CHECK(user_id=auth.uid());
CREATE INDEX player_feedback_user_date ON public.player_feedback(user_id,created_at DESC);