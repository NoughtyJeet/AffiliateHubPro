import { Info, AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';

export const metadata = {
    title: 'Affiliate Disclaimer - Transparency Matters',
    description: 'Our affiliate disclosure and transparency statement regarding our relationships with merchants including Amazon.',
};

export default function DisclaimerPage() {
    return (
        <div className="bg-white min-h-screen pb-24">
            <div className="bg-amber-500 py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)", backgroundSize: "40px 40px" }} />
                <div className="max-w-4xl mx-auto px-4 text-center relative">
                    <AlertTriangle className="w-16 h-16 text-black mx-auto mb-6" />
                    <h1 className="text-4xl font-black text-black tracking-tighter uppercase italic mb-4">Affiliate Disclosure</h1>
                    <p className="text-black/60 font-black uppercase tracking-widest text-xs">FTC Compliance Protocol v4.0</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-10 lg:p-16">
                    <div className="prose prose-orange max-w-none space-y-8 font-medium text-gray-600">
                        <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100 italic">
                            &quot;In compliance with the FTC guidelines, please assume that any and all links on this website are affiliate links, and AffiliateHub may receive a small commission from sales of certain items.&quot;
                        </section>

                        <div className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                                <ShieldCheck className="text-green-600" size={20} /> Amazon Associates Program
                            </h2>
                            <p>
                                AffiliateHub Pro is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                                <Info className="text-blue-500" size={20} /> No Extra Cost to You
                            </h2>
                            <p>
                                Clicking on these links does NOT increase the price you pay. It simply tells the retailer that you discovered the product through our research, which helps us maintain this platform as a free resource for everyone.
                            </p>
                        </div>

                        <div className="pt-10 border-t border-gray-50 flex items-center justify-between">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Full transparency is our core design principle.</p>
                            <a href="https://amazon.com" target="_blank" rel="noopener" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-orange-500">Visit Amazon <ExternalLink size={14} /></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
