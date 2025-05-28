// @ts-nocheck - Ignoring type errors for Material Tailwind components
import { Typography } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export function CompletionStep() {
  return (
    <div className="text-center px-4 py-8">
      <div className="flex justify-center mb-6">
        <FontAwesomeIcon 
          icon={faCheckCircle} 
          className="h-24 w-24 text-green-500"
        />
      </div>
      
      <Typography variant="h4" className="mb-4" crossOrigin="anonymous">
        Setup Complete!
      </Typography>
      
      <Typography variant="paragraph" className="mb-6 text-gray-600 max-w-md mx-auto" crossOrigin="anonymous">
        Your business workspace is ready. You'll now be directed to your dashboard where you can start managing your finances.
      </Typography>
      
      <div className="space-y-4 mt-8 border-t pt-8 text-left max-w-md mx-auto">
        <Typography variant="h6" crossOrigin="anonymous">
          What's next?
        </Typography>
        
        <div className="flex items-start space-x-3">
          <div className="bg-blue-500 text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold">1</span>
          </div>
          <div>
            <Typography variant="small" className="font-semibold" crossOrigin="anonymous">
              Set up your Chart of Accounts
            </Typography>
            <Typography variant="small" className="text-gray-600" crossOrigin="anonymous">
              Review and customize your chart of accounts to match your business needs
            </Typography>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="bg-blue-500 text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold">2</span>
          </div>
          <div>
            <Typography variant="small" className="font-semibold" crossOrigin="anonymous">
              Connect your banking accounts
            </Typography>
            <Typography variant="small" className="text-gray-600" crossOrigin="anonymous">
              Link your bank accounts or import transactions to start tracking your finances
            </Typography>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="bg-blue-500 text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold">3</span>
          </div>
          <div>
            <Typography variant="small" className="font-semibold" crossOrigin="anonymous">
              Create your first transaction
            </Typography>
            <Typography variant="small" className="text-gray-600" crossOrigin="anonymous">
              Record income and expenses to start building your financial records
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
