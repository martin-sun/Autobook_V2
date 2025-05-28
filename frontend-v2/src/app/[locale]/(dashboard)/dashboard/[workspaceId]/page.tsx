"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import FinancialSummaryCards from '@/components/dashboard/FinancialSummaryCards';
import BankAccountsOverview from '@/components/dashboard/BankAccountsOverview';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import UpcomingTasks from '@/components/dashboard/UpcomingTasks';
import ChartOfAccountsSummary from '@/components/dashboard/ChartOfAccountsSummary';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Typography, Spinner } from '@material-tailwind/react';

export default function WorkspaceDashboard() {
  const t = useTranslations();
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  
  const [workspace, setWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchWorkspaceData() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('workspaces')
          .select('*')
          .eq('id', workspaceId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setWorkspace(data);
        } else {
          setError('Workspace not found');
        }
      } catch (err) {
        console.error('Error fetching workspace:', err);
        setError('Failed to load workspace data');
      } finally {
        setLoading(false);
      }
    }
    
    if (workspaceId) {
      fetchWorkspaceData();
    }
  }, [workspaceId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-12 w-12" color="blue" />
      </div>
    );
  }
  
  if (error || !workspace) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200 text-center">
        <Typography variant="h5" className="mb-2 text-red-500">
          {error || 'Workspace not found'}
        </Typography>
        <Typography>
          Please check the workspace ID or contact support if the problem persists.
        </Typography>
      </div>
    );
  }
  
  // 获取当前财政年度
  const currentYear = new Date().getFullYear();
  
  return (
    <div>
      <DashboardHeader 
        title={workspace.name} 
        fiscalYear={currentYear.toString()} 
        workspaceType={workspace.type}
      />
      
      {/* Financial Summary Cards */}
      <FinancialSummaryCards workspaceId={workspaceId} />
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width on large screens */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bank Accounts Overview */}
          <BankAccountsOverview workspaceId={workspaceId} />
          
          {/* Recent Transactions */}
          <RecentTransactions workspaceId={workspaceId} />
        </div>
        
        {/* Right Column - 1/3 width on large screens */}
        <div className="space-y-6">
          {/* Upcoming Tasks */}
          <UpcomingTasks workspaceId={workspaceId} />
          
          {/* Chart of Accounts Summary */}
          <ChartOfAccountsSummary workspaceId={workspaceId} />
        </div>
      </div>
    </div>
  );
}
