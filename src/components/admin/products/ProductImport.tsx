'use client';

import { useState, useRef } from 'react';
import { Link as LinkIcon, Upload, Package, Globe, Check, AlertCircle, Trash2, ArrowRight, FolderSync } from 'lucide-react';
import toast from 'react-hot-toast';

type ScrapedProduct = {
    title?: string;
    short_description?: string;
    featured_image?: string;
    price_range?: string;
    brand?: string;
    affiliate_link?: string;
    category?: string;
    description?: string;
    link?: string;
    [key: string]: string | undefined | null;
};

interface ProductImportProps {
    onImportUrl: (data: ScrapedProduct) => void;
    onBulkImport: (data: ScrapedProduct[]) => void;
}

export default function ProductImport({ onImportUrl, onBulkImport }: ProductImportProps) {
    const [url, setUrl] = useState('');
    const [importing, setImporting] = useState(false);
    const [mode, setMode] = useState<'url' | 'csv'>('url');
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // CSV State
    const [csvData, setCsvData] = useState<ScrapedProduct[]>([]);
    const [fileName, setFileName] = useState('');

    const handleUrlImport = async () => {
        if (!url) return toast.error('Enter a store URL first');
        setImporting(true);
        try {
            const res = await fetch('/api/admin/product-metadata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });
            const data = await res.json();
            
            if (data.error) throw new Error(data.error);
            
            onImportUrl({
                title: data.title,
                short_description: data.description,
                featured_image: data.image,
                price_range: data.price,
                brand: data.brand,
                affiliate_link: url
            });
            toast.success('Product data captured!');
            setUrl('');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown protocol error';
            toast.error(message || 'Failed to auto-import. System blocked.');
        } finally {
            setImporting(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        // Check if it's a CSV
        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            toast.error('Please upload a valid CSV archive');
            return;
        }

        const loadingToast = toast.loading(`Decrypting ${file.name}...`);
        setFileName(file.name);
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target?.result as string;
                if (!text || !text.trim()) {
                    throw new Error('The uploaded archive is empty');
                }

                // Handle both \n and \r\n
                const rows = text.split(/\r?\n/).filter(r => r.trim());
                if (rows.length < 2) {
                    throw new Error('Archive must contain a header and at least one record');
                }

                const headers = rows[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
                
                const data = rows.slice(1).map((row, index) => {
                    // Basic split by comma - Note: This doesn't handle commas inside quotes
                    // but for a simple import it's usually enough. 
                    // Let's improve it slightly to handle basic quoted strings if needed
                    const values = row.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
                    const obj: ScrapedProduct = {};
                    headers.forEach((h, i) => {
                        obj[h] = values[i] || null;
                    });
                    return obj;
                });
                
                setCsvData(data);
                toast.success(`${data.length} records parsed from archive`, { id: loadingToast });
            } catch (err: any) {
                toast.error(err.message || 'Fatal error during registry sync', { id: loadingToast });
                setFileName('');
                setCsvData([]);
            }
        };

        reader.onerror = () => {
            toast.error('Protocol failure: Could not read file buffer', { id: loadingToast });
        };

        reader.readAsText(file);
        
        // Reset input so user can re-upload same file if needed
        e.target.value = '';
    };

    return (
        <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm animate-in fade-in duration-500">
            {/* Mode Switcher */}
            <div className="flex border-b border-gray-50">
                <button 
                    onClick={() => setMode('url')}
                    className={`flex-1 py-4 flex items-center justify-center gap-3 transition-all ${mode === 'url' ? 'bg-orange-500 text-white font-black' : 'text-gray-400 hover:bg-gray-50 font-bold'}`}
                >
                    <Globe size={16} /> <span className="text-[10px] uppercase tracking-widest">Digital Link Import</span>
                </button>
                <button 
                    onClick={() => setMode('csv')}
                    className={`flex-1 py-4 flex items-center justify-center gap-3 transition-all ${mode === 'csv' ? 'bg-orange-500 text-white font-black' : 'text-gray-400 hover:bg-gray-50 font-bold'}`}
                >
                    <Upload size={16} /> <span className="text-[10px] uppercase tracking-widest">Bulk CSV Registry</span>
                </button>
            </div>

            <div className="p-8">
                {mode === 'url' ? (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Store URL (Amazon, Flipkart, etc.)</label>
                            <div className="flex gap-4">
                                <div className="relative flex-1 group">
                                    <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                    <input 
                                        type="url"
                                        value={url}
                                        onChange={e => setUrl(e.target.value)}
                                        placeholder="https://www.amazon.in/dp/..."
                                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50/50 border border-gray-100 text-sm font-medium focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
                                    />
                                </div>
                                <button 
                                    onClick={handleUrlImport}
                                    disabled={importing}
                                    className="px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-gray-200 disabled:opacity-50"
                                >
                                    {importing ? 'SYNCHRONIZING...' : 'FETCH INTEL'}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                            <AlertCircle className="text-blue-500 w-5 h-5 flex-shrink-0" />
                            <p className="text-[10px] text-blue-600 font-medium leading-relaxed uppercase tracking-tight">
                                Our AI will attempt to extract high-fidelity product data including visuals, pricing, and narrative structures from the provided link.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {!csvData.length ? (
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="relative border-4 border-dashed border-gray-100 rounded-[2.5rem] p-16 flex flex-col items-center justify-center group hover:border-orange-500/30 hover:bg-orange-50/10 transition-all cursor-pointer overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    accept=".csv"
                                    onChange={handleFileUpload}
                                    className="hidden" 
                                />
                                <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-100 transition-all shadow-inner">
                                    <FolderSync className="text-gray-300 w-10 h-10 group-hover:text-orange-500 transition-colors" />
                                </div>
                                <h4 className="text-base font-black text-gray-900 uppercase tracking-widest mb-2 italic">Drop CSV Archive Here</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-8">Registry Protocol: Columns Expected [Title, Brand, Category, Link]</p>
                                
                                <button className="px-8 py-3 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-gray-200 group-hover:bg-orange-500 group-hover:shadow-orange-500/20 transition-all">
                                    Browse Computer Files
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                                            <Check size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{fileName}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{csvData.length} records standing by</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => { setCsvData([]); setFileName(''); }}
                                        className="text-[9px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2 hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
                                    >
                                        <Trash2 size={14} /> Clear Archive
                                    </button>
                                </div>

                                <div className="max-h-64 overflow-y-auto rounded-2xl border border-gray-100 scrollbar-hide">
                                    <table className="w-full border-collapse">
                                        <thead className="bg-gray-50/50 sticky top-0">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Title</th>
                                                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                                                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Affiliation</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {csvData.slice(0, 10).map((row, i) => (
                                                <tr key={i} className="bg-white">
                                                    <td className="px-6 py-3 text-[10px] font-bold text-gray-600 truncate max-w-[200px] uppercase italic">{row.title || 'Untitled'}</td>
                                                    <td className="px-6 py-3 text-[10px] font-black text-orange-500 uppercase">{row.category || 'Editorial'}</td>
                                                    <td className="px-6 py-3 text-[10px] text-gray-400 uppercase truncate max-w-[150px]">{row.link || '---'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <button 
                                    onClick={() => onBulkImport(csvData)}
                                    className="w-full py-5 bg-gray-900 hover:bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-[0.98]"
                                >
                                    Authorize Massive Import Operations <ArrowRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
