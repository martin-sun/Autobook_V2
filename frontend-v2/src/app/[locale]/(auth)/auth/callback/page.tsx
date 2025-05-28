"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase-client";

// 处理 Supabase 认证回调
export default function AuthCallback() {
  const router = useRouter();
  const params = useParams();
  const [status, setStatus] = useState("Authenticating...");

  useEffect(() => {
    // 处理认证回调
    const handleAuthCallback = async () => {
      try {
        // 1. 验证会话
        const { error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Error during auth callback:", sessionError);
          router.push(`/${params.locale}/auth/signin`);
          return;
        }

        setStatus("Checking workspaces...");

        // 2. 检查用户是否有工作空间
        try {
          const { data: workspaces, error: workspacesError } = await supabase.rpc('get_user_workspaces');
          
          if (workspacesError) {
            console.error('Error fetching workspaces:', workspacesError);
            // 如果获取工作空间出错，我们假设用户没有工作空间，重定向到向导页面
            setStatus("Error checking workspaces, redirecting to setup...");
            router.push(`/${params.locale}/onboarding`);
            return;
          }
          
          // 检查工作空间是否存在且有效
          if (!workspaces || workspaces.length === 0) {
            // 用户没有工作空间，重定向到向导页面
            setStatus("No workspaces found, redirecting to setup...");
            router.push(`/${params.locale}/onboarding`);
            return;
          }
          
          // 用户有工作空间，重定向到仪表盘
          setStatus("Workspaces found, redirecting to dashboard...");
          router.push(`/${params.locale}/dashboard`);
        } catch (workspaceError) {
          console.error('Unexpected error checking workspaces:', workspaceError);
          // 如果发生意外错误，重定向到向导页面
          setStatus("Error checking workspaces, redirecting to setup...");
          router.push(`/${params.locale}/onboarding`);
        }

        // 注意：工作空间检查逻辑已经在上面的try块中实现
      } catch (error) {
        console.error("Unexpected error during auth callback:", error);
        router.push(`/${params.locale}/auth/signin`);
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{status}</p>
      </div>
    </div>
  );
}
