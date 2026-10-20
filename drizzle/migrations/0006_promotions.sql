CREATE TABLE public.promotions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 title text NOT NULL,
 category text NOT NULL DEFAULT 'all' CHECK (category IN ('all','app','partner')),
 theme text NOT NULL DEFAULT 'mystery' CHECK (theme IN ('mystery','vip','invite')),
 headline text NOT NULL DEFAULT '',
 subline text NOT NULL DEFAULT '',
 highlights text[] NOT NULL DEFAULT '{}',
 details text NOT NULL DEFAULT '',
 sort_order int NOT NULL DEFAULT 0,
 active boolean NOT NULL DEFAULT true,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.promotions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.promotions TO authenticated;
GRANT ALL ON public.promotions TO service_role;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
CREATE POLICY active_promotion ON public.promotions FOR SELECT TO anon, authenticated USING (active);
CREATE POLICY admin_promotion_manage ON public.promotions FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
INSERT INTO public.promotions(title,category,theme,headline,subline,highlights,details,sort_order) VALUES
('রহস্য বোনাস','all','mystery','রহস্যময় পুরস্কার প্রতি মাসের 20 তারিখ','পরবর্তী সৌভাগ্যবান বিজয়ী হতে পারেন আপনিই!',ARRAY['৳570 কোটির টাকার একচেটিয়া বিনামূল্যে নগদ পুরস্কার'],'প্রতি মাসের 20 তারিখে সক্রিয় সদস্যদের মধ্যে রহস্য বোনাস বিতরণ করা হয়। শর্তাবলী প্রযোজ্য।',1),
('ভিআইপি সদস্য সুবিধা','all','vip','ভিআইপি সদস্যপদ সুবিধা','',ARRAY['প্রচারের বোনাস: 20,00,000','সাপ্তাহিক বেতন: 4,00,000','মাসিক বেতন: 20,00,000'],'ভিআইপি লেভেল বাড়ার সাথে সাথে প্রচারের বোনাস, সাপ্তাহিক ও মাসিক বেতন পান। শর্তাবলী প্রযোজ্য।',2),
('1 জনকে আমন্ত্রণ জানান...','partner','invite','3টি সুবিধা পেতে বন্ধুদের আমন্ত্রণ জানান','',ARRAY['৳300 প্রতিটি আমন্ত্রণে উপার্জন','0.5% প্রতিটি জমার মাধ্যমে উপার্জন','1% প্রতিটি বাজিতে উপার্জন'],'বন্ধুদের আমন্ত্রণ জানান এবং তাদের জমা ও বাজি থেকে কমিশন উপার্জন করুন। শর্তাবলী প্রযোজ্য।',3);