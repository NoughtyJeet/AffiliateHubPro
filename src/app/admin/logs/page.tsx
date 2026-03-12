'use client';

import { useState, useEffect } from 'react';
import { 
    Terminal, Search, Filter, Trash2, 
    Shield, Activity, User, Clock,
    AlertCircle, CheckCircle, Info
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

type AuditLog = {
    id: string;
    action: string;
    entity_type: string;
    entity_id: string;
    admin_id: string;
    details: any;
    severity: 'info' | 'warning' | 'critical';
    ip_address: string;
    created_at: string;
};

export default function AdminLogs() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [severityFilter, setSeverityFilter] = useState('all');
    const supabase = createClient();

    useEffect(() => {
        fetchLogs();
    }, []);

    async function fetchLogs() {
        setLoading(true);
        const { data, error } = await supabase
            .from('admin_audit_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) {
            console.error('Error fetching logs:', error);
            // Fallback for demo if table doesn't exist yet
            setLogs([]);
        } else {
            setLogs(data || []);
        }
        setLoading(false);
    }

    async function clearLogs() {
        if (!confirm('SECURITY ALERT: This will permanently erase all system audit logs. Proceed with caution.')) return;
        
        const { error } = await supabase.from('admin_audit_logs').delete().neq('id', '0');
        if (error) {
            toast.error('Failed to clear logs');
        } else {
            toast.success('Audit trail wiped');
            fetchLogs();
        }
    }

    const filtered = logs.filter(l => {
        const matchSearch = l.action.toLowerCase().includes(search.toLowerCase()) || 
                          l.entity_type.toLowerCase().includes(search.toLowerCase());
        const matchSeverity = severityFilter === 'all' || l.severity === severityFilter;
        return matchSearch && matchSeverity;
    });

    const getSeverityIcon = (sev: string) => {
        switch (sev) {
            case 'critical': return <AlertCircle className="w-4 h-4 text-red-500" />;
            case 'warning': return <AlertCircle className="w-4 h-4 text-amber-500" />;
            default: return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 leading-none">Security Protocol</p>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">System Audit Trail</h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-3">
                        Monitoring {logs.length} Recent Administrative Events
                    </p>
                </div>
                <button
                    onClick={clearLogs}
                    className="flex items-center gap-3 bg-white text-rose-500 border border-rose-100 hover:bg-rose-50 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm cursor-pointer"
                >
                    <Trash2 className="w-5 h-5" /> Wipe Trail
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Filter by action or entity..."
                        className="w-full pl-14 pr-6 py-4 rounded-[1.25rem] bg-white border border-slate-100 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-500 transition-all shadow-sm"
                    />
                </div>
                <div className="relative group">
                    <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-600 transition-colors pointer-events-none" />
                    <select
                        value={severityFilter}
                        onChange={e => setSeverityFilter(e.target.value)}
                        className="pl-14 pr-12 py-4 rounded-[1.25rem] bg-white border border-slate-100 text-sm font-black uppercase tracking-widest text-slate-600 focus:outline-none focus:border-slate-500 appearance-none cursor-pointer shadow-sm"
                    >
                        <option value="all">Every Severity</option>
                        <option value="critical">Critical Only</option>
                        <option value="warning">Warnings</option>
                        <option value="info">Information</option>
                    </select>
                </div>
            </div>

            {/* Log Matrix */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px] relative">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                        <div className="w-12 h-12 border-4 border-slate-700 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 grayscale opacity-30">
                        <Terminal size={64} className="mb-6" />
                        <p className="font-black uppercase tracking-widest text-[10px]">System Clean / No Logs Found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-50">
                                    {['Timestamp', 'Administrator', 'Action Protocol', 'Entity Context', 'Severity'].map(h => (
                                        <th key={h} className="text-left px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map(l => (
                                    <tr key={l.id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <Clock className="w-3.5 h-3.5 text-slate-300" />
                                                <div className="min-w-0">
                                                    <p className="text-[11px] font-black text-slate-900 tabular-nums leading-none">
                                                        {new Date(l.created_at).toLocaleTimeString()}
                                                    </p>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                                        {new Date(l.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                                                    <User size={12} className="text-slate-400" />
                                                </div>
                                                <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{l.admin_id.substring(0, 8)}...</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight group-hover:text-slate-700 transition-colors">{l.action}</span>
                                                <span className="text-[9px] text-slate-400 font-bold leading-none">{l.ip_address}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded text-[9px] font-black text-gray-500 uppercase tracking-widest">
                                                    {l.entity_type}
                                                </span>
                                                <span className="text-[9px] text-gray-400 font-mono truncate max-w-[100px]">{l.entity_id}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                                                l.severity === 'critical' ? 'bg-red-50 border-red-100 text-red-600' :
                                                l.severity === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                                                'bg-blue-50 border-blue-100 text-blue-600'
                                            }`}>
                                                {getSeverityIcon(l.severity)}
                                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">{l.severity}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Matrix Footer */}
            <div className="flex items-center justify-between p-8 bg-slate-900 rounded-[2rem] text-slate-300 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10 flex items-center gap-6">
                    <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700">
                        <Shield className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.2em] mb-1">Immortal Logging Active</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Every administrative pulse is synchronized with the core database.</p>
                    </div>
                </div>
                <Activity className="w-12 h-12 text-slate-500/20 absolute right-10 top-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-700" />
            </div>
        </div>
    );
}
