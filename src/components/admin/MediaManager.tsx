'use client';

import { useState, useEffect } from 'react';
import { Upload, X, Search, Grid, List as ListIcon, Trash2, Copy, FileText, Image as ImageIcon, MoreVertical, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

type MediaFile = {
    id: string;
    filename: string;
    file_url: string;
    file_type: string;
    file_size: number;
    alt_text: string | null;
    created_at: string;
};

export default function MediaManager() {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [search, setSearch] = useState('');
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const supabase = createClient();

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('media_library')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) toast.error(error.message);
        else setFiles(data || []);
        setLoading(false);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        try {
            // 1. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('media')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('media')
                .getPublicUrl(filePath);

            // 3. Register in DB
            const { error: dbError } = await supabase.from('media_library').insert({
                filename: file.name,
                file_url: publicUrl,
                file_type: file.type,
                file_size: file.size,
                alt_text: file.name.split('.')[0]
            });

            if (dbError) throw dbError;

            toast.success('Asset secured in vault!');
            fetchFiles();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (file: MediaFile) => {
        if (!confirm('Erase this asset permanently?')) return;

        try {
            // Delete from storage (parsing filename from URL)
            const path = file.file_url.split('/media/')[1];
            if (path) {
                await supabase.storage.from('media').remove([path]);
            }

            // Delete from DB
            const { error } = await supabase.from('media_library').delete().eq('id', file.id);
            if (error) throw error;

            toast.success('Asset purged');
            fetchFiles();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const copyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        toast.success('Public URL copied to clipboard');
    };

    const filtered = files.filter(f => 
        f.filename.toLowerCase().includes(search.toLowerCase()) || 
        f.alt_text?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 leading-none">Digital Asset Management</p>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Media Vault</h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-3">
                        Scanning {files.length} Secure Objects
                    </p>
                </div>
                <div className="relative">
                    <input 
                        type="file" 
                        onChange={handleUpload}
                        className="hidden" 
                        id="media-upload"
                        disabled={uploading}
                    />
                    <label 
                        htmlFor="media-upload"
                        className="flex items-center gap-3 bg-slate-800 hover:bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-200/50 cursor-pointer disabled:opacity-50"
                    >
                        <Upload className="w-5 h-5" /> {uploading ? 'SYNCING...' : 'Authorize Upload'}
                    </label>
                </div>
            </div>

            {/* Tool Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                    <input 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Filter vault by filename or metadata..."
                        className="w-full pl-14 pr-6 py-4 rounded-[1.25rem] bg-white border border-slate-100 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-500/5 focus:border-slate-500 transition-all shadow-sm"
                    />
                </div>
                <div className="flex bg-white border border-slate-100 rounded-2xl p-1.5 shadow-sm">
                    <button 
                        onClick={() => setView('grid')}
                        className={`p-2.5 rounded-xl transition-all ${view === 'grid' ? 'bg-slate-800 text-white shadow-lg shadow-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Grid size={20} />
                    </button>
                    <button 
                        onClick={() => setView('list')}
                        className={`p-2.5 rounded-xl transition-all ${view === 'list' ? 'bg-slate-800 text-white shadow-lg shadow-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <ListIcon size={20} />
                    </button>
                </div>
            </div>

            {/* Assets Grid/List */}
            <div className="relative min-h-[400px]">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-slate-700 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 grayscale opacity-40">
                        <ImageIcon size={64} className="mb-6 text-gray-300" />
                        <p className="font-black uppercase tracking-widest text-xs">The vault is empty</p>
                    </div>
                ) : view === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {filtered.map(file => (
                            <div key={file.id} className="group relative bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all">
                                <div className="aspect-square bg-slate-50 flex items-center justify-center overflow-hidden">
                                    {file.file_type.startsWith('image/') ? (
                                        <img src={file.file_url} alt={file.alt_text || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <FileText size={32} className="text-slate-300" />
                                    )}
                                </div>
                                
                                {/* Overlay Controls */}
                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                    <button onClick={() => copyUrl(file.file_url)} className="w-10 h-10 rounded-xl bg-white text-slate-900 flex items-center justify-center hover:bg-slate-800 hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-300">
                                        <Copy size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(file)} className="w-10 h-10 rounded-xl bg-white text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-300 delay-75">
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="p-4 border-t border-slate-50">
                                    <p className="text-[10px] font-black text-slate-900 truncate uppercase tracking-tight">{file.filename}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{(file.file_size / 1024).toFixed(1)} KB</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Dimensions</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map(file => (
                                    <tr key={file.id} className="hover:bg-slate-50 transition-all group">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0">
                                                    {file.file_type.startsWith('image/') ? (
                                                        <img src={file.file_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center"><FileText size={16} className="text-slate-300" /></div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight truncate">{file.filename}</p>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{file.file_type}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-[10px] font-black uppercase text-slate-400">{(file.file_size / 1024).toFixed(1)} KB</span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-[10px] font-bold text-slate-400 font-mono truncate max-w-[200px] block">{file.file_url}</span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => copyUrl(file.file_url)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all" title="Copy URL">
                                                    <Copy size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(file)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete Asset">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
