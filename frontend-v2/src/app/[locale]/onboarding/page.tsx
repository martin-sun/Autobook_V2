"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Card, CardBody, Typography, Button, Alert } from "@material-tailwind/react";
import { ProgressStepper } from "@/components/onboarding/ProgressStepper";
import { WelcomeStep } from "@/components/onboarding/WelcomeStep";
import { BusinessInfoStep } from "@/components/onboarding/BusinessInfoStep";
import { AccountingSetupStep } from "@/components/onboarding/AccountingSetupStep";
import { CompletionStep } from "@/components/onboarding/CompletionStep";
import { useRouter, useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft, faCheckCircle, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    registrationNumber: "",
    taxId: "",
    industry: "",
    fiscalYearStartMonth: "01", // January
    fiscalYearEndMonth: "12", // December
    fiscalYearEndDay: "31", // 31st
    currency: "CAD",
    chartTemplate: "standard",
  });
  const router = useRouter();
  const params = useParams();

  const steps = [
    {
      title: "Welcome to AutoBooks",
      description: "Get started with your accounting system",
      component: <WelcomeStep />,
    },
    {
      title: "Business Information",
      description: "Set up your business profile",
      component: (
        <BusinessInfoStep formData={formData} setFormData={setFormData} />
      ),
    },
    {
      title: "Accounting Setup",
      description: "Configure your accounting preferences",
      component: (
        <AccountingSetupStep formData={formData} setFormData={setFormData} />
      ),
    },
    {
      title: "Ready to Go",
      description: "Your workspace is ready",
      component: <CompletionStep />,
    },
  ];

  // 验证表单数据
  const validateForm = (step: number) => {
    setError(null);
    
    if (step === 1) { // Business Information step
      if (!formData.businessName) {
        setError("Business name is required");
        return false;
      }
      if (!formData.businessType) {
        setError("Please select a business type");
        return false;
      }
    }
    
    return true;
  };

  const handleNext = async () => {
    // 如果不是最后一步，验证当前步骤并前进
    if (currentStep < steps.length - 1) {
      if (validateForm(currentStep)) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      // 最后一步，创建工作空间
      try {
        setIsLoading(true);
        setError(null);
        
        // 创建新工作空间
        const { data, error: createError } = await supabase.rpc("create_workspace", {
          p_name: formData.businessName,
          p_type: "business",
          p_currency: formData.currency,
        });

        if (createError) throw createError;

        // 初始化工作空间会计设置
        if (data) {
          const workspaceId = data;

          // 更新工作空间的财政年度设置
          const { error: updateError } = await supabase
            .from("workspaces")
            .update({
              fiscal_year_start_month: parseInt(formData.fiscalYearStartMonth),
              default_fiscal_year_end: `${formData.fiscalYearEndMonth}-${formData.fiscalYearEndDay}`,
            })
            .eq("id", workspaceId);
            
          if (updateError) throw updateError;

          // 重定向到包含工作空间ID的仪表盘
          router.push(`/${params.locale}/dashboard/${workspaceId}`);
        } else {
          throw new Error("Failed to create workspace");
        }
      } catch (err) {
        console.error("Error creating workspace:", err);
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header with logo */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-primary">AutoBooks</div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left sidebar - Progress tracker */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
            <Typography variant="h5" className="mb-6 font-bold text-gray-800">Setup Progress</Typography>
            <ProgressStepper activeStep={currentStep} />
            
            <div className="mt-8 space-y-4">
              {steps.map((step, idx) => (
                <div 
                  key={idx} 
                  className={`py-2 pl-4 border-l-2 transition-all ${currentStep === idx 
                    ? 'border-primary text-primary font-medium' 
                    : idx < currentStep 
                      ? 'border-green-500 text-green-600' 
                      : 'border-gray-200 text-gray-500'}`}
                >
                  <div className="flex items-center">
                    {idx < currentStep && (
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2 text-sm" />
                    )}
                    <Typography variant="small" className="font-medium">
                      {step.title}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          <Card className="overflow-hidden border-0 shadow-lg rounded-xl bg-white">
            {/* Progress bar at the top */}
            <div className="w-full h-1 bg-gray-100">
              <div 
                className="h-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-500" 
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
            
            <CardBody className="p-8">
              <div className="mb-8">
                <Typography variant="h3" className="text-3xl font-bold text-gray-800 mb-2">
                  {steps[currentStep].title}
                </Typography>
                <Typography variant="paragraph" color="blue-gray" className="text-gray-600">
                  {steps[currentStep].description}
                </Typography>
              </div>
              
              {error && (
                <Alert 
                  color="red" 
                  className="mb-6 bg-red-50 text-red-800 border border-red-200"
                  icon={<FontAwesomeIcon icon={faExclamationTriangle} className="h-6 w-6" />}
                >
                  {error}
                </Alert>
              )}
              
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                {steps[currentStep].component}
              </div>
              
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                <Button 
                  variant="outlined" 
                  onClick={handlePrevious} 
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg border-gray-300 text-gray-700 hover:border-primary hover:text-primary transition disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
                  Previous
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white hover:bg-blue-600 transition shadow-md hover:shadow-lg disabled:opacity-70 disabled:bg-blue-400"
                >
                  {isLoading ? "Processing..." : currentStep === steps.length - 1 ? "Finish Setup" : "Next Step"}
                  {!isLoading && <FontAwesomeIcon icon={faArrowRight} className="text-sm" />}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
