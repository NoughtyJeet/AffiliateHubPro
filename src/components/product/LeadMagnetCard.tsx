'use client';

import { useState } from 'react';
import { Zap, Gift, BellRing, ArrowRight, CheckCircle } from 'lucide-react';

interface LeadMagnetCardProps {
    productTitle: string;
}

export function LeadMagnetCard({ productTitle }: LeadMagnetCardProps) {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        try {
            await fetch('/api/lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, product: productTitle }),
            });
        } catch {}
        setLoading(false);
        setSubmitted(true);
    };

    const perks = [
        'Price drop alerts for this product',
        'Exclusive coupon codes & deals',
        'Expert-tested alternatives',
    ];

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 dark:from-zinc-800 dark:via-zinc-900 dark:to-black border border-white/10 shadow-2xl shadow-black/30 p-7 flex flex-col h-full">
            {/* Glow blob */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Badge */}
            <div className="relative z-10 inline-flex self-start items-center gap-1.5 px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full mb-5">
                <Zap className="w-3 h-3 text-orange-400" />
                <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em]">Exclusive Access</span>
            </div>

            {/* Headline */}
            <div className="relative z-10 mb-5">
                <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-5 h-5 text-orange-400" />
                    <h3 className="text-lg font-black text-white leading-tight">
                        Get the Best Deal on<br />
                        <span className="text-orange-400 line-clamp-1">{productTitle}</span>
                    </h3>
                </div>
                <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                    Join 18,000+ smart shoppers. We notify you before prices drop.
                </p>
            </div>

            {/* Perks */}
            <ul className="relative z-10 space-y-2.5 mb-6">
                {perks.map((perk, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                        <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                        <span className="text-xs text-zinc-300 font-medium">{perk}</span>
                    </li>
                ))}
            </ul>

            {/* Form */}
            <div className="relative z-10 mt-auto">
                {submitted ? (
                    <div className="flex flex-col items-center gap-3 py-4 text-center">
                        <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                        <p className="text-sm font-black text-white">You&apos;re in! 🎉</p>
                        <p className="text-xs text-zinc-400">We&apos;ll alert you when the price drops.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                        <div className="relative">
                            <BellRing className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/8 transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 active:scale-[0.98] disabled:opacity-60"
                        >
                            {loading ? 'Submitting...' : <>Alert Me to Best Price <ArrowRight className="w-3.5 h-3.5" /></>}
                        </button>
                        <p className="text-[9px] text-zinc-600 font-medium text-center uppercase tracking-widest">
                            No spam ever · Unsubscribe anytime
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
