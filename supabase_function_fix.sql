-- Security Protocol: Database Function Hardening
-- This script fixes the "mutable search_path" warning for the update_updated_at_column function.
-- Setting an explicit search_path prevents search path shadowing attacks.

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Verification:
-- Ensure this is applied to all triggers that use it.
-- This redefinition automatically applies to existing triggers:
-- update_blog_posts_updated_at
-- update_ads_updated_at
-- update_site_settings_updated_at
-- update_products_updated_at
