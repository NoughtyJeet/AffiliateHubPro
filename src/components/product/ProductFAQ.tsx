'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQ {
    question: string;
    answer: string;
}

interface ProductFAQProps {
    faqs: FAQ[];
}

export function ProductFAQ({ faqs }: ProductFAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    if (!faqs || faqs.length === 0) return null;

    return (
        <div className="mb-16">
            <h2 className="text-3xl font-black text-gray-900 dark:text-zinc-50 mb-10 tracking-tight font-primary uppercase tracking-widest">Technical Consultation (FAQ)</h2>
            <div className="space-y-3">
                {faqs.map((faq, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm transition-colors group">
                        <button
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            className="w-full flex items-center justify-between p-7 text-left hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all"
                        >
                            <span className="font-bold text-lg text-gray-900 dark:text-zinc-50 pr-6 tracking-tight group-hover:text-orange-500 transition-colors">{faq.question}</span>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${openIndex === i ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-zinc-800 text-gray-400'}`}>
                                <ChevronDown
                                    className={`w-5 h-5 transition-transform duration-500 ${openIndex === i ? 'rotate-180' : ''
                                        }`}
                                />
                            </div>
                        </button>
                        {openIndex === i && (
                            <div className="px-7 pb-7 text-gray-600 dark:text-zinc-400 text-base leading-relaxed border-t border-gray-50 dark:border-zinc-800 pt-6 font-medium animate-in fade-in slide-in-from-top-4 duration-500">
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
