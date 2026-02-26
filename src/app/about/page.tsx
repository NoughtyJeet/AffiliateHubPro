import { Info, Target, Heart, Shield, Users, Award, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'About Us - Our Mission & Expertise',
    description: 'Learn about the team behind AffiliateHub, our commitment to honest reviews, and our process for selecting the best products for our readers.',
};

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="bg-gray-900 text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                        <Users size={14} className="text-orange-400" /> The Team Behind The Hub
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-8 tracking-tighter uppercase italic leading-none">
                        Our Mission: <span className="text-orange-500">Simplify Shopping</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-gray-400 font-medium leading-relaxed">
                        In a world of infinite choices and paid sponsorships, we provide the clarity you need to spend your hard-earned money wisely.
                    </p>
                </div>
            </div>

            {/* Values Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 -mt-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner"><Target size={32} /></div>
                        <h3 className="text-lg font-black uppercase tracking-tighter mb-4">Precision Selection</h3>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">We don't review everything. We only review products that have passed initial reliability and value scoring.</p>
                    </div>
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner"><Shield size={32} /></div>
                        <h3 className="text-lg font-black uppercase tracking-tighter mb-4">Unbiased Reviews</h3>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">Our writers are professionals. We never accept payment for a positive review or product placement.</p>
                    </div>
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner"><Award size={32} /></div>
                        <h3 className="text-lg font-black uppercase tracking-tighter mb-4">Expert Insights</h3>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">Our team consists of tech enthusiasts, fitness junkies, and home-improvement pros with decades of experience.</p>
                    </div>
                </div>

                <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase leading-none mb-6 italic">Who We Are</h2>
                            <p className="text-gray-600 font-medium text-lg leading-relaxed">
                                Founded in 2024, AffiliateHub started as a small blog dedicated to testing mechanical keyboards. Today, we've grown into a comprehensive consumer resource covering everything from smart home security to the best espresso machines.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-orange-500 shadow-sm">01</div>
                                <p className="text-sm font-bold text-gray-800">100% Data-Driven Scoring</p>
                            </div>
                            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-blue-500 shadow-sm">02</div>
                                <p className="text-sm font-bold text-gray-800">Verified Amazon Purchase Analysis</p>
                            </div>
                            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-green-500 shadow-sm">03</div>
                                <p className="text-sm font-bold text-gray-800">Community-Powered Trust Score</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-square bg-gray-900 rounded-[3rem] overflow-hidden shadow-2xl skew-x-1 hover:skew-x-0 transition-transform duration-500">
                            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" alt="Team" className="w-full h-full object-cover opacity-80" />
                        </div>
                        <div className="absolute -bottom-8 -left-8 bg-orange-500 text-white p-10 rounded-[2rem] shadow-xl">
                            <p className="text-5xl font-black leading-none mb-1">50K+</p>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Active Newsletter Readers</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
