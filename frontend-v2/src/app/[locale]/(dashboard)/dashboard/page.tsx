"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { Spinner, Typography } from '@material-tailwind/react';

export default function DashboardRedirect() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function redirectToWorkspace() {
      try {
        setIsLoading(true);
        
        // 获取用户的工作空间
        const { data: workspaces, error } = await supabase
          .from('workspace_members')
          .select('workspace_id, workspaces(id, name, type)')
          .eq('status', 'active')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (workspaces && workspaces.length > 0) {
          // 重定向到第一个工作空间
          const defaultWorkspaceId = workspaces[0].workspace_id;
          router.replace(`/${params.locale}/dashboard/${defaultWorkspaceId}`);
        } else {
          // 如果没有工作空间，重定向到 onboarding 页面
          router.replace(`/${params.locale}/onboarding`);
        }
      } catch (err) {
        console.error('Error fetching workspaces:', err);
        setError('Failed to load workspace data');
        setIsLoading(false);
      }
    }
    
    redirectToWorkspace();
  }, [router, params.locale]);
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Typography variant="h5" className="mb-2 text-red-500">
          {error}
        </Typography>
        <Typography>
          Please try again or contact support if the problem persists.
        </Typography>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <Spinner className="h-12 w-12" color="blue" />
      <Typography className="mt-4">
        Loading your workspace...
      </Typography>
    </div>
  );
}
