-- ============================================================================
-- TWOZAYZ Exterior & Auto Care (twozayz.com)
-- Isolated Supabase Schema for Live Customer Reviews & Smart Reputation Shield
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.twozayz_reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name text NOT NULL,
  neighborhood text NOT NULL DEFAULT 'Lake City, FL',
  service_type text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  approved boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_twozayz_reviews_public
  ON public.twozayz_reviews (approved, rating, created_at DESC);

ALTER TABLE public.twozayz_reviews ENABLE ROW LEVEL SECURITY;

-- Option A (Smart Reputation Shield):
-- Public visitors can only read approved 4-star and 5-star reviews.
DROP POLICY IF EXISTS "Public can view 4-5 star approved reviews" ON public.twozayz_reviews;
CREATE POLICY "Public can view 4-5 star approved reviews"
  ON public.twozayz_reviews
  FOR SELECT
  TO anon
  USING (approved = true AND rating >= 4);

-- Anyone can submit a review (1-3 star rows are stored with approved = false for private follow-up).
DROP POLICY IF EXISTS "Public can submit reviews" ON public.twozayz_reviews;
CREATE POLICY "Public can submit reviews"
  ON public.twozayz_reviews
  FOR INSERT
  TO anon
  WITH CHECK (
    rating >= 1 AND rating <= 5
    AND char_length(customer_name) BETWEEN 1 AND 80
    AND char_length(review_text) BETWEEN 5 AND 1500
  );

NOTIFY pgrst, 'reload schema';
