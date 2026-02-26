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
        <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-primary">Frequently Asked Questions</h2>
            <div className="space-y-3">
                {faqs.map((faq, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                        <button
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                        >
                            <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                            <ChevronDown
                                className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-orange-500' : ''
                                    }`}
                            />
                        </button>
                        {openIndex === i && (
                            <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-4">
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
