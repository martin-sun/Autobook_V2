"use client";

import { useState } from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { ProgressStepper } from "@/components/onboarding/ProgressStepper";
import { WelcomeStep } from "@/components/onboarding/WelcomeStep";
import { BusinessInfoStep } from "@/components/onboarding/BusinessInfoStep";
import { AccountingSetupStep } from "@/components/onboarding/AccountingSetupStep";
import { CompletionStep } from "@/components/onboarding/CompletionStep";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    registrationNumber: "",
    taxId: "",
    industry: "",
    fiscalYearStartMonth: "01", // January
    fiscalYearEndMonth: "12",   // December
    fiscalYearEndDay: "31",     // 31st
    currency: "CAD",
    chartTemplate: "standard"
  });
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const steps = [
    {
      title: "Welcome to AutoBooks",
      description: "Get started with your accounting system",
      component: <WelcomeStep />
    },
    {
      title: "Business Information", 
      description: "Set up your business profile",
      component: <BusinessInfoStep 
        formData={formData}
        setFormData={setFormData}
      />
    },
    {
      title: "Accounting Setup",
      description: "Configure your accounting preferences",
      component: <AccountingSetupStep 
        formData={formData}
        setFormData={setFormData}
      />
    },
    {
      title: "Ready to Go",
      description: "Your workspace is ready",
      component: <CompletionStep />
    }
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        // Create new workspace
        const { data, error } = await supabase.rpc('create_workspace', {
          p_name: formData.businessName,
          p_type: 'business',
          p_currency: formData.currency
        });
        
        if (error) throw error;
        
        // Initialize workspace with accounting settings
        if (data) {
          const workspaceId = data;
          
          // Update workspace settings with fiscal year preferences
          await supabase.from('workspaces').update({
            fiscal_year_start_month: formData.fiscalYearStartMonth,
            default_fiscal_year_end: `${formData.fiscalYearEndMonth}-${formData.fiscalYearEndDay}`
          }).eq('id', workspaceId);
          
          // Redirect to dashboard
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error creating workspace:', error);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left sidebar */}
      <div className="hidden lg:block w-72 bg-white shadow-xl h-screen fixed">
        <div className="p-6">
          <Typography variant="h5" className="mb-6">AutoBooks Setup</Typography>
          <ProgressStepper activeStep={currentStep} />
          
          <div className="mt-8 space-y-4">
            {steps.map((step, idx) => (
              <div key={idx} className={`py-2 pl-4 border-l-2 ${currentStep === idx ? 'border-blue-500 text-blue-500' : 'border-gray-200 text-gray-500'}`}>
                <Typography variant="small" className="font-medium">
                  {step.title}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 lg:ml-72 p-6">
        <Card className="max-w-3xl mx-auto mt-8">
          <CardBody className="p-8">
            <Typography variant="h3" className="mb-2">
              {steps[currentStep].title}
            </Typography>
            <Typography variant="paragraph" color="blue-gray" className="mb-8">
              {steps[currentStep].description}
            </Typography>
            
            {steps[currentStep].component}
            
            <div className="flex justify-between mt-10 pt-6 border-t">
              <Button 
                variant="outlined" 
                onClick={handlePrevious} 
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button 
                onClick={handleNext}
              >
                {currentStep === steps.length - 1 ? "Finish Setup" : "Next Step"}
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
