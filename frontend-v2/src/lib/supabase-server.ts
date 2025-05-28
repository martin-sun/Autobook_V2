// src/lib/supabase-server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { type CookieOptions } from '@supabase/ssr';
import { type User } from '@supabase/supabase-js';

/**
 * Creates a Supabase client for use in server components and server actions
 * This client should only be used on the server side
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}

/**
 * Gets the current user from the server
 * Use this in Server Components to check if a user is authenticated
 * and get their session data
 */
export async function getServerUser() {
  const supabase = createServerSupabaseClient();
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting user:', error.message);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Unexpected error getting user:', error);
    return null;
  }
}

/**
 * Gets the user's workspaces from the server
 * Use this in Server Components to check if a user has workspaces
 * and redirect them to the onboarding flow if needed
 */
export async function getServerUserWorkspaces() {
  const supabase = createServerSupabaseClient();
  const user = await getServerUser();
  
  if (!user) {
    return [];
  }
  
  try {
    const { data: workspaces, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error getting workspaces:', error.message);
      return [];
    }
    
    return workspaces || [];
  } catch (error) {
    console.error('Unexpected error getting workspaces:', error);
    return [];
  }
}

/**
 * Checks if a user has access to a specific workspace
 * Use this for authorization checks in Server Components and Server Actions
 */
export async function hasWorkspaceAccess(workspaceId: string) {
  const supabase = createServerSupabaseClient();
  const user = await getServerUser();
  
  if (!user) {
    return false;
  }
  
  try {
    const { data, error } = await supabase
      .from('workspace_members')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('user_id', user.id)
      .single();
    
    if (error || !data) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking workspace access:', error);
    return false;
  }
}