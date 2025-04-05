import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, ArrowLeft } from "lucide-react";

interface SearchStepProps {
  jobTitle: string;
  location: string;
  onUpdatePreferences: (jobTitle: string, location: string) => void;
  onStartSearch: () => void;
  onGoBack: () => void;
}

export function SearchStep({
  jobTitle,
  location,
  onUpdatePreferences,
  onStartSearch,
  onGoBack,
}: SearchStepProps) {
  const [localJobTitle, setLocalJobTitle] = useState(jobTitle);
  const [localLocation, setLocalLocation] = useState(location);

  const handleJobTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalJobTitle(e.target.value);
    onUpdatePreferences(e.target.value, localLocation);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalLocation(e.target.value);
    onUpdatePreferences(localJobTitle, e.target.value);
  };

  return (
    <Card className="bg-white rounded-lg shadow-md">
      <CardContent className="p-6 md:p-8">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#0077B5] flex items-center justify-center text-white">
              2
            </div>
            <h2 className="ml-3 text-xl font-semibold text-[#333333]">Search for jobs</h2>
          </div>
          <p className="text-[#86888A] ml-11">
            We'll use your resume to find the most relevant job opportunities.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="job-title" className="text-[#333333]">
                  Desired Job Title (Optional)
                </Label>
                <Input
                  type="text"
                  id="job-title"
                  className="mt-1"
                  placeholder="e.g. Software Engineer"
                  value={localJobTitle}
                  onChange={handleJobTitleChange}
                />
              </div>
              <div>
                <Label htmlFor="location" className="text-[#333333]">
                  Location (Optional)
                </Label>
                <Input
                  type="text"
                  id="location"
                  className="mt-1"
                  placeholder="e.g. New York, NY"
                  value={localLocation}
                  onChange={handleLocationChange}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              className="bg-[#0077B5] hover:bg-blue-700 rounded-full px-10 py-6 font-medium w-full md:w-auto"
              onClick={onStartSearch}
            >
              <Search className="mr-2 h-5 w-5" />
              Find Jobs
            </Button>
          </div>
        </div>

        <div className="mt-6 flex justify-start">
          <Button
            variant="ghost"
            className="text-[#86888A] hover:text-[#333333] px-4 py-2 text-sm font-medium flex items-center"
            onClick={onGoBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Upload
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
