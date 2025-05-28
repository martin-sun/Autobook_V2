import { Select, Option, Typography, Radio } from "@material-tailwind/react";

type AccountingSetupProps = {
  formData: {
    fiscalYearStartMonth: string;
    fiscalYearEndMonth: string;
    fiscalYearEndDay: string;
    currency: string;
    chartTemplate: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
};

export function AccountingSetupStep({ formData, setFormData }: AccountingSetupProps) {
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <Typography variant="h6" color="blue-gray" className="mb-4">
          Fiscal Year Settings
        </Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Typography variant="small" className="mb-2 font-medium">Fiscal Year Start</Typography>
            <Select
              value={formData.fiscalYearStartMonth}
              onChange={(val) => handleSelectChange("fiscalYearStartMonth", val)}
              className="!border-t-blue-gray-200 focus:!border-t-blue-500"
            >
              {months.map((month) => (
                <Option key={month.value} value={month.value}>{month.label}</Option>
              ))}
            </Select>
          </div>
          
          <div>
            <Typography variant="small" className="mb-2 font-medium">Fiscal Year End</Typography>
            <Select
              value={formData.fiscalYearEndMonth}
              onChange={(val) => handleSelectChange("fiscalYearEndMonth", val)}
              className="!border-t-blue-gray-200 focus:!border-t-blue-500"
            >
              {months.map((month) => (
                <Option key={month.value} value={month.value}>{month.label}</Option>
              ))}
            </Select>
          </div>
        </div>
      </div>
      
      <div>
        <Typography variant="h6" color="blue-gray" className="mb-4">
          Currency
        </Typography>
        
        <Select
          value={formData.currency}
          onChange={(val) => handleSelectChange("currency", val)}
          className="!border-t-blue-gray-200 focus:!border-t-blue-500"
        >
          <Option value="CAD">Canadian Dollar (CAD)</Option>
          <Option value="USD">US Dollar (USD)</Option>
          <Option value="EUR">Euro (EUR)</Option>
          <Option value="GBP">British Pound (GBP)</Option>
          <Option value="CNY">Chinese Yuan (CNY)</Option>
        </Select>
      </div>
      
      <div>
        <Typography variant="h6" color="blue-gray" className="mb-4">
          Chart of Accounts Template
        </Typography>
        
        <div className="grid grid-cols-1 gap-4">
          <Radio
            name="chartTemplate"
            label={
              <div>
                <Typography variant="h6" color="blue-gray">
                  Standard
                </Typography>
                <Typography variant="small" color="gray" className="font-normal">
                  Common for most businesses with standard categories for assets, liabilities, equity, income and expenses
                </Typography>
              </div>
            }
            checked={formData.chartTemplate === "standard"}
            onChange={() => handleSelectChange("chartTemplate", "standard")}
          />
          
          <Radio
            name="chartTemplate"
            label={
              <div>
                <Typography variant="h6" color="blue-gray">
                  Professional Services
                </Typography>
                <Typography variant="small" color="gray" className="font-normal">
                  Optimized for service-based businesses such as consulting, legal, or accounting firms
                </Typography>
              </div>
            }
            checked={formData.chartTemplate === "services"}
            onChange={() => handleSelectChange("chartTemplate", "services")}
          />
          
          <Radio
            name="chartTemplate"
            label={
              <div>
                <Typography variant="h6" color="blue-gray">
                  Retail Business
                </Typography>
                <Typography variant="small" color="gray" className="font-normal">
                  Focused on inventory, sales, and cost of goods sold for retail operations
                </Typography>
              </div>
            }
            checked={formData.chartTemplate === "retail"}
            onChange={() => handleSelectChange("chartTemplate", "retail")}
          />
        </div>
      </div>
    </div>
  );
}
