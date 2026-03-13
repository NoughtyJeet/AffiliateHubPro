'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1500));
        setSubmitting(false);
        setSubmitted(true);
        toast.success('Transmission Received');
    };

    return (
        <div className="bg-white min-h-screen pb-24">
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-100 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-none mb-6">Connect With The <span className="text-orange-500 underline decoration-8 underline-offset-4">Experts</span></h1>
                    <p className="max-w-xl mx-auto text-gray-500 font-medium text-lg">Have a product you want us to review? Or just a question about your next purchase? We&apos;re here to help.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Info Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-orange-600 text-white rounded-[2.5rem] p-10 shadow-xl shadow-orange-500/20">
                            <h2 className="text-2xl font-black mb-10 tracking-tight uppercase leading-none">Contact<br />Intel</h2>
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0"><Mail size={20} /></div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-orange-200">Email Pipeline</p>
                                        <p className="font-bold">hello@affiliatehub.pro</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0"><Phone size={20} /></div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-orange-200">Phone Signal</p>
                                        <p className="font-bold">+1 (555) 0123-4567</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0"><MapPin size={20} /></div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-orange-200">Global HQ</p>
                                        <p className="font-bold text-sm">Tech Plaza, Digital District, Silicon Valley, CA</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center"><MessageCircle size={24} /></div>
                            <div>
                                <h4 className="text-sm font-black uppercase tracking-tight">Live Chat</h4>
                                <p className="text-xs text-gray-500 font-medium italic">Available 9am - 5pm EST</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Area */}
                    <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-2xl border border-gray-50 p-12 lg:p-16">
                        {submitted ? (
                            <div className="flex flex-col items-center justify-center text-center py-20 animate-in zoom-in-95 duration-500">
                                <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
                                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase mb-4">Message Synced!</h2>
                                <p className="text-gray-500 font-medium max-w-sm mb-8">Your query has been encoded and dispatched to our review team. Expect a response within 24 standard hours.</p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="px-8 py-4 bg-gray-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-gray-200"
                                >
                                    Send Another Transmission
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Identity *</label>
                                        <input required type="text" placeholder="e.g. Alex Jensen" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold shadow-inner focus:bg-white transition-all outline-none" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Digital Address *</label>
                                        <input required type="email" placeholder="alex@company.com" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold shadow-inner focus:bg-white transition-all outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subject Vector *</label>
                                    <select className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-black uppercase tracking-widest shadow-inner focus:bg-white outline-none appearance-none">
                                        <option>Product Recommendation</option>
                                        <option>Review Request</option>
                                        <option>Partnership Inquiry</option>
                                        <option>Technical Issue</option>
                                        <option>Other Feedback</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Detailed Inquiry *</label>
                                    <textarea required rows={6} placeholder="Deconstruct your thoughts here..." className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium shadow-inner focus:bg-white transition-all outline-none resize-none"></textarea>
                                </div>
                                <button
                                    disabled={submitting}
                                    className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-black text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-gray-200 cursor-pointer disabled:bg-gray-400"
                                >
                                    {submitting ? 'ENCODING...' : (
                                        <>Dispatch Message <Send size={16} /></>
                                    )}
                                </button>
                                <p className="text-center text-[9px] font-black text-gray-400 uppercase tracking-widest opacity-60">Encrypting communication with end-to-end SSL protocols</p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
