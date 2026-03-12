-- ============================================================
-- AffiliateHub Pro - Full Database Setup (Schema + Seed)
-- Run this in your Supabase SQL Editor to initialize your project
-- ============================================================

-- 0. CLEANUP (Optional - Uncomment if you want to start fresh)
-- DROP TABLE IF EXISTS submissions;
-- DROP TABLE IF EXISTS ads;
-- DROP TABLE IF EXISTS seo_settings;
-- DROP TABLE IF EXISTS blog_posts;
-- DROP TABLE IF EXISTS products;
-- DROP TABLE IF EXISTS categories;
-- DROP TABLE IF EXISTS profiles;

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    role TEXT CHECK (role IN ('user', 'admin')) DEFAULT 'user',
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('product', 'blog')) NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    pros TEXT[] DEFAULT '{}',
    cons TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    rating NUMERIC DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    affiliate_link TEXT,
    category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
    featured_image TEXT,
    gallery_images TEXT[] DEFAULT '{}',
    meta_title TEXT,
    meta_description TEXT,
    schema_enabled BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
    price_range TEXT,
    brand TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BLOG POSTS
CREATE TABLE IF NOT EXISTS blog_posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT,
    excerpt TEXT,
    featured_image TEXT,
    category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    meta_title TEXT,
    meta_description TEXT,
    faq_schema JSONB DEFAULT '[]',
    tags TEXT[] DEFAULT '{}',
    status TEXT CHECK (status IN ('draft', 'published', 'scheduled')) DEFAULT 'draft',
    scheduled_at TIMESTAMPTZ,
    read_time INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ADS
CREATE TABLE IF NOT EXISTS ads (
    id TEXT PRIMARY KEY,
    ad_name TEXT NOT NULL,
    ad_type TEXT CHECK (ad_type IN ('adsense', 'custom_html', 'image', 'script', 'affiliate_banner')) NOT NULL,
    ad_code TEXT,
    image_url TEXT,
    link_url TEXT,
    placement TEXT NOT NULL,
    device_target TEXT CHECK (device_target IN ('desktop', 'mobile', 'both')) DEFAULT 'both',
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    status BOOLEAN DEFAULT TRUE,
    width INTEGER,
    height INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SEO SETTINGS
CREATE TABLE IF NOT EXISTS seo_settings (
    id TEXT PRIMARY KEY,
    site_title TEXT NOT NULL,
    site_tagline TEXT,
    default_meta_description TEXT,
    search_console_meta TEXT,
    search_console_enabled BOOLEAN DEFAULT FALSE,
    ga_measurement_id TEXT,
    ga_enabled BOOLEAN DEFAULT FALSE,
    ga_affiliate_tracking BOOLEAN DEFAULT FALSE,
    robots_txt TEXT,
    og_default_image TEXT,
    site_logo TEXT,
    favicon_url TEXT,
    affiliate_disclosure TEXT,
    twitter_handle TEXT,
    facebook_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SUBMISSIONS
CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT CHECK (status IN ('new', 'read', 'replied')) DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ENABLE RLS (Row Level Security) - Basic Setup
-- ============================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Public Read Access Policies
CREATE POLICY "Allow public read-only access on categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access on blog_posts" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access on seo_settings" ON seo_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access on profiles" ON profiles FOR SELECT USING (true);

-- Admin Access would typically be handled via service role or specific UID checks

-- ============================================================
-- INSERT SEED DATA
-- ============================================================

-- 1. CATEGORIES
INSERT INTO categories (id, name, slug, description, type, meta_title, meta_description, image_url, created_at, updated_at)
VALUES
  ('cat-tech-001', 'Laptops & Computers', 'laptops-computers', 'Find the best laptops and desktops for work, gaming, and creative tasks.', 'product', 'Best Laptops & Computers 2025', 'Expert-reviewed laptops and computers with honest comparisons and best deals.', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', now(), now()),
  ('cat-tech-002', 'Smartphones', 'smartphones', 'Top smartphones reviewed and compared for every budget.', 'product', 'Best Smartphones 2025', 'Comprehensive smartphone reviews, comparisons, and buying guides.', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', now(), now()),
  ('cat-tech-003', 'Audio & Headphones', 'audio-headphones', 'Premium headphones, earbuds, and speakers tested by experts.', 'product', 'Best Headphones & Audio 2025', 'Expert reviews of headphones, earbuds, and speakers.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', now(), now()),
  ('cat-tech-004', 'Smart Home', 'smart-home', 'Smart home devices, security cameras, and automation gadgets.', 'product', 'Best Smart Home Devices 2025', 'Reviews of smart speakers, cameras, thermostats and more.', 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400', now(), now()),
  ('cat-tech-005', 'Gaming', 'gaming', 'Gaming consoles, accessories, and peripherals reviewed.', 'product', 'Best Gaming Gear 2025', 'Expert gaming gear reviews and recommendations.', 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400', now(), now()),
  ('cat-tech-006', 'Cameras & Photography', 'cameras-photography', 'Cameras, lenses, and photography gear for beginners to pros.', 'product', 'Best Cameras 2025', 'Camera reviews and photography equipment guides.', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400', now(), now()),
  ('cat-blog-001', 'Buying Guides', 'buying-guides', 'In-depth buying guides to help you make informed decisions.', 'blog', 'Buying Guides', 'Expert buying guides and product comparisons.', NULL, now(), now()),
  ('cat-blog-002', 'Tech News', 'tech-news', 'Latest technology news, announcements, and industry updates.', 'blog', 'Tech News', 'Stay updated with the latest technology news and trends.', NULL, now(), now()),
  ('cat-blog-003', 'How-To & Tips', 'how-to-tips', 'Practical tutorials and tips to get more from your tech.', 'blog', 'How-To Guides & Tips', 'Practical technology tutorials, tips and tricks.', NULL, now(), now())
ON CONFLICT (id) DO NOTHING;

-- 2. PRODUCTS
INSERT INTO products (id, title, slug, description, short_description, pros, cons, features, rating, review_count, affiliate_link, category_id, featured_image, meta_title, meta_description, schema_enabled, featured, status, price_range, brand, created_at, updated_at)
VALUES
  ('prod-001', 'Apple MacBook Pro 16" M4 Max', 'apple-macbook-pro-16-m4-max', '<h2>Ultimate Performance</h2>...', 'Apple''s most powerful laptop...', ARRAY['Powerful', 'Battery'], ARRAY['Price'], ARRAY['M4 Max'], 4.9, 2847, 'https://www.amazon.com/dp/B0DLLF9ZCL', 'cat-tech-001', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', 'Title', 'Desc', true, true, 'published', '$3,499+', 'Apple', now(), now()),
  ('prod-002', 'Sony WH-1000XM6', 'sony-wh-1000xm6', '<h2>Noise Cancelling</h2>...', 'Gold standard...', ARRAY['ANC', 'Sound'], ARRAY['Price'], ARRAY['30mm drivers'], 4.8, 5632, 'https://www.amazon.com/dp/B0DKYZ123', 'cat-tech-003', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 'Title', 'Desc', true, true, 'published', '$349+', 'Sony', now(), now()),
  ('prod-003', 'Samsung Galaxy S25 Ultra', 'samsung-galaxy-s25-ultra', '<h2>Flagship</h2>...', 'Pinnacle...', ARRAY['Camera', 'AI'], ARRAY['Price'], ARRAY['200MP'], 4.7, 8921, 'https://www.amazon.com/dp/B0DS5ZZ123', 'cat-tech-002', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800', 'Title', 'Desc', true, true, 'published', '$1,299+', 'Samsung', now(), now()),
  ('prod-004', 'PlayStation 5 Pro', 'playstation-5-pro', '<h2>Gaming</h2>...', 'Evolved...', ARRAY['GPU', 'AI'], ARRAY['Price'], ARRAY['16.7 TFLOPS'], 4.6, 4215, 'https://www.amazon.com/dp/B0DPB1Z123', 'cat-tech-005', 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800', 'Title', 'Desc', true, true, 'published', '$699', 'Sony', now(), now()),
  ('prod-005', 'Apple AirPods Pro 3', 'apple-airpods-pro-3', '<h2>TWS</h2>...', 'Best...', ARRAY['ANC', 'Sound'], ARRAY['Tips'], ARRAY['H3 chip'], 4.8, 12450, 'https://www.amazon.com/dp/B0DGZ1Z123', 'cat-tech-003', 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800', 'Title', 'Desc', true, false, 'published', '$249', 'Apple', now(), now()),
  ('prod-006', 'Amazon Echo Show 15', 'amazon-echo-show-15', '<h2>Smart Hub</h2>...', 'Family...', ARRAY['Large', 'Widgets'], ARRAY['Locked'], ARRAY['15.6 inch'], 4.5, 3876, 'https://www.amazon.com/dp/B0BFC123', 'cat-tech-004', 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=800', 'Title', 'Desc', true, false, 'published', '$249', 'Amazon', now(), now()),
  ('prod-007', 'Canon EOS R6 Mark III', 'canon-eos-r6-mark-iii', '<h2>Hybrid</h2>...', 'Stunning...', ARRAY['AF', 'Burst'], ARRAY['Price'], ARRAY['24.2MP'], 4.7, 1543, 'https://www.amazon.com/dp/B0DR6Z123', 'cat-tech-006', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800', 'Title', 'Desc', true, false, 'published', '$2,499', 'Canon', now(), now()),
  ('prod-008', 'Logitech G Pro X TKL', 'logitech-g-pro-x-tkl-rapid', '<h2>Esports</h2>...', 'Engineered...', ARRAY['Switches', 'Wireless'], ARRAY['Price'], ARRAY['Magnetic Hall'], 4.6, 2198, 'https://www.amazon.com/dp/B0DPR7Z123', 'cat-tech-005', 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800', 'Title', 'Desc', true, false, 'published', '$229', 'Logitech', now(), now())
ON CONFLICT (id) DO NOTHING;

-- 3. SEO SETTINGS
INSERT INTO seo_settings (id, site_title, site_tagline, default_meta_description, robots_txt, affiliate_disclosure, updated_at)
VALUES
  ('seo-default', 'AffiliateHub Pro', 'Honest Reviews & Best Deals', 'Your trusted source...', 'User-agent: *...', 'AffiliateHub Pro is reader-supported...', now())
ON CONFLICT (id) DO NOTHING;
