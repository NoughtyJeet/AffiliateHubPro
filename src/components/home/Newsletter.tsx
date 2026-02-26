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
        <section className="py-16 bg-gradient-to-r from-orange-500 to-red-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-3">Stay Updated with Best Deals</h2>
                <p className="text-orange-100 mb-8 max-w-xl mx-auto">Get weekly product roundups, exclusive deals, and expert buying tips delivered to your inbox.</p>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-orange-200 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                    />
                    <button type="submit" className="px-6 py-3 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-colors whitespace-nowrap cursor-pointer">
                        Subscribe Free
                    </button>
                </form>
                <p className="text-orange-200 text-xs mt-4">No spam. Unsubscribe anytime.</p>
            </div>
        </section>
    );
}
