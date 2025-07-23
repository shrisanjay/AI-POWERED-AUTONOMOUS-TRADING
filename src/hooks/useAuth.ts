import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, createUserProfile, createDefaultPortfolio } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Create user profile and default portfolio on sign up
        if (event === 'SIGNED_UP' && session?.user) {
          try {
            await createUserProfile(
              session.user.id,
              session.user.email!,
              session.user.user_metadata?.full_name
            );
            await createDefaultPortfolio(session.user.id);
          } catch (error) {
            console.error('Error creating user profile:', error);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    session,
    loading,
    signOut: () => supabase.auth.signOut()
  };
}