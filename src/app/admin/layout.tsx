"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const ALLOWED_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    useEffect(() => {
        async function checkAuth() {
            if (!supabase) {
                setLoading(false);
                return;
            }

            // Skip check for login page to avoid loops
            if (pathname === '/admin/login') {
                setLoading(false);
                return;
            }

            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.replace('/admin/login');
                return;
            }

            if (ALLOWED_EMAIL && session.user.email !== ALLOWED_EMAIL) {
                console.warn(`Access denied for ${session.user.email}. Expected ${ALLOWED_EMAIL}`);
                router.replace('/'); // Kick out unauthorized users
                return;
            }

            setLoading(false);
        }

        checkAuth();
    }, [pathname, router, ALLOWED_EMAIL]);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-red-500/30">
            {children}
        </div>
    );
}
