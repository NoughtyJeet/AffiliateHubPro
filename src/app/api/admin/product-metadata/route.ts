import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Add a user-agent to avoid being blocked by some sites
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            },
            timeout: 10000,
        });

        const $ = cheerio.load(response.data);
        
        // Extract metadata using OG tags, Twitter tags, or standard meta tags
        const title = $('meta[property="og:title"]').attr('content') || 
                      $('meta[name="twitter:title"]').attr('content') || 
                      $('title').text() || '';
                      
        const description = $('meta[property="og:description"]').attr('content') || 
                            $('meta[name="twitter:description"]').attr('content') || 
                            $('meta[name="description"]').attr('content') || '';
                            
        const image = $('meta[property="og:image"]').attr('content') || 
                      $('meta[name="twitter:image"]').attr('content') || '';
                      
        // Try to find price if it's Amazon or similar (heuristic approach)
        let price = '';
        if (url.includes('amazon')) {
            price = $('.a-price-whole').first().text() + $('.a-price-fraction').first().text();
        } else if (url.includes('flipkart')) {
            price = $('._30jeq3._16Jk6d').text();
        }

        return NextResponse.json({
            title: title.trim(),
            description: description.trim(),
            image: image,
            price: price.trim(),
            brand: (url.includes('amazon') ? 'Amazon' : url.includes('flipkart') ? 'Flipkart' : ''),
            success: true
        });

    } catch (error: any) {
        console.error('Scraping Error:', error.message);
        return NextResponse.json({ 
            error: 'Failed to fetch metadata. The site might be blocking us.',
            details: error.message 
        }, { status: 500 });
    }
}
