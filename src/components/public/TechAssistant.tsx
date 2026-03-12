'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Cpu, Sparkles, Send, X, MessageSquare, 
    Bot, User, ChevronUp, RefreshCw, Zap,
    Terminal, ExternalLink
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export default function TechAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Neural link established. I am your Tech Assistant. How can I optimize your shopping experience today?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMsg] }),
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
        } catch (err: any) {
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: "Error: Connection to AI core interrupted. Please check your neural link (GEMINI_API_KEY) and try again." 
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 45 }}
                        onClick={() => setIsOpen(true)}
                        className="w-16 h-16 bg-gradient-to-br from-orange-500 via-orange-600 to-indigo-700 p-0.5 rounded-2xl shadow-2xl shadow-orange-500/30 group hover:shadow-orange-500/50 transition-all active:scale-95"
                    >
                        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent group-hover:opacity-100 transition-opacity" />
                            <Zap className="w-8 h-8 text-orange-400 group-hover:scale-110 transition-transform duration-500 group-hover:text-orange-300" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-950 animate-pulse" />
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(10px)' }}
                        className="w-[400px] h-[600px] bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative"
                    >
                        {/* Glow effect */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-orange-600/20 blur-[100px] pointer-events-none" />

                        {/* Top Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-blue-600 p-0.5 shadow-lg shadow-orange-500/20">
                                    <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                                        <Bot className="w-6 h-6 text-orange-400" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">AI Tech Assistant</h3>
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Pulse: 2.4 ghz</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-2.5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat Matrix */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                            m.role === 'user' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-orange-400'
                                        }`}>
                                            {m.role === 'user' ? <User size={14} /> : <Zap size={14} />}
                                        </div>
                                        <div className={`p-4 rounded-2xl text-[13px] leading-relaxed relative ${
                                            m.role === 'user' 
                                            ? 'bg-orange-500/10 border border-orange-500/20 text-orange-100 rounded-tr-none' 
                                            : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                                        }`}>
                                            {m.content}
                                            {i === messages.length - 1 && m.role === 'assistant' && (
                                                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-4">
                                                    <button className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                                                        <ExternalLink size={10} /> View Offer
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="max-w-[85%] flex gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-800 text-orange-400 flex items-center justify-center">
                                            <Zap size={14} className="animate-pulse" />
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-200 rounded-tl-none flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Deck */}
                        <div className="p-6 bg-white/[0.03] border-t border-white/5 relative">
                            <div className="flex items-center gap-3 bg-slate-900 border border-white/10 rounded-2xl px-4 py-2 group focus-within:border-orange-500/50 transition-all">
                                <Terminal size={14} className="text-slate-500 group-focus-within:text-orange-500" />
                                <input 
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                                    placeholder="Execute query..."
                                    className="flex-1 bg-transparent border-none text-[13px] text-white focus:outline-none placeholder:text-slate-600 font-mono"
                                />
                                <button 
                                    onClick={handleSend}
                                    disabled={!input.trim() || isTyping}
                                    className="p-2 bg-orange-600 text-white rounded-xl hover:bg-orange-500 disabled:opacity-50 disabled:grayscale transition-all shadow-lg shadow-orange-500/20"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                            <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
                                {['Best Deals', 'Trending Tech', 'Latest Guides'].map(p => (
                                    <button 
                                        key={p}
                                        onClick={() => setInput(p)}
                                        className="whitespace-nowrap px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Particle scan effect line */}
                        <motion.div 
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                            className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent pointer-events-none z-0"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                .scrollbar-thin::-webkit-scrollbar { width: 4px; }
                .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
                .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
            `}</style>
        </div>
    );
}
