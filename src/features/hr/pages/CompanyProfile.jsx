import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Upload, Building2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CompanyProfile() {
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-heading font-bold tracking-tight text-primary">Company Profile</h2>
        <Link to="/company/public">
          <Button variant="outline" className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            View Public Profile
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Logo Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-slate-100">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 shadow-sm">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Company Logo Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-10 h-10 text-slate-300" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-heading font-semibold text-primary">Company Logo</h3>
                <p className="text-sm font-body text-slate-500 mb-3">
                  Upload your corporate logo. JPG, GIF, or PNG.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoChange}
                  accept="image/*"
                  className="hidden"
                />
                <Button type="button" variant="outline" size="sm" onClick={triggerFileInput}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="company_name" className="text-sm font-medium leading-none">
                Company Name
              </label>
              <Input
                id="company_name"
                placeholder="Enter your company name"
                defaultValue="TechNova Inc."
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="industry" className="text-sm font-medium leading-none">
                Industry
              </label>
              <Input
                id="industry"
                placeholder="e.g. Technology, Healthcare"
                defaultValue="Technology"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="website" className="text-sm font-medium leading-none">
                Website
              </label>
              <Input
                id="website"
                type="url"
                placeholder="https://example.com"
                defaultValue="https://technova.example.com"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium leading-none">
                Description
              </label>
              <Textarea
                id="description"
                placeholder="Write a short description about your company"
                className="min-h-[120px]"
                defaultValue="Leading innovator in sustainable tech solutions."
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
