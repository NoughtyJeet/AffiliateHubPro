-- Subscription Lead Magnet
-- Run this in Supabase SQL Editor to enable user growth tracking.

CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    source TEXT DEFAULT 'popup',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can insert subscribers" ON public.subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view subscribers" ON public.subscribers FOR SELECT USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin' OR role = 'super_admin'));
