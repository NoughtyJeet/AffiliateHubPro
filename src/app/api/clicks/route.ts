import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    const productId = searchParams.get('pid');
    const articleId = searchParams.get('aid');

    if (!url) {
        return NextResponse.json({ error: 'Missing destination URL' }, { status: 400 });
    }

    try {
        const supabase = await createClient();
        
        // Log the click asynchronously (don't block the redirect)
        const userAgent = req.headers.get('user-agent') || '';
        const referrer = req.headers.get('referer') || '';
        
        // Basic bot detection to keep data clean
        const isBot = /bot|spider|crawl|slurp|adsbot/i.test(userAgent);
        
        if (!isBot) {
            await supabase.from('affiliate_clicks').insert({
                product_id: productId || null,
                article_id: articleId || null,
                user_agent: userAgent,
                referrer: referrer,
            });
        }

        // Redirect to the affiliate link
        return NextResponse.redirect(url);
    } catch (error) {
        console.error('Click Tracking Error:', error);
        // Still redirect even if logging fails
        return NextResponse.redirect(url);
    }
}
