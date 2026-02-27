-- ============================================================
-- AffiliateHub Pro - Demo Seed Data
-- Run this in your Supabase SQL Editor to populate demo content
-- ============================================================

-- 1. CATEGORIES
-- ============================================================
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


-- 2. PRODUCTS (8 products for a full-looking homepage)
-- ============================================================
INSERT INTO products (id, title, slug, description, short_description, pros, cons, features, rating, review_count, affiliate_link, category_id, featured_image, meta_title, meta_description, schema_enabled, featured, status, price_range, brand, created_at, updated_at)
VALUES
  -- Featured Product 1
  ('prod-001', 'Apple MacBook Pro 16" M4 Max', 'apple-macbook-pro-16-m4-max',
   '<h2>The Ultimate Creative Powerhouse</h2><p>The MacBook Pro 16" with M4 Max is Apple''s most powerful laptop ever built. With up to 128GB of unified memory and a stunning Liquid Retina XDR display, it handles everything from 8K video editing to complex 3D rendering without breaking a sweat.</p><h2>Performance That Defies Expectations</h2><p>The M4 Max chip delivers up to 40% faster CPU performance and 30% faster GPU performance compared to its predecessor. Whether you''re compiling code, rendering visual effects, or running multiple pro apps simultaneously, this machine handles it all with ease.</p><h2>Display Excellence</h2><p>The 16.2-inch Liquid Retina XDR display features ProMotion with up to 120Hz adaptive refresh rate, 1000 nits sustained brightness, and 1600 nits peak HDR brightness. Every pixel is precisely calibrated for color-critical workflows.</p>',
   'Apple''s most powerful laptop with M4 Max chip, 36-core GPU, and stunning XDR display.',
   ARRAY['Unmatched performance for pro workloads', 'Incredible 22-hour battery life', 'Best-in-class Liquid Retina XDR display', 'Whisper-quiet under heavy loads'],
   ARRAY['Premium price point', 'Limited port selection compared to some competitors', 'Heavy at 4.8 lbs'],
   ARRAY['M4 Max chip with 16-core CPU', '36-core GPU', 'Up to 128GB unified memory', '16.2" Liquid Retina XDR display', '22-hour battery life', 'Thunderbolt 5 ports', 'MagSafe 3 charging'],
   4.9, 2847, 'https://www.amazon.com/dp/B0DLLF9ZCL', 'cat-tech-001',
   'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
   'Apple MacBook Pro 16 M4 Max Review 2025', 'In-depth review of the MacBook Pro 16" with M4 Max chip.',
   true, true, 'published', '$3,499 - $5,499', 'Apple', now() - interval '2 days', now()),

  -- Featured Product 2
  ('prod-002', 'Sony WH-1000XM6 Wireless Headphones', 'sony-wh-1000xm6-wireless-headphones',
   '<h2>The Gold Standard of Noise Cancelling</h2><p>Sony''s WH-1000XM6 headphones continue to set the bar for wireless noise-cancelling headphones. With an all-new acoustic design and improved noise cancellation, these headphones deliver an immersive audio experience that''s hard to beat.</p><h2>Sound Quality</h2><p>The custom-designed 30mm drivers with Edge-AI processing deliver rich, detailed sound across all frequencies. LDAC codec support ensures hi-res audio streaming, while DSEE Ultimate upscales compressed audio to near hi-res quality.</p>',
   'Industry-leading noise cancellation with premium sound quality and 40-hour battery life.',
   ARRAY['Best-in-class noise cancellation', '40-hour battery life', 'Exceptionally comfortable', 'Multipoint connection'],
   ARRAY['Premium pricing', 'Touch controls can be finicky', 'No aptX support'],
   ARRAY['30mm custom drivers', 'Edge-AI noise cancellation', '40-hour battery life', 'LDAC & AAC codec support', 'Speak-to-Chat', 'Multipoint Bluetooth', 'USB-C fast charging'],
   4.8, 5632, 'https://www.amazon.com/dp/B0DKYZ123', 'cat-tech-003',
   'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
   'Sony WH-1000XM6 Review 2025', 'Comprehensive review of Sony''s flagship noise-cancelling headphones.',
   true, true, 'published', '$349 - $399', 'Sony', now() - interval '3 days', now()),

  -- Featured Product 3
  ('prod-003', 'Samsung Galaxy S25 Ultra', 'samsung-galaxy-s25-ultra',
   '<h2>Samsung''s Ultimate Flagship</h2><p>The Galaxy S25 Ultra represents the pinnacle of Samsung''s smartphone engineering. With its titanium frame, embedded S Pen, and revolutionary Galaxy AI features, this phone is designed for users who demand the absolute best.</p><h2>Camera System</h2><p>The quad-camera system includes a 200MP main sensor, 50MP telephoto with 5x optical zoom, 12MP ultrawide, and a 10MP 3x telephoto. Night photography is stunning thanks to advanced AI processing.</p>',
   'Samsung''s flagship with 200MP camera, Galaxy AI, S Pen, and titanium build.',
   ARRAY['Exceptional 200MP camera system', 'Galaxy AI features are genuinely useful', 'S Pen built in', 'Titanium frame is incredibly durable'],
   ARRAY['Expensive', 'Large and heavy', 'S Pen niche may not appeal to everyone'],
   ARRAY['Snapdragon 8 Elite processor', '200MP main camera', '6.9" Dynamic AMOLED 2X', '5000mAh battery', 'S Pen included', '12GB RAM', 'Galaxy AI suite'],
   4.7, 8921, 'https://www.amazon.com/dp/B0DS5ZZ123', 'cat-tech-002',
   'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
   'Samsung Galaxy S25 Ultra Review', 'Full review of the Samsung Galaxy S25 Ultra smartphone.',
   true, true, 'published', '$1,299 - $1,659', 'Samsung', now() - interval '5 days', now()),

  -- Featured Product 4
  ('prod-004', 'PlayStation 5 Pro', 'playstation-5-pro',
   '<h2>Next-Gen Gaming Evolved</h2><p>The PlayStation 5 Pro delivers a significant performance leap over the standard PS5. With its enhanced GPU, machine learning upscaling, and support for 8K output, games look and run better than ever.</p><h2>Performance</h2><p>The custom RDNA-based GPU delivers 45% faster rendering than the standard PS5. Combined with PlayStation Spectral Super Resolution (PSSR) AI upscaling, games achieve higher fidelity at smooth frame rates.</p>',
   'Enhanced PS5 with 45% faster GPU, 2TB SSD, and AI-powered upscaling.',
   ARRAY['Significantly faster GPU', 'AI upscaling is impressive', '2TB SSD standard', 'Full PS5 game compatibility'],
   ARRAY['No disc drive included', 'Expensive for a console', 'Incremental upgrade for casual gamers'],
   ARRAY['Custom GPU with 16.7 TFLOPS', '2TB SSD', 'PSSR AI upscaling', '8K output support', 'Wi-Fi 7', 'DualSense Wireless Controller', 'Dolby Atmos'],
   4.6, 4215, 'https://www.amazon.com/dp/B0DPB1Z123', 'cat-tech-005',
   'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
   'PlayStation 5 Pro Review 2025', 'Is the PS5 Pro worth the upgrade?',
   true, true, 'published', '$699', 'Sony', now() - interval '1 day', now()),

  -- Top Rated 1
  ('prod-005', 'Apple AirPods Pro 3', 'apple-airpods-pro-3',
   '<h2>The Best TWS Earbuds Money Can Buy</h2><p>AirPods Pro 3 take everything great about the previous generation and make it better. With the H3 chip, adaptive transparency, and hearing health features, these are the most capable earbuds Apple has ever made.</p>',
   'Apple''s best earbuds with H3 chip, adaptive noise cancellation, and hearing health features.',
   ARRAY['Superb noise cancellation', 'Excellent sound quality', 'Hearing protection features', 'USB-C with Find My speaker'],
   ARRAY['Only ideal for Apple ecosystem', 'No lossless Bluetooth', 'Ear tips need periodic replacement'],
   ARRAY['H3 chip', 'Adaptive Audio', 'Personalized Spatial Audio', 'IP54 dust/water resistance', '6hrs battery (30hrs with case)', 'USB-C with speaker'],
   4.8, 12450, 'https://www.amazon.com/dp/B0DGZ1Z123', 'cat-tech-003',
   'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800',
   'Apple AirPods Pro 3 Review', 'Are the AirPods Pro 3 worth it?',
   true, false, 'published', '$249', 'Apple', now() - interval '7 days', now()),

  -- Top Rated 2
  ('prod-006', 'Amazon Echo Show 15', 'amazon-echo-show-15',
   '<h2>Your Family''s Smart Hub</h2><p>The Echo Show 15 is Amazon''s largest and most versatile smart display. Designed to be wall-mounted or placed on a stand, it serves as a digital family hub with calendars, widgets, and full Alexa capabilities.</p>',
   'The ultimate smart display for family organization, entertainment, and smart home control.',
   ARRAY['Large 15.6" Full HD display', 'Excellent family hub features', 'Fire TV built-in', 'Visual ID for personalized content'],
   ARRAY['Alexa ecosystem lock-in', 'Camera placement awkward when wall-mounted', 'No battery, needs power outlet'],
   ARRAY['15.6" Full HD display', 'Alexa built-in', 'Fire TV built-in', 'Visual ID', 'Customizable widgets', '5MP camera', 'Zigbee smart home hub'],
   4.5, 3876, 'https://www.amazon.com/dp/B0BFC123', 'cat-tech-004',
   'https://images.unsplash.com/photo-1543512214-318c7553f230?w=800',
   'Amazon Echo Show 15 Review', 'Complete review of the Amazon Echo Show 15.',
   true, false, 'published', '$249 - $279', 'Amazon', now() - interval '10 days', now()),

  -- Top Rated 3
  ('prod-007', 'Canon EOS R6 Mark III', 'canon-eos-r6-mark-iii',
   '<h2>The Best Hybrid Camera for 2025</h2><p>Canon''s EOS R6 Mark III is a stunning hybrid mirrorless camera that excels at both photography and videography. With a 24.2MP full-frame sensor, up to 40fps burst shooting, and 6K video recording, it''s a versatile powerhouse.</p>',
   'A powerhouse hybrid mirrorless camera with 24.2MP sensor, 40fps burst, and 6K video.',
   ARRAY['Incredible autofocus system', '40fps burst shooting', '6K video recording', 'Excellent in-body stabilization'],
   ARRAY['Expensive body-only price', 'Battery life could be better for video', 'No USB charging while shooting'],
   ARRAY['24.2MP full-frame CMOS sensor', 'DIGIC X processor', '40fps electronic shutter', '6K 60p video', '8-stop IBIS', 'Dual card slots (CFexpress + SD)', 'Vari-angle touchscreen'],
   4.7, 1543, 'https://www.amazon.com/dp/B0DR6Z123', 'cat-tech-006',
   'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
   'Canon EOS R6 Mark III Review', 'Is the Canon R6 III the best hybrid camera of 2025?',
   true, false, 'published', '$2,499', 'Canon', now() - interval '4 days', now()),

  -- Top Rated 4
  ('prod-008', 'Logitech G Pro X TKL Rapid', 'logitech-g-pro-x-tkl-rapid',
   '<h2>Built for Esports Champions</h2><p>The Logitech G Pro X TKL Rapid is engineered for competitive gamers. Its rapid-trigger magnetic switches, LIGHTSPEED wireless technology, and compact tenkeyless design make it a top tournament choice.</p>',
   'Esports-grade TKL keyboard with rapid-trigger switches and LIGHTSPEED wireless.',
   ARRAY['Rapid-trigger magnetic switches', 'Near-zero latency wireless', 'Compact TKL design', 'PBT keycaps'],
   ARRAY['Expensive for a keyboard', 'No numpad', 'Limited RGB customization compared to competitors'],
   ARRAY['Magnetic Hall Effect switches', 'LIGHTSPEED wireless', '0.1mm actuation point adjustable', 'PBT double-shot keycaps', '40-hour battery', 'USB-C', 'Onboard memory profiles'],
   4.6, 2198, 'https://www.amazon.com/dp/B0DPR7Z123', 'cat-tech-005',
   'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800',
   'Logitech G Pro X TKL Rapid Review', 'The ultimate esports keyboard reviewed.',
   true, false, 'published', '$229', 'Logitech', now() - interval '6 days', now())
ON CONFLICT (id) DO NOTHING;


-- 3. BLOG POSTS (6 posts for the blog section)
-- ============================================================
INSERT INTO blog_posts (id, title, slug, content, excerpt, featured_image, category_id, author_id, meta_title, meta_description, faq_schema, tags, status, read_time, views, created_at, updated_at)
VALUES
  ('blog-001', 'Best Laptops for Students in 2025: Complete Buying Guide', 'best-laptops-students-2025',
   '<h2>Finding the Perfect Student Laptop</h2><p>Choosing the right laptop for school can be overwhelming with hundreds of options available. We''ve tested over 40 laptops to find the best options across every budget and major. Whether you''re studying engineering, art, or liberal arts, we''ve got you covered.</p><h2>What to Look for in a Student Laptop</h2><p>Battery life is king for students. You need a laptop that can last through a full day of classes without hunting for outlets. We recommend at least 10 hours of real-world battery life. Next, consider the weight — if you carry your laptop between classes, anything over 4 pounds will get tiresome.</p><h3>Performance Needs by Major</h3><p>STEM students should prioritize at least 16GB RAM and a modern processor. Creative arts students need a color-accurate display and dedicated GPU. Liberal arts and business students can get by with more affordable options that prioritize battery life and keyboard comfort.</p><h2>Our Top Picks</h2><h3>Best Overall: MacBook Air M4</h3><p>The MacBook Air with M4 chip offers the best combination of performance, battery life, and portability. Its fanless design means complete silence during lectures, and the 18-hour battery life means you''ll rarely need to charge during the day.</p><h3>Best Budget: Acer Swift Go 14</h3><p>At under $700, the Acer Swift Go 14 delivers impressive performance with its Intel Core Ultra processor, a gorgeous 14-inch OLED display, and over 12 hours of battery life. It''s the best value for students who need a reliable all-rounder.</p><h3>Best for STEM: Lenovo ThinkPad X1 Carbon Gen 12</h3><p>Business and STEM students will appreciate the ThinkPad''s legendary keyboard, robust build quality, and excellent performance. With up to 32GB RAM and fast SSD storage, it handles data analysis and coding with ease.</p><h2>Budget Considerations</h2><p>Student budgets vary widely. Here''s our recommended spending by tier: Under $500 for basic note-taking and web browsing, $500-$1000 for most students, $1000-$1500 for creative and STEM work, and $1500+ for specialized needs like 3D modeling or video editing.</p>',
   'We tested 40+ laptops to find the best options for every student budget and major. From budget picks under $500 to premium powerhouses for STEM and creative work.',
   'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200',
   'cat-blog-001', NULL, 'Best Laptops for Students 2025 - Buying Guide', 'Expert-tested buying guide for the best student laptops in 2025.',
   '[{"question":"What is the best budget laptop for students?","answer":"The Acer Swift Go 14 is our top budget pick at under $700, offering excellent performance, an OLED display, and 12+ hours of battery life."},{"question":"Do students need a MacBook?","answer":"Not necessarily. While MacBooks are excellent, there are great Windows and Chromebook alternatives at every price point. Choose based on your major and budget."},{"question":"How much RAM do students need?","answer":"We recommend at least 8GB for basic tasks and 16GB for STEM, creative work, or heavy multitasking."}]',
   ARRAY['laptops', 'students', 'buying guide', 'education'],
   'published', 12, 15420, now() - interval '1 day', now()),

  ('blog-002', 'AirPods Pro 3 vs Sony WF-1000XM6: Which Should You Buy?', 'airpods-pro-3-vs-sony-wf-1000xm6',
   '<h2>The Ultimate Earbuds Showdown</h2><p>Apple and Sony have been trading blows in the premium true wireless earbuds market for years. The AirPods Pro 3 and Sony WF-1000XM6 represent the best each company has to offer in 2025, but which pair is right for you?</p><h2>Noise Cancellation</h2><p>Both earbuds offer world-class ANC. The Sony WF-1000XM6 edges ahead with slightly more effective low-frequency cancellation — great for airplane noise and office HVAC hum. The AirPods Pro 3, however, offer more natural transparency mode that''s virtually indistinguishable from not wearing earbuds at all.</p><h2>Sound Quality</h2><p>Sony wins on pure audio fidelity. Their LDAC codec support enables hi-res audio streaming, and the sound signature is richer with more bass presence. The AirPods Pro 3 sound excellent too, with better spatial audio implementation thanks to Personalized Spatial Audio with head tracking.</p><h2>Comfort & Fit</h2><p>AirPods Pro 3 are lighter and sit more flush in the ear, making them better for extended wear and exercise. The Sony earbuds are slightly bulkier but still comfortable for most ear shapes.</p><h2>Ecosystem & Features</h2><p>If you''re in the Apple ecosystem, AirPods Pro 3 are the clear choice — seamless device switching, Find My integration, and Siri make them feel like a native extension of your iPhone. Sony earbuds work great with both iOS and Android, making them more versatile.</p><h2>Battery Life</h2><p>Sony leads with 8 hours of listening time (24 hours with case) vs Apple''s 6 hours (30 hours with case). The Sony case charges via USB-C and wireless charging, as does the AirPods case.</p><h2>Verdict</h2><p>Choose AirPods Pro 3 if you''re in the Apple ecosystem and prioritize comfort, transparency mode, and seamless integration. Choose Sony WF-1000XM6 if you prioritize audio quality, noise cancellation, and platform flexibility.</p>',
   'Head-to-head comparison of the two best premium wireless earbuds. We test noise cancellation, sound quality, comfort, and value to pick a winner.',
   'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=1200',
   'cat-blog-001', NULL, 'AirPods Pro 3 vs Sony WF-1000XM6 Comparison', 'Detailed comparison review of AirPods Pro 3 and Sony WF-1000XM6.',
   '[{"question":"Which has better noise cancellation: AirPods Pro 3 or Sony WF-1000XM6?","answer":"Sony WF-1000XM6 has slightly better noise cancellation, especially for low-frequency sounds. AirPods Pro 3 has superior transparency mode."},{"question":"Are AirPods Pro 3 worth it for Android users?","answer":"While they work with Android, you lose key features like seamless device switching, Spatial Audio, and Find My. Android users should consider the Sony WF-1000XM6 instead."}]',
   ARRAY['earbuds', 'comparison', 'AirPods', 'Sony', 'audio'],
   'published', 8, 23150, now() - interval '2 days', now()),

  ('blog-003', 'How to Set Up Your Smart Home in 2025: A Complete Guide', 'smart-home-setup-guide-2025',
   '<h2>Getting Started with Smart Home</h2><p>Building a smart home doesn''t have to be complicated or expensive. This step-by-step guide walks you through everything from choosing the right ecosystem to automating your daily routines.</p><h2>Step 1: Choose Your Ecosystem</h2><p>The three major smart home ecosystems are Amazon Alexa, Google Home, and Apple HomeKit. Each has its strengths: Alexa has the widest device compatibility, Google Home offers the best voice assistant, and Apple HomeKit provides the strongest privacy protections. Most modern devices support Matter, the new universal protocol, which reduces lock-in concerns.</p><h2>Step 2: Start with the Basics</h2><p>Begin with three foundational upgrades: smart lighting (Philips Hue or LIFX), a smart speaker (Echo or Google Nest), and a smart thermostat (Nest or Ecobee). These provide immediate quality-of-life improvements and serve as the hub for future expansion.</p><h2>Step 3: Add Security</h2><p>Smart security is a natural next step. A video doorbell (Ring or Google Nest), smart locks (August or Yale), and indoor/outdoor cameras give you peace of mind and remote monitoring capabilities.</p><h2>Step 4: Automate Your Routines</h2><p>The real magic of smart homes is automation. Set up routines like: lights that dim at sunset, thermostat that adjusts when you leave home, morning routines that gradually brighten lights and start your coffee maker. Most ecosystems make this easy with visual routine builders.</p><h2>Budget Planning</h2><p>A basic smart home setup costs $200-$400. A comprehensive setup with security, lighting, climate control, and entertainment runs $800-$1,500. Focus on what adds the most value to your daily life and expand gradually.</p>',
   'Step-by-step guide to building your first smart home. From choosing an ecosystem to automating routines, we cover everything beginners need to know.',
   'https://images.unsplash.com/photo-1558002038-1055907df827?w=1200',
   'cat-blog-003', NULL, 'Smart Home Setup Guide 2025', 'Complete beginner''s guide to setting up a smart home in 2025.',
   '[{"question":"What is the cheapest way to start a smart home?","answer":"Start with smart bulbs ($10-15 each) and a smart plug ($10-15). These work with voice assistants you may already have on your phone and cost under $50 for a basic setup."},{"question":"Do I need a smart home hub?","answer":"Not anymore. Most modern smart home devices connect directly to Wi-Fi or use Matter protocol. Hubs are only needed for Zigbee/Z-Wave devices or advanced automation."},{"question":"Is Alexa or Google better for smart home?","answer":"Alexa has wider device compatibility, while Google Assistant is better at understanding complex voice commands. Both work well — choose based on your preferred ecosystem."}]',
   ARRAY['smart home', 'how-to', 'beginners guide', 'automation'],
   'published', 10, 18340, now() - interval '3 days', now()),

  ('blog-004', 'PlayStation 5 Pro Review: Is It Worth the Upgrade?', 'playstation-5-pro-review-worth-upgrade',
   '<h2>What''s New in the PS5 Pro?</h2><p>The PlayStation 5 Pro represents Sony''s mid-generation hardware refresh, packing significantly more GPU power, AI-driven upscaling, and faster storage into a slightly slimmer design than the original PS5. But at $699 without a disc drive, is it worth the upgrade?</p><h2>Performance Improvements</h2><p>The numbers don''t lie — the PS5 Pro''s GPU delivers 45% faster rendering than the standard PS5. In practice, this means games that previously struggled to maintain 60fps in quality mode now run smoothly. Titles like Spider-Man 2 and Horizon Forbidden West see dramatic improvements, running at native 4K with ray tracing enabled at 60fps.</p><h2>PSSR: Sony''s AI Upscaling</h2><p>PlayStation Spectral Super Resolution (PSSR) is Sony''s answer to DLSS and FSR. It uses machine learning to upscale lower-resolution renders to near-native quality. The results are impressive — in most games, PSSR output at 1440p is virtually indistinguishable from native 4K, while freeing up GPU headroom for higher frame rates and better effects.</p><h2>Who Should Buy It?</h2><p>The PS5 Pro is ideal for gamers with 4K TVs who want the best possible visual experience. If you''re still on a 1080p display, save your money. If you don''t yet own a PS5, the Pro is the better buy long-term. For existing PS5 owners, the upgrade is worth it only if you game regularly and notice frame rate drops in demanding titles.</p>',
   'We test Sony''s mid-gen upgrade extensively. Here''s whether the PS5 Pro''s 45% GPU boost and AI upscaling justify the $699 price tag.',
   'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=1200',
   'cat-blog-001', NULL, 'PS5 Pro Review - Worth the Upgrade?', 'Comprehensive review of the PlayStation 5 Pro console.',
   '[{"question":"Is PS5 Pro worth it if I have a PS5?","answer":"Only if you have a 4K TV and are bothered by frame rate drops in demanding games. The visual improvements are real but incremental for casual gamers."},{"question":"Does PS5 Pro play PS5 games?","answer":"Yes, the PS5 Pro is fully backwards compatible with all PS5 and PS4 games. Enhanced games automatically use the Pro''s improved hardware."}]',
   ARRAY['PlayStation', 'gaming', 'review', 'console'],
   'published', 9, 31200, now() - interval '4 days', now()),

  ('blog-005', 'The Rise of AI in Photography: How AI is Changing Your Camera', 'ai-photography-how-ai-changing-cameras',
   '<h2>AI is Already in Your Camera</h2><p>Whether you realize it or not, artificial intelligence is already a crucial part of modern photography. From your smartphone''s computational photography to mirrorless cameras'' autofocus systems, AI is transforming how we capture images.</p><h2>Computational Photography</h2><p>Modern smartphones stack multiple exposures, apply AI-driven noise reduction, and use machine learning to optimize color rendering — all in the fraction of a second between pressing the shutter and seeing the result. Google''s Tensor chips and Apple''s A-series processors are purpose-built for these workloads.</p><h2>AI Autofocus Revolution</h2><p>Camera manufacturers like Sony, Canon, and Nikon have implemented deep learning-based autofocus systems that can identify and track specific subjects: people, animals, vehicles, even birds in flight. Sony''s Real-time Eye AF was groundbreaking when it launched, and now every major camera brand offers similar capabilities.</p><h2>AI Editing Tools</h2><p>Post-processing has been transformed by AI. Adobe''s Generative Fill in Photoshop can remove or add objects with stunning realism. Lightroom''s AI masking can select subjects and skies with a single click. These tools that previously required hours of manual work now take seconds.</p><h2>The Future: AI-Assisted Composition</h2><p>Emerging camera features include AI composition assistants that suggest better framing, smart scene detection that adjusts settings automatically, and even predictive capture that starts recording before you press the shutter. While purists may resist, these features are making great photography more accessible than ever.</p>',
   'From computational photography to AI autofocus and intelligent editing tools, discover how artificial intelligence is revolutionizing photography.',
   'https://images.unsplash.com/photo-1495745966610-2a67f2297e5e?w=1200',
   'cat-blog-002', NULL, 'AI in Photography 2025', 'How AI is transforming photography in cameras and editing software.',
   '[{"question":"Is AI ruining photography?","answer":"No. AI tools are making photography more accessible while expanding creative possibilities. Professional photographers use AI to streamline editing workflows, not replace their creative vision."},{"question":"Which camera brand has the best AI features?","answer":"Sony currently leads in AI autofocus, while Google Pixel phones have the most impressive computational photography. For editing, Adobe''s AI tools in Photoshop and Lightroom are industry standard."}]',
   ARRAY['AI', 'photography', 'cameras', 'technology trends'],
   'published', 7, 9870, now() - interval '5 days', now()),

  ('blog-006', '10 Hidden Features of Your iPhone You''re Not Using', 'hidden-iphone-features-not-using',
   '<h2>Unlock Your iPhone''s Full Potential</h2><p>Your iPhone can do a lot more than you think. Apple packs dozens of useful features into every iOS update, but many go unnoticed. Here are 10 hidden gems that will change how you use your iPhone.</p><h2>1. Back Tap Shortcuts</h2><p>Double or triple tap the back of your iPhone to trigger custom actions. Go to Settings → Accessibility → Touch → Back Tap. You can set it to launch the camera, toggle the flashlight, take a screenshot, or trigger any Shortcut.</p><h2>2. Visual Look Up</h2><p>Long-press on any photo to identify plants, animals, landmarks, and even food. iOS uses on-device machine learning to recognize objects, no internet required.</p><h2>3. Drag and Drop Between Apps</h2><p>Hold an image, link, or text in one app, then swipe up to go home and open another app — the item stays held under your finger. Drop it into the new app to transfer it instantly.</p><h2>4. Sound Recognition</h2><p>Your iPhone can listen for specific sounds — doorbells, alarms, baby crying, pet sounds — and alert you. Perfect for when you''re wearing headphones. Enable at Settings → Accessibility → Sound Recognition.</p><h2>5. Hide Apps Without Deleting</h2><p>Long press any app and select "Require Face ID." The app will be hidden from your home screen and only accessible through Search with Face ID authentication.</p><h2>6. Custom Vibration Patterns</h2><p>Create unique vibration patterns for specific contacts so you know who''s calling without looking. Go to Contacts → Edit → Ringtone → Vibration → Create New Vibration.</p><h2>7. Measure App</h2><p>Your iPhone has a built-in measuring tool using AR. Open the Measure app to measure objects, distances, and even a person''s height just by pointing your camera.</p><h2>8. Text Replacement</h2><p>Save time typing by creating text shortcuts. Go to Settings → General → Keyboard → Text Replacement. For example, typing "@@" could auto-expand to your full email address.</p><h2>9. Focus Filters</h2><p>Customize Focus modes to show different home screens, mail accounts, and Safari tab groups based on what you''re doing. Work Focus can hide personal apps, while Personal Focus hides work email.</p><h2>10. Live Voicemail Transcription</h2><p>When someone leaves a voicemail, Live Voicemail shows a real-time transcription so you can decide whether to pick up. Better yet, you can read the full transcript without listening to the message.</p>',
   'Discover 10 powerful hidden features in your iPhone that most people don''t know about. From Back Tap shortcuts to hidden apps, these tips will level up your iPhone game.',
   'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=1200',
   'cat-blog-003', NULL, '10 Hidden iPhone Features', 'Discover powerful hidden iPhone features and tips.',
   '[{"question":"Do these features work on all iPhones?","answer":"Most features work on iPhones running iOS 17 or later. Some features like Back Tap require iPhone 8 or newer. Check your iOS version in Settings → General → About."},{"question":"Will using hidden features drain my battery?","answer":"Most of these features have minimal battery impact. Sound Recognition may use slightly more battery as it uses the microphone in the background, but the impact is negligible."}]',
   ARRAY['iPhone', 'tips', 'iOS', 'Apple', 'how-to'],
   'published', 6, 42680, now() - interval '6 days', now())
ON CONFLICT (id) DO NOTHING;


-- 4. SEO SETTINGS (site-wide defaults)
-- ============================================================
INSERT INTO seo_settings (id, site_title, site_tagline, default_meta_description, robots_txt, affiliate_disclosure, updated_at)
VALUES
  ('seo-default', 'AffiliateHub Pro', 'Honest Reviews & Best Deals', 'Your trusted source for honest product reviews, expert buying guides, and the best Amazon deals. Independent testing, no sponsored rankings.', 'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /dashboard/\nDisallow: /auth/\nSitemap: https://yourdomain.com/sitemap', 'AffiliateHub Pro is reader-supported. When you buy through links on our site, we may earn an affiliate commission at no extra cost to you. Our editorial team independently researches and recommends products — we never accept payment for favorable reviews.', now())
ON CONFLICT (id) DO NOTHING;

-- Done! Your AffiliateHub Pro site now has demo content.
-- Remember to set your environment variables in Vercel:
-- NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
