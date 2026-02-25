import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string) => {
        const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
        setProfile(data);
        setLoading(false);
    };

    const isAdmin = (email: string) => {
        const admins = [
            'pateldev2317@gmail.com',
            'girishguptaaditya@gmail.com',
            'pateldhairya64@gmail.com',
            'vaka2182003@gmail.com'
        ];
        return admins.includes(email);
    };

    return { user, profile, loading, isAdmin };
}
