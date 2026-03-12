const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wlckehznmuxxilewtpyi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsY2tlaHpubXV4eGlsZXd0cHlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDQ2ODc3NiwiZXhwIjoyMDg2MDQ0Nzc2fQ.kd1UbiNxHZxenYV3EDloA58utLq8WTalaWwZSJkFTjo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, title, slug, status, featured');

  if (error) {
    console.error('Error fetching products:', error);
  } else {
    console.log('Products in database:');
    console.log(JSON.stringify(data, null, 2));
    
    const published = data.filter(p => p.status === 'published');
    console.log(`\nFound ${data ? data.length : 0} total products, ${published.length} are published.`);
  }
}

checkProducts();
