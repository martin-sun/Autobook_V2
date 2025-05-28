"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { ProgressStepper } from "@/components/onboarding/ProgressStepper";
import { WelcomeStep } from "@/components/onboarding/WelcomeStep";
import { BusinessInfoStep } from "@/components/onboarding/BusinessInfoStep";
import { AccountingSetupStep } from "@/components/onboarding/AccountingSetupStep";
import { CompletionStep } from "@/components/onboarding/CompletionStep";
import { useRouter, useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
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

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        // Create new workspace
        const { data, error } = await supabase.rpc("create_workspace", {
          p_name: formData.businessName,
          p_type: "business",
          p_currency: formData.currency,
        });

        if (error) throw error;

        // Initialize workspace with accounting settings
        if (data) {
          const workspaceId = data;

          // Update workspace settings with fiscal year preferences
          await supabase
            .from("workspaces")
            .update({
              fiscal_year_start_month: formData.fiscalYearStartMonth,
              default_fiscal_year_end: `${formData.fiscalYearEndMonth}-${formData.fiscalYearEndDay}`,
            })
            .eq("id", workspaceId);

          // Redirect to dashboard
          router.push(`/${params.locale}/dashboard`);
        }
      } catch (error) {
        console.error("Error creating workspace:", error);
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
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white hover:bg-blue-600 transition shadow-md hover:shadow-lg"
                >
                  {currentStep === steps.length - 1 ? "Finish Setup" : "Next Step"}
                  <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
