// src/lib/supabase-client.ts
import { createBrowserClient } from '@supabase/ssr';
import { type User } from '@supabase/supabase-js';

/**
 * Creates a Supabase client for use in client components
 * This client should only be used on the client side
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// For backward compatibility and easier migration
export const supabase = createBrowserSupabaseClient();

/**
 * Authentication helper functions for client components
 * These functions should only be used on the client side
 */
export const auth = {
  /**
   * Sign in with email OTP (magic link)
   * @param email User's email address
   */
  signInWithEmail: async (email: string) => {
    const client = createBrowserSupabaseClient();
    return await client.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  },
  
  /**
   * Sign in with Google OAuth
   */
  signInWithGoogle: async () => {
    const client = createBrowserSupabaseClient();
    return await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  },
  
  /**
   * Sign out the current user
   */
  signOut: async () => {
    const client = createBrowserSupabaseClient();
    return await client.auth.signOut();
  },
  
  /**
   * Get the current session
   */
  getSession: async () => {
    const client = createBrowserSupabaseClient();
    return await client.auth.getSession();
  },
  
  /**
   * Get the current user
   */
  getUser: async () => {
    const client = createBrowserSupabaseClient();
    const { data: { user } } = await client.auth.getUser();
    return user;
  },
};

/**
 * Custom hook for authentication state
 * Use this in client components to access auth state
 */
export function useAuth() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    const client = createBrowserSupabaseClient();
    
    // Get initial session
    const getInitialSession = async () => {
      setLoading(true);
      
      const { data: { session } } = await client.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    
    getInitialSession();
    
    // Set up auth state listener
    const { data: { subscription } } = client.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );
    
    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  return { user, loading };
}

/**
 * Error handling for Supabase operations
 * @param error Error object from Supabase
 * @returns Friendly error message
 */
export const handleSupabaseError = (error: any): string => {
  console.error('Supabase error:', error);
  
  // Handle specific error codes
  if (error?.code === '42P17') {
    return '数据库策略错误，请联系管理员。我们正在修复RLS策略递归问题。';
  }
  
  if (error?.code === 'auth/invalid-email') {
    return '无效的电子邮件地址。';
  }
  
  if (error?.code === 'auth/user-not-found') {
    return '用户不存在。';
  }
  
  return error?.message || '发生未知错误，请稍后再试';
};

// Re-export types for convenience
export type { Session, User } from '@supabase/supabase-js';

// Import React for the useAuth hook
import React from 'react';