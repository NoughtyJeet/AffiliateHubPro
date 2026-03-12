-- SQL script to add specifications and variants to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]';

-- Add sample data for your products to demonstrate the new UI 
-- (This updates all current products with some base specs and variants as a starting point)
UPDATE products 
SET 
    specifications = '{
        "Brand": "TechPro",
        "Model": "Elite Series",
        "Warranty": "2 Year Limited",
        "Materials": "Sustainable Aluminum & Glass",
        "Availability": "In stock"
    }'::jsonb,
    variants = '[
        {
            "name": "Color",
            "options": ["Space Gray", "Silver", "Midnight Blue"]
        },
        {
            "name": "Capacity",
            "options": ["128GB", "256GB", "512GB"]
        }
    ]'::jsonb
WHERE specifications = '{}' OR specifications IS NULL;
