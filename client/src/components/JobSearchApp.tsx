import { useState } from "react";
import { UploadStep } from "./UploadStep";
import { LoadingStep } from "./LoadingStep";
import { ResultsStep } from "./ResultsStep";
import { JobSearchState, UploadedFile, CurrentStep } from "@/types";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Upload } from "lucide-react";

export default function JobSearchApp() {
  const { toast } = useToast();
  const [state, setState] = useState<JobSearchState>({
    currentStep: "upload",
    resume: null,
    jobTitle: "",
    location: "",
    jobs: [],
    isSearching: false,
    error: null,
  });

  const handleResumeUpload = (resume: UploadedFile) => {
    setState({
      ...state,
      resume,
    });
  };

  const handleRemoveResume = () => {
    setState({
      ...state,
      resume: null,
    });
  };

  const updateJobPreferences = (jobTitle: string, location: string) => {
    setState({
      ...state,
      jobTitle,
      location,
    });
  };

  const handleStartSearch = async () => {
    setState({
      ...state,
      currentStep: "loading",
      isSearching: true,
    });

    try {
      const response = await queryClient.fetchQuery({
        queryKey: ["/api/jobs/search"],
        queryFn: async () => {
          const res = await fetch("/api/jobs/search", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jobTitle: state.jobTitle,
              location: state.location,
            }),
          });
          
          if (!res.ok) {
            throw new Error("Failed to search for jobs");
          }
          
          return res.json();
        },
      });

      setState({
        ...state,
        currentStep: "results",
        isSearching: false,
        jobs: response.jobs,
      });
    } catch (error) {
      console.error("Error searching for jobs:", error);
      toast({
        title: "Error",
        description: "Failed to search for jobs. Please try again.",
        variant: "destructive",
      });
      
      setState({
        ...state,
        currentStep: "upload",
        isSearching: false,
        error: "Failed to search for jobs",
      });
    }
  };

  const resetToUpload = () => {
    setState({
      ...state,
      currentStep: "upload",
    });
  };

  // Simple job search form for the first screen
  const renderJobSearchForm = () => {
    return (
      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="job-title" className="text-gray-700">
              Desired Job Title
            </Label>
            <Input
              type="text"
              id="job-title"
              className="mt-1"
              placeholder="e.g. Software Engineer"
              value={state.jobTitle}
              onChange={(e) => updateJobPreferences(e.target.value, state.location)}
            />
          </div>
          <div>
            <Label htmlFor="location" className="text-gray-700">
              Location (Optional)
            </Label>
            <Input
              type="text"
              id="location"
              className="mt-1"
              placeholder="e.g. New York, NY"
              value={state.location}
              onChange={(e) => updateJobPreferences(state.jobTitle, e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-10 py-2 font-medium"
            onClick={handleStartSearch}
            disabled={!state.resume || !state.jobTitle}
          >
            <Search className="mr-2 h-5 w-5" />
            Generate Cover Letters
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-md">
        <CardContent className="p-6">
          {state.currentStep === "upload" && (
            <>
              <div className="flex flex-col gap-6">
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                  <h2 className="font-medium text-indigo-800 flex items-center gap-2">
                    <Upload size={18} />
                    How it works
                  </h2>
                  <ol className="mt-2 text-sm text-gray-600 space-y-1 list-decimal pl-5">
                    <li>Upload your resume (PDF, DOCX, DOC, or TXT)</li>
                    <li>Enter job title and location you're interested in</li>
                    <li>Get custom cover letters for each job listing</li>
                    <li>Download or send them directly via email</li>
                  </ol>
                </div>
                
                <UploadStep
                  resume={state.resume}
                  onUpload={handleResumeUpload}
                  onRemove={handleRemoveResume}
                  onContinue={() => {}}
                />
                
                {state.resume && renderJobSearchForm()}
              </div>
            </>
          )}

          {state.currentStep === "loading" && <LoadingStep />}

          {state.currentStep === "results" && (
            <ResultsStep jobs={state.jobs} onSearchAgain={resetToUpload} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
