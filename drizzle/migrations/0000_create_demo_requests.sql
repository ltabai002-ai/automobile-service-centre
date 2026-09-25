CREATE TABLE public.demo_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  showroom TEXT NOT NULL CHECK (char_length(showroom) BETWEEN 2 AND 160),
  phone TEXT NOT NULL CHECK (phone ~ '^[6-9][0-9]{9}$'),
  email TEXT,
  city TEXT,
  executives TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.demo_requests TO anon;
GRANT INSERT ON public.demo_requests TO authenticated;
GRANT ALL ON public.demo_requests TO service_role;
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can request a demo"
ON public.demo_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(name) BETWEEN 2 AND 120
  AND char_length(showroom) BETWEEN 2 AND 160
  AND phone ~ '^[6-9][0-9]{9}$'
  AND executives IN ('1–5', '6–15', '16–30', '30+')
  AND vehicle_type IN ('Cars', 'Two-Wheelers', 'Both', 'Commercial')
);