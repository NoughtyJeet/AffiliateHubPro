'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Sparkles, Zap, Shield, Gift, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function SubscriptionPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        // Check if user already dismissed or subscribed
        const hasDismissed = localStorage.getItem('subscription_popup_dismissed');
        if (hasDismissed) return;

        // Show after 5 seconds
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const dismiss = () => {
        setIsVisible(false);
        localStorage.setItem('subscription_popup_dismissed', 'true');
    };

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return toast.error('Encryption requires a valid email address.');
        
        setLoading(true);
        try {
            const { error } = await supabase
                .from('subscribers')
                .insert([{ email, first_name: name, source: 'timed_popup' }]);

            if (error) {
                if (error.code === '23505') {
                    toast.success('You are already in the elite circle!');
                } else {
                    throw error;
                }
            } else {
                toast.success('Neural link established. Check your inbox!');
            }
            
            setSubscribed(true);
            setTimeout(() => dismiss(), 2000);
        } catch (err: any) {
            toast.error(err.message || 'Transmission failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={dismiss}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                    />

                    {/* Popup Container */}
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row min-h-[500px]"
                    >
                        {/* Left: Lucide/Techy Visual Deck */}
                        <div className="md:w-1/2 bg-slate-950 relative overflow-hidden flex flex-col justify-center p-12 text-white">
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 left-0 w-full h-full">
                                <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-orange-600/20 blur-[100px]" />
                                <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-blue-600/20 blur-[100px]" />
                                <div className="absolute inset-0 opacity-10" style={{ 
                                    backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', 
                                    backgroundSize: '32px 32px' 
                                }} />
                            </div>

                            <div className="relative z-10 space-y-8">
                                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 border border-white/10 rounded-2xl backdrop-blur-md">
                                    <Sparkles className="w-4 h-4 text-orange-400" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Inner Circle Access</span>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none italic uppercase">
                                        Join the <span className="text-orange-500">Elite</span> Tech Stream.
                                    </h2>
                                    <p className="text-slate-400 font-medium text-lg leading-relaxed">
                                        Level up your setup with 100% honest reviews, exclusive daily deals, and future-tech alerts direct to your hub.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { icon: Zap, text: 'Early Access to Product Drops' },
                                        { icon: Shield, text: 'Verified Honest Comparisons' },
                                        { icon: Gift, text: 'Exclusive Subscription-Only Deals' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-slate-300">
                                            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                                <item.icon className="w-4 h-4 text-orange-400" />
                                            </div>
                                            {item.text}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Corner Tech Label */}
                            <div className="absolute bottom-10 left-12 flex items-center gap-3 opacity-20">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Neural Link Security V.4</span>
                            </div>
                        </div>

                        {/* Right: Subscription Hub */}
                        <div className="md:w-1/2 bg-white p-12 flex flex-col justify-center relative">
                            <button 
                                onClick={dismiss}
                                className="absolute top-8 right-8 p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all"
                            >
                                <X size={24} />
                            </button>

                            {subscribed ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center space-y-6"
                                >
                                    <div className="w-24 h-24 bg-green-50 border border-green-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                                        <Zap className="w-10 h-10 text-green-600 fill-green-600" />
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Welcome to the Hub</h3>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Your transmission has been confirmed. Redirecting...</p>
                                </motion.div>
                            ) : (
                                <div className="space-y-10">
                                    <div>
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Initialize Subscription</h3>
                                        <p className="text-slate-900 text-2xl font-black tracking-tight leading-tight">
                                            Enter your credentials to receive the <span className="text-orange-500">Master List</span> of tech deals.
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubscribe} className="space-y-4">
                                        <div className="relative group">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                                                <Zap size={18} />
                                            </div>
                                            <input 
                                                type="text"
                                                placeholder="FIRST NAME"
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                                            />
                                        </div>

                                        <div className="relative group">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                                                <Mail size={18} />
                                            </div>
                                            <input 
                                                type="email"
                                                required
                                                placeholder="EMAIL ADDRESS"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                                            />
                                        </div>

                                        <button 
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-6 bg-slate-950 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-orange-600 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
                                        >
                                            {loading ? 'Transmitting...' : (
                                                <>
                                                    Secure Access <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center leading-relaxed">
                                        By subscribing, you agree to receive technical transmissions & promotions. No spam, only high-octane content.
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
