import { Typography, Card, CardBody } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faBuilding, faClipboardList } from "@fortawesome/free-solid-svg-icons";

export function WelcomeStep() {
  return (
    <div className="space-y-8">
      <Typography variant="lead" className="text-center">
        Let's set up your first business workspace for efficient bookkeeping and tax reporting
      </Typography>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <FeatureCard 
          icon={faBuilding}
          title="Business Profile"
          description="Configure your business details for accounting and tax purposes"
        />
        <FeatureCard 
          icon={faClipboardList}
          title="Chart of Accounts"
          description="Set up your accounting framework with industry-standard templates"
        />
        <FeatureCard 
          icon={faChartLine}
          title="Financial Reports"
          description="Get ready for professional financial reporting and tax filing"
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="hover:shadow-md transition-all">
      <CardBody className="p-6">
        <FontAwesomeIcon icon={icon} className="h-8 w-8 text-blue-500 mb-4" />
        <Typography variant="h6" className="mb-2">{title}</Typography>
        <Typography variant="small" color="gray">{description}</Typography>
      </CardBody>
    </Card>
  );
}
