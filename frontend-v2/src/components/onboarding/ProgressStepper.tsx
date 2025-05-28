import { Stepper, Step } from "@material-tailwind/react";

export function ProgressStepper({ activeStep }: { activeStep: number }) {
  return (
    <Stepper 
      activeStep={activeStep}
      lineClassName="bg-gray-200"
      activeLineClassName="bg-blue-500"
    >
      <Step 
        className={activeStep >= 0 ? "bg-blue-500 text-white" : "bg-gray-200"} 
        activeClassName="bg-blue-500 text-white"
        completedClassName="bg-blue-500 text-white"
      >
        <span className="absolute -bottom-[2rem] w-max text-center text-xs">
          <span className={`font-semibold ${activeStep >= 0 ? "text-blue-500" : "text-gray-500"}`}>
            Welcome
          </span>
        </span>
      </Step>
      <Step 
        className={activeStep >= 1 ? "bg-blue-500 text-white" : "bg-gray-200"} 
        activeClassName="bg-blue-500 text-white"
        completedClassName="bg-blue-500 text-white"
      >
        <span className="absolute -bottom-[2rem] w-max text-center text-xs">
          <span className={`font-semibold ${activeStep >= 1 ? "text-blue-500" : "text-gray-500"}`}>
            Business Info
          </span>
        </span>
      </Step>
      <Step 
        className={activeStep >= 2 ? "bg-blue-500 text-white" : "bg-gray-200"} 
        activeClassName="bg-blue-500 text-white"
        completedClassName="bg-blue-500 text-white"
      >
        <span className="absolute -bottom-[2rem] w-max text-center text-xs">
          <span className={`font-semibold ${activeStep >= 2 ? "text-blue-500" : "text-gray-500"}`}>
            Accounting Setup
          </span>
        </span>
      </Step>
      <Step 
        className={activeStep >= 3 ? "bg-blue-500 text-white" : "bg-gray-200"} 
        activeClassName="bg-blue-500 text-white"
        completedClassName="bg-blue-500 text-white"
      >
        <span className="absolute -bottom-[2rem] w-max text-center text-xs">
          <span className={`font-semibold ${activeStep >= 3 ? "text-blue-500" : "text-gray-500"}`}>
            Complete
          </span>
        </span>
      </Step>
    </Stepper>
  );
}
