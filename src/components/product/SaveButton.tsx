'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';

interface SaveButtonProps {
    productId: string;
    initialIsSaved?: boolean;
}

export function SaveButton({ productId, initialIsSaved = false }: SaveButtonProps) {
    const [isSaved, setIsSaved] = useState(initialIsSaved);
    const { user } = useAuth();
    const supabase = createClient();

    useEffect(() => {
        if (user) {
            supabase
                .from('saved_products')
                .select('id')
                .eq('user_id', user.id)
                .eq('product_id', productId)
                .maybeSingle()
                .then(({ data }) => {
                    setIsSaved(!!data);
                });
        }
    }, [user, productId]);

    const handleSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to save products');
            return;
        }

        if (isSaved) {
            const { error } = await supabase
                .from('saved_products')
                .delete()
                .eq('user_id', user.id)
                .eq('product_id', productId);

            if (!error) {
                setIsSaved(false);
                toast.success('Product removed from saved');
            }
        } else {
            const { error } = await supabase
                .from('saved_products')
                .insert({ user_id: user.id, product_id: productId });

            if (!error) {
                setIsSaved(true);
                toast.success('Product saved successfully');
            }
        }
    };

    return (
        <button
            onClick={handleSave}
            className={`px-5 py-4 rounded-2xl border-2 transition-all flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md active:scale-95 ${isSaved
                    ? 'border-red-200 bg-red-50 text-red-500 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400'
                    : 'border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-500 hover:border-orange-200 dark:hover:border-orange-500/30 hover:text-orange-500 dark:bg-zinc-900/50'
                }`}
            title={isSaved ? "Remove from saved" : "Save product"}
        >
            <Heart className={`w-5 h-5 transition-transform duration-300 ${isSaved ? 'fill-red-500 dark:fill-red-400 scale-110' : 'group-hover:scale-110'}`} />
        </button>
    );
}
