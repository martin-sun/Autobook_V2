"use client";
// @ts-nocheck - Ignoring type errors for Material Tailwind components

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Spinner } from "@material-tailwind/react";

type WorkspaceGuardProps = {
  children: React.ReactNode;
};

/**
 * Guards routes that require an active workspace
 * Redirects to onboarding when a user has no workspaces
 */
export default function WorkspaceGuard({ children }: WorkspaceGuardProps) {
  const [loading, setLoading] = useState(true);
  const [hasWorkspaces, setHasWorkspaces] = useState(false);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  const router = useRouter();

  useEffect(() => {
    async function checkWorkspaces() {
      try {
        // Get current user's workspaces
        const { data, error } = await supabase.rpc('get_user_workspaces');
        
        if (error) {
          console.error('Error fetching workspaces:', error);
          return;
        }

        // If no workspaces, redirect to onboarding
        if (!data || data.length === 0) {
          router.push('/onboarding');
        } else {
          setHasWorkspaces(true);
        }
      } catch (error) {
        console.error('Error in workspace check:', error);
      } finally {
        setLoading(false);
      }
    }

    checkWorkspaces();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner className="h-12 w-12" color="blue" crossOrigin="anonymous" />
      </div>
    );
  }

  // Only render children if user has workspaces, otherwise the router redirect will handle it
  return hasWorkspaces ? <>{children}</> : null;
}
