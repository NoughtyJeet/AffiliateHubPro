-- Create a default category for blog if it doesn't exist
INSERT INTO categories (id, name, slug, description, type)
VALUES ('cat-blog-tech', 'Technology', 'technology', 'Latest technology news and in-depth guides.', 'blog')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- Seed 3 SEO-optimized blog posts
INSERT INTO blog_posts (
    id,
    title, 
    slug, 
    content, 
    excerpt, 
    featured_image,
    tags, 
    status, 
    read_time, 
    meta_title, 
    meta_description, 
    faq_schema,
    category_id
) VALUES 
(
    'post-wifi7-001',
    'The Future of Pro Connectivity: Why Wi-Fi 7 Changes Everything',
    'future-of-pro-connectivity-wifi-7',
    '<h2>The Dawn of Wi-Fi 7</h2><p>Connectivity is the backbone of the modern digital ecosystem. As we move into 2026, Wi-Fi 7 (802.11be) is no longer a luxury—it’s a necessity for pro-users.</p><h3>Unprecedented Speeds</h3><p>Wi-Fi 7 offers speeds up to 46 Gbps, nearly five times faster than Wi-Fi 6. This is achieved through wider 320MHz channels and 4K-QAM (Quadrature Amplitude Modulation).</p><h3>Multi-Link Operation (MLO)</h3><p>Perhaps the most significant feature is MLO, which allows devices to transmit and receive data simultaneously across different bands (2.4GHz, 5GHz, and 6GHz).</p>',
    'Discover how Wi-Fi 7 is revolutionizing the way we work and play with unprecedented speeds and reliability.',
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800',
    ARRAY['Connectivity', 'Tech Trends', 'Pro Hardware'],
    'published',
    6,
    'Wi-Fi 7: The Future of Pro Connectivity Explained',
    'Learn why Wi-Fi 7 is the next big leap in wireless technology and how it benefits your pro workflow.',
    '[{"question": "Is Wi-Fi 7 backwards compatible?", "answer": "Yes, Wi-Fi 7 devices will work with older routers, but you will only get Wi-Fi 7 speeds with a compatible router."}, {"question": "When will Wi-Fi 7 be mainstream?", "answer": "Wi-Fi 7 is becoming the standard for flagship devices released in 2025 and 2026."}]'::jsonb,
    'cat-blog-tech'
),
(
    'post-workflow-001',
    'Mastering Your Workflow: 5 Pro Apps You Need in 2026',
    'mastering-workflow-5-pro-apps-2026',
    '<h2>Efficiency in the Era of AI</h2><p>The landscape of productivity apps has shifted dramatically. Tools are no longer just repositories for information; they are active collaborators.</p><h3>1. NeuralFlow: The Ultimate Asset Manager</h3><p>NeuralFlow uses localized AI to catalog your digital assets, making retrieval as simple as a natural language query.</p><h3>2. Chronos OS: Time Blocking Reimagined</h3><p>Chronos integrates with your biological clock to suggest the best times for deep work versus administrative tasks.</p>',
    'Level up your productivity with these 5 essential pro apps designed for the modern high-performance professional.',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    ARRAY['Productivity', 'Applications', 'AI'],
    'published',
    8,
    '5 Essential Pro Productivity Apps for 2026',
    'Boost your efficiency with our curated list of the top pro-level apps for the current digital landscape.',
    '[{"question": "Are these apps available on mobile?", "answer": "Most of these tools offer multi-platform support across iOS, Android, and Desktop."}, {"question": "Do I need a subscription?", "answer": "While most offer free tiers, pro features typically require a monthly subscription."}]'::jsonb,
    'cat-blog-tech'
),
(
    'post-sustainable-001',
    'Sustainable Tech: How Green Manufacturing is Reshaping Gadgets',
    'sustainable-tech-green-manufacturing-2026',
    '<h2>The Shift Towards Conscious Hardware</h2><p>Sustainability is no longer an afterthought in the tech industry. Leading manufacturers are now prioritizing circular economy principles.</p><h3>Recycled Materials in Flagships</h3><p>From 100% recycled aluminum frames to bio-based plastics in internals, the high-end market is going green without compromising on durability.</p><h3>Modular Design and Repairability</h3><p>Legislation and consumer demand have pushed brands to adopt modular designs, making repairs simpler and extending product lifespans.</p>',
    'Manufacturing is changing. Learn how your favorite tech brands are adopting sustainable practices for a greener future.',
    'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800',
    ARRAY['Sustainability', 'Manufacturing', 'Green Tech'],
    'published',
    5,
    'Sustainable Tech 2026: The Green Revolution in Hardware',
    'Explore how the technology industry is evolving to meet environmental standards through green manufacturing.',
    '[{"question": "Does recycled material mean lower quality?", "answer": "No, advances in metallurgy and polymers ensure that recycled materials meet the same rigorous standards as virgin materials."}, {"question": "How can I recycle my old tech?", "answer": "Most major manufacturers offer take-back programs or trade-in credits for old devices."}]'::jsonb,
    'cat-blog-tech'
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    slug = EXCLUDED.slug,
    content = EXCLUDED.content,
    excerpt = EXCLUDED.excerpt,
    featured_image = EXCLUDED.featured_image,
    tags = EXCLUDED.tags,
    status = EXCLUDED.status,
    read_time = EXCLUDED.read_time,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description,
    faq_schema = EXCLUDED.faq_schema,
    category_id = EXCLUDED.category_id,
    updated_at = NOW();

