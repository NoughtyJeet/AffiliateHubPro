-- Database Protocol Update: Primary Key Auto-Generation Fix
-- This script ensures that products and categories tables can accept new records without a client-provided ID.

-- 1. PRODUCTS TABLE AUTO-ID
-- Add gen_random_uuid()::text as default for the TEXT primary key
ALTER TABLE public.products 
ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;

-- 2. CATEGORIES TABLE AUTO-ID
-- Add gen_random_uuid()::text as default for the TEXT primary key
ALTER TABLE public.categories 
ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;

-- 3. VERIFY RLS (Ensure admin can insert)
-- Sometimes RLS might be blocking if not explicitly allowed for the authenticated user
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'products' AND policyname = 'Admin Full Access Products'
    ) THEN
        CREATE POLICY "Admin Full Access Products" ON public.products 
        FOR ALL USING (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'categories' AND policyname = 'Admin Full Access Categories'
    ) THEN
        CREATE POLICY "Admin Full Access Categories" ON public.categories 
        FOR ALL USING (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
    END IF;
END $$;
