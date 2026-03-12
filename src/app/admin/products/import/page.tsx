'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { PanelLeft, ArrowLeft, Package, Sparkles } from 'lucide-react';
import ProductImport from '@/components/admin/products/ProductImport';

function slugify(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function BulkImportPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const supabase = createClient();

    const handleImportUrlData = (data: any) => {
        // Since this is a standalone page, if we capture a single product
        // we might want to redirect to the registration page with these params
        // or just toast that for now single import is best done on the main products page
        toast.success("Intel Captured! Redirecting to setup...");
        // Small delay to let user see the success
        setTimeout(() => {
            // We can't easily pass state through router easily without query params or global state
            // Let's just save as draft immediately if it's a URL import?
            handleBulkImport([{ ...data, title: data.title }]);
        }, 1500);
    };

    const handleBulkImport = async (data: any[]) => {
        setSaving(true);
        const productsToInsert = data.map(item => ({
            title: item.title || 'Imported Product',
            slug: slugify(item.title || 'Imported Product') + '-' + Math.random().toString(36).substring(2, 5),
            brand: item.brand || null,
            affiliate_link: item.affiliate_link || item.link || null,
            status: 'draft',
            rating: 4.5,
            review_count: 0,
            pros: [], cons: [], features: [],
            created_at: new Date().toISOString(),
        }));

        const { error } = await supabase.from('products').insert(productsToInsert);
        
        if (error) {
            toast.error(`Bulk synchronization failed: ${error.message}`);
        } else {
            toast.success(`Successfully registered ${data.length} products to the vault!`);
            router.push('/admin/products');
        }
        setSaving(false);
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-orange-500 transition-colors"
                    >
                        <ArrowLeft size={14} /> Return to Inventory
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-orange-500" />
                            <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] leading-none">Automated Ingestion</p>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter leading-none uppercase italic">Mass Registry Portal</h2>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
                <div className="xl:col-span-3">
                    {saving ? (
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-20 flex flex-col items-center justify-center text-center shadow-sm">
                            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-8" />
                            <p className="text-lg font-black text-gray-900 uppercase tracking-tighter italic mb-2">Synchronizing with Database</p>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Encrypting and uploading batch records...</p>
                        </div>
                    ) : (
                        <ProductImport 
                            onImportUrl={handleImportUrlData}
                            onBulkImport={handleBulkImport}
                        />
                    )}
                </div>

                {/* Sidebar Tips */}
                <div className="space-y-6">
                    <div className="bg-gray-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                        <Package className="w-8 h-8 text-orange-500 mb-6" />
                        <h4 className="text-sm font-black uppercase tracking-widest mb-4">Registry Protocol</h4>
                        <ul className="space-y-4">
                            {[
                                "All imported items enter as 'Draft' for verification.",
                                "Digital Links attempt to extract high-res visuals.",
                                "CSV files should follow the standard header map.",
                                "Duplicate slugs are automatically handled by system."
                            ].map((tip, i) => (
                                <li key={i} className="flex gap-3 text-[10px] text-gray-400 font-bold leading-relaxed uppercase tracking-tight">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="bg-orange-50 rounded-[2rem] p-8 border border-orange-100">
                        <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] mb-4">Required CSV Meta</h4>
                        <div className="flex flex-wrap gap-2">
                            {['Title', 'Brand', 'Category', 'Link'].map(tag => (
                                <span key={tag} className="px-3 py-1.5 bg-white rounded-lg text-[9px] font-black text-orange-500 border border-orange-100 uppercase tracking-widest">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
