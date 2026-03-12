'use client';

import { useState } from 'react';

export function Newsletter() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setEmail('');
        alert('Thanks for subscribing!');
    };

    return (
        <section className="py-20 bg-gradient-to-br from-orange-600 to-red-700 dark:from-orange-700 dark:to-red-900 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight uppercase tracking-widest text-sm opacity-60">Join the Collective</h2>
                <h3 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight">Stay Updated with <span className="text-orange-200">Best Deals</span></h3>
                <p className="text-orange-100/80 mb-10 max-w-xl mx-auto text-lg font-medium">Get weekly product roundups, exclusive deals, and expert buying tips delivered to your inbox.</p>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto bg-white/10 backdrop-blur-xl p-2 rounded-[2rem] border border-white/20">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="flex-1 px-6 py-4 rounded-2xl bg-transparent text-white placeholder-orange-200 focus:outline-none focus:ring-0 text-lg"
                    />
                    <button type="submit" className="px-8 py-4 bg-white text-orange-600 font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-orange-50 transition-all hover:shadow-2xl active:scale-95 cursor-pointer">
                        Subscribe
                    </button>
                </form>
                <p className="text-orange-200/50 text-[10px] uppercase font-bold mt-6 tracking-[0.3em]">No spam. Secure. Unsubscribe anytime.</p>
            </div>
        </section>
    );
}
