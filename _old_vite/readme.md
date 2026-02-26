 AffiliateHub - Amazon Affiliate E-commerce & SEO Blogging Platform

## Project Overview
A high-performance Amazon affiliate + SEO blogging platform built with React + Vite + Supabase.

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend/Auth**: Supabase (PostgreSQL + Auth)
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Project Structure
```
src/
├── lib/
│   └── supabase.ts           # Supabase client + TypeScript types
├── contexts/
│   └── AuthContext.tsx       # Auth state + user/admin roles
├── hooks/
│   └── useSEOSettings.ts     # SEO settings hook
├── components/
│   ├── layout/
│   │   ├── Header.tsx        # Nav with dropdowns, auth buttons
│   │   ├── Footer.tsx        # Footer with affiliate disclosure
│   │   └── MainLayout.tsx    # Layout wrapper with ads
│   ├── seo/
│   │   └── SEOHead.tsx       # Dynamic meta, GA4, schema injection
│   ├── ads/
│   │   └── AdBanner.tsx      # Dynamic ad rendering by placement
│   ├── products/
│   │   └── ProductCard.tsx   # Product card with save/affiliate tracking
│   └── blog/
│       └── BlogCard.tsx      # Blog post card
├── pages/
│   ├── HomePage.tsx          # Hero, categories, products, blog sections
│   ├── CategoryPage.tsx      # Category listing with filters
│   ├── ProductPage.tsx       # Product detail, pros/cons, FAQ, schema
│   ├── BlogListingPage.tsx   # Blog listing with categories
│   ├── BlogPostPage.tsx      # Blog post with TOC, FAQ, ads
│   ├── auth/
│   │   ├── LoginPage.tsx     # Email login + JWT session
│   │   ├── SignupPage.tsx    # Email signup + password strength
│   │   └── ForgotPasswordPage.tsx
│   ├── user/
│   │   └── DashboardPage.tsx # Saved products, profile, account mgmt
│   └── admin/
│       ├── AdminLayout.tsx   # Admin sidebar + RBAC guard
│       ├── AdminDashboard.tsx # Stats overview
│       ├── AdminProducts.tsx  # Product CRUD
│       ├── AdminBlog.tsx      # Blog post CRUD + FAQ builder
│       ├── AdminCategories.tsx # Category CRUD
│       ├── AdminAds.tsx       # Ad management (placement, scheduling)
│       ├── AdminSEO.tsx       # Google Search Console, GA4, Robots, Sitemap
│       └── AdminSettings.tsx  # Site identity, disclosure, social
```

## Supabase Configuration
- **Project ID**: rbmdzsbgrgpyaydmsyan
- **URL**: https://rbmdzsbgrgpyaydmsyan.supabase.co
- **Anon Key**: stored in src/lib/supabase.ts

## Database Tables
- `profiles` - User profiles (role: user/admin)
- `categories` - Product & blog categories (SEO meta)
- `products` - Amazon affiliate products (pros/cons/features/rating)
- `blog_posts` - Long-form blog posts with FAQ schema
- `ads` - Ad units with placement/device/schedule control
- `seo_settings` - Global SEO, GA4, Search Console settings
- `saved_products` - User saved/favorited products
- `blog_comments` - Blog post comments (moderated)

## User Roles
- **Visitor**: Browse public content
- **User** (registered): Save products, comment on posts, manage profile
- **Admin**: Full access to /admin panel

## Admin Panel Routes
- `/admin` - Dashboard with stats
- `/admin/products` - Product CRUD
- `/admin/blog` - Blog CRUD with FAQ builder
- `/admin/categories` - Category management
- `/admin/ads` - Ad management with placement/device/schedule
- `/admin/seo` - GSC, GA4, robots.txt, sitemap
- `/admin/settings` - Site identity, social links, affiliate disclosure

## Key Features
- **SEO**: Dynamic meta injection, JSON-LD schema, Open Graph
- **Performance**: Lazy loading, ad space reservation (prevents CLS)
- **Auth**: Email/password, forgot password, email verification
- **Affiliate Tracking**: GA4 custom event on Amazon link clicks
- **Blog**: Long-form content, auto table of contents, FAQ schema
- **Ads**: Multi-placement system with device targeting and scheduling

## Color Scheme
- Primary: Orange #F97316 (orange-500)
- Accent: Red-orange gradient
- Neutral: Gray-50 to Gray-900

## Build Commands
```bash
npm install     # Install dependencies
npm run build   # Production build
npm run dev     # Development server
```

## Environment Notes
- No `.env` file needed - Supabase config is in src/lib/supabase.ts
- Anon key is safe for client-side use (RLS policies protect data)