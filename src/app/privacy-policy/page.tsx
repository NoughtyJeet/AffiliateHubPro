import { Shield, Lock, Eye, Scale, UserCheck } from 'lucide-react';

export const metadata = {
    title: 'Privacy Policy - Your Data & Trust',
    description: 'Our commitment to protecting your privacy and being transparent about how we collect and use data on AffiliateHub.',
};

export default function PrivacyPage() {
    const sections = [
        {
            title: 'Information Collection',
            icon: <Eye className="w-5 h-5 text-orange-500" />,
            content: 'We collect minimal data necessary to provide a personalized shopping experience. This includes email addresses for newsletter subscribers and cookies for affiliate attribution.'
        },
        {
            title: 'Cookie Infrastructure',
            icon: <Lock className="w-5 h-5 text-blue-500" />,
            content: 'AffiliateHub uses standard cookies to ensure that when you click on a product link, the merchant knows you came from our site. This is essential for our survival as a free resource.'
        },
        {
            title: 'Data Sharing Protocols',
            icon: <Scale className="w-5 h-5 text-green-500" />,
            content: 'We NEVER sell your personal data to third parties. Your email is used strictly for communications you have explicitly requested.'
        },
        {
            title: 'Your Rights',
            icon: <UserCheck className="w-5 h-5 text-purple-500" />,
            content: 'You have the right to request a full dump of your data or its permanent deletion from our systems at any time via our Contact page.'
        }
    ];

    return (
        <div className="bg-white min-h-screen pb-24">
            <div className="bg-gray-900 py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <Shield className="w-16 h-16 text-orange-500 mx-auto mb-6" />
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic mb-4">Privacy Framework</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Effective Cluster Update: February 2026</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-10 lg:p-16 space-y-12">
                    {sections.map(s => (
                        <section key={s.title} className="space-y-4">
                            <div className="flex items-center gap-3">
                                {s.icon}
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{s.title}</h2>
                            </div>
                            <p className="text-gray-600 font-medium leading-relaxed">{s.content}</p>
                        </section>
                    ))}

                    <div className="pt-10 border-t border-gray-50">
                        <p className="text-xs text-gray-400 font-medium leading-relaxed">
                            By using this site, you agree to the terms outlined in this document. We reserve the right to update this policy as the global digital landscape evolves.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
