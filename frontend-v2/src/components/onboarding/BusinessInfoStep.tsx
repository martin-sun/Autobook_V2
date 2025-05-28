import { Input, Select, Option, Typography } from "@material-tailwind/react";

type BusinessInfoProps = {
  formData: {
    businessName: string;
    businessType: string;
    registrationNumber: string;
    taxId: string;
    industry: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
};

export function BusinessInfoStep({ formData, setFormData }: BusinessInfoProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <Typography variant="h6" color="blue-gray" className="mb-1">
        Business Details
      </Typography>
      
      <Input 
        label="Legal Business Name" 
        name="businessName"
        value={formData.businessName}
        onChange={handleChange}
        size="lg"
        className="!border-t-blue-gray-200 focus:!border-t-blue-500"
        labelProps={{
          className: "before:content-none after:content-none",
        }}
        crossOrigin="anonymous"
      />
      
      <div className="w-full">
        <Select
          label="Business Type"
          value={formData.businessType}
          onChange={(val) => handleSelectChange("businessType", val)}
          className="!border-t-blue-gray-200 focus:!border-t-blue-500"
        >
          <Option value="corporation">Corporation</Option>
          <Option value="sole-proprietorship">Sole Proprietorship</Option>
          <Option value="partnership">Partnership</Option>
          <Option value="llc">LLC</Option>
          <Option value="nonprofit">Non-profit Organization</Option>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Business Registration Number"
          name="registrationNumber"
          value={formData.registrationNumber}
          onChange={handleChange}
          size="lg"
          className="!border-t-blue-gray-200 focus:!border-t-blue-500"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
          crossOrigin="anonymous"
        />
        <Input
          label="Tax ID (GST/HST)"
          name="taxId"
          value={formData.taxId}
          onChange={handleChange}
          size="lg"
          className="!border-t-blue-gray-200 focus:!border-t-blue-500"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
          crossOrigin="anonymous"
        />
      </div>

      <div className="w-full">
        <Select
          label="Primary Business Activity"
          value={formData.industry}
          onChange={(val) => handleSelectChange("industry", val)}
          className="!border-t-blue-gray-200 focus:!border-t-blue-500"
        >
          <Option value="retail">Retail</Option>
          <Option value="professional-services">Professional Services</Option>
          <Option value="manufacturing">Manufacturing</Option>
          <Option value="construction">Construction</Option>
          <Option value="hospitality">Hospitality</Option>
          <Option value="technology">Technology</Option>
          <Option value="healthcare">Healthcare</Option>
          <Option value="real-estate">Real Estate</Option>
          <Option value="other">Other</Option>
        </Select>
      </div>
    </div>
  );
}
