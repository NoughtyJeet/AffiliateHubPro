'use client';

import { useState } from 'react';
import { Sparkles, Wand2, Search, MessageSquare, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface AIAssistantProps {
    title: string;
    content: string;
    onApply: (type: 'title' | 'meta' | 'outline', value: string) => void;
}

export default function AIAssistant({ title, content, onApply }: AIAssistantProps) {
    const [expanded, setExpanded] = useState<string | null>('seo');
    const [generating, setGenerating] = useState(false);
    const [suggestions, setSuggestions] = useState<any>({
        seoTitles: [],
        metaDescriptions: [],
        outline: '',
    });

    const toggle = (id: string) => setExpanded(expanded === id ? null : id);

    const generateSEO = async () => {
        if (!title) return toast.error('Please enter a title first');
        setGenerating(true);
        // Mocking AI response for now - in production, this calls a Gemini/OpenAI API route
        setTimeout(() => {
            setSuggestions({
                ...suggestions,
                seoTitles: [
                    `${title} | 2026 Buying Guide`,
                    `10 Best ${title} for Professionals`,
                    `The Ultimate Guide to ${title} in India`,
                ],
                metaDescriptions: [
                    `Looking for the perfect ${title}? Our comprehensive guide covers the top models, pros, cons, and performance metrics to help you decide.`,
                    `Expert review of the latest ${title}. We test battery life, connectivity, and style to find the absolute best options for your budget.`,
                ]
            });
            setGenerating(false);
            toast.success('AI Suggestions Generated!');
        }, 1500);
    };

    return (
        <div className="w-80 h-full bg-white border-l border-gray-100 flex flex-col animate-in slide-in-from-right duration-500 shadow-2xl">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500 fill-orange-500" />
                    <span className="font-black text-gray-900 uppercase tracking-widest text-[10px]">AI Editorial Assistant</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {/* SEO Optimization Block */}
                <div className="bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden">
                    <button 
                        onClick={() => toggle('seo')}
                        className="w-full flex items-center justify-between p-4 hover:bg-white transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <Search className="w-4 h-4 text-blue-500" />
                            <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none">SEO Optimization</span>
                        </div>
                        {expanded === 'seo' ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                    </button>
                    
                    {expanded === 'seo' && (
                        <div className="p-4 pt-0 space-y-4 animate-in fade-in duration-300">
                            <button 
                                onClick={generateSEO}
                                disabled={generating}
                                className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
                            >
                                {generating ? 'Analyzing Context...' : 'Optimize Meta Data'}
                            </button>

                            {suggestions.seoTitles.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Suggested Headlines</p>
                                    {suggestions.seoTitles.map((t: string, i: number) => (
                                        <div key={i} className="group relative bg-white border border-gray-100 p-3 rounded-xl hover:border-orange-200 transition-all cursor-pointer shadow-sm" onClick={() => onApply('title', t)}>
                                            <p className="text-[11px] font-bold text-gray-700 leading-tight">{t}</p>
                                            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Copy size={12} className="text-orange-500" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {suggestions.metaDescriptions.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Meta Snippets</p>
                                    {suggestions.metaDescriptions.map((m: string, i: number) => (
                                        <div key={i} className="group relative bg-white border border-gray-100 p-3 rounded-xl hover:border-blue-200 transition-all cursor-pointer shadow-sm" onClick={() => onApply('meta', m)}>
                                            <p className="text-[10px] font-medium text-gray-500 leading-relaxed">{m}</p>
                                            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Check size={12} className="text-blue-500" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Content Improver Block */}
                <div className="bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden">
                    <button 
                        onClick={() => toggle('content')}
                        className="w-full flex items-center justify-between p-4 hover:bg-white transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <Wand2 className="w-4 h-4 text-purple-500" />
                            <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none">Content Polish</span>
                        </div>
                        {expanded === 'content' ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                    </button>
                    {expanded === 'content' && (
                        <div className="p-4 pt-0 space-y-3 animate-in fade-in duration-300">
                            {[
                                'Simplify Readability',
                                'Professional Polish',
                                'Persuasive Tone',
                                'Fix Grammatical Flows'
                            ].map(action => (
                                <button key={action} className="w-full text-left p-3 rounded-xl bg-white border border-gray-100 hover:border-purple-200 transition-all flex items-center gap-2 group">
                                    <div className="w-2 h-2 rounded-full bg-purple-100 group-hover:bg-purple-500 transition-colors" />
                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{action}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Structure Block */}
                <div className="bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden">
                    <button 
                        onClick={() => toggle('outline')}
                        className="w-full flex items-center justify-between p-4 hover:bg-white transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <MessageSquare className="w-4 h-4 text-green-500" />
                            <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none">Structure Engine</span>
                        </div>
                        {expanded === 'outline' ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                    </button>
                    {expanded === 'outline' && (
                        <div className="p-4 pt-0 animate-in fade-in duration-300">
                            <p className="text-[10px] text-gray-500 font-medium leading-relaxed italic border-l-2 border-green-500 pl-3">
                                Analyzing your headline to generate an optimized article outline including H2 and H3 recommendations.
                            </p>
                            <button className="w-full mt-4 py-2 bg-green-500 hover:bg-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                                Build Structural Frame
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 border-t border-gray-50 bg-gray-50/30">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Global AI Engine Connected</span>
                </div>
                <p className="text-[9px] font-medium text-gray-400 leading-tight">
                    Suggestions are context-aware based on your existing manuscript and keywords.
                </p>
            </div>
        </div>
    );
}
