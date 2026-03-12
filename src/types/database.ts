export type Profile = {
    id: string;
    email: string | null;
    role: 'user' | 'admin';
    display_name: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
};

export type Category = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    type: 'product' | 'blog';
    meta_title: string | null;
    meta_description: string | null;
    image_url: string | null;
    created_at: string;
    updated_at: string;
};

export type Product = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    short_description: string | null;
    pros: string[];
    cons: string[];
    features: string[];
    rating: number;
    review_count: number;
    affiliate_link: string | null;
    category_id: string | null;
    featured_image: string | null;
    gallery_images: string[];
    meta_title: string | null;
    meta_description: string | null;
    schema_enabled: boolean;
    featured: boolean;
    status: 'draft' | 'published';
    price_range: string | null;
    brand: string | null;
    specifications: Record<string, string> | null;
    variants: Array<{ name: string; options: string[] }> | null;
    created_at: string;
    updated_at: string;
};

export type BlogPost = {
    id: string;
    title: string;
    slug: string;
    content: string | null;
    excerpt: string | null;
    featured_image: string | null;
    category_id: string | null;
    author_id: string | null;
    meta_title: string | null;
    meta_description: string | null;
    faq_schema: Array<{ question: string; answer: string }>;
    tags: string[];
    status: 'draft' | 'published' | 'scheduled';
    scheduled_at: string | null;
    read_time: number;
    views: number;
    created_at: string;
    updated_at: string;
};

export type Ad = {
    id: string;
    ad_name: string;
    ad_type: 'adsense' | 'custom_html' | 'image' | 'script' | 'affiliate_banner';
    ad_code: string | null;
    image_url: string | null;
    link_url: string | null;
    placement: string;
    device_target: 'desktop' | 'mobile' | 'both';
    start_date: string | null;
    end_date: string | null;
    status: boolean;
    width: number;
    height: number;
    created_at: string;
    updated_at: string;
};

export type SEOSettings = {
    id: string;
    site_title: string;
    site_tagline: string | null;
    default_meta_description: string | null;
    search_console_meta: string | null;
    search_console_enabled: boolean;
    ga_measurement_id: string | null;
    ga_enabled: boolean;
    ga_affiliate_tracking: boolean;
    robots_txt: string | null;
    og_default_image: string | null;
    site_logo: string | null;
    favicon_url: string | null;
    affiliate_disclosure: string | null;
    twitter_handle: string | null;
    facebook_url: string | null;
    updated_at: string;
};

export type Submission = {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'replied';
    created_at: string;
};

export type Database = {
    public: {
        Tables: {
            profiles: { Row: Profile };
            categories: { Row: Category };
            products: { Row: Product };
            blog_posts: { Row: BlogPost };
            ads: { Row: Ad };
            seo_settings: { Row: SEOSettings };
            submissions: { Row: Submission };
        };
    };
};
