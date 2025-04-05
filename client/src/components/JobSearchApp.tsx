import { useState } from "react";
import { UploadStep } from "./UploadStep";
import { SearchStep } from "./SearchStep";
import { LoadingStep } from "./LoadingStep";
import { ResultsStep } from "./ResultsStep";
import { JobSearchState, UploadedFile, CurrentStep } from "@/types";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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

  const handleContinue = () => {
    if (state.resume) {
      setState({
        ...state,
        currentStep: "search",
      });
    }
  };

  const handleGoBack = () => {
    setState({
      ...state,
      currentStep: "upload",
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
        currentStep: "search",
        isSearching: false,
        error: "Failed to search for jobs",
      });
    }
  };

  const handleSearchAgain = () => {
    setState({
      ...state,
      currentStep: "search",
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#333333] sm:text-4xl">Find Your Perfect Job</h1>
        <p className="mt-3 text-lg text-[#86888A]">
          Upload your resume and let LinkedIn MCP find the best opportunities for you
        </p>
      </div>

      <div className="flex flex-col space-y-6">
        {state.currentStep === "upload" && (
          <UploadStep
            resume={state.resume}
            onUpload={handleResumeUpload}
            onRemove={handleRemoveResume}
            onContinue={handleContinue}
          />
        )}

        {state.currentStep === "search" && (
          <SearchStep
            jobTitle={state.jobTitle}
            location={state.location}
            onUpdatePreferences={updateJobPreferences}
            onStartSearch={handleStartSearch}
            onGoBack={handleGoBack}
          />
        )}

        {state.currentStep === "loading" && <LoadingStep />}

        {state.currentStep === "results" && (
          <ResultsStep jobs={state.jobs} onSearchAgain={handleSearchAgain} />
        )}
      </div>
    </div>
  );
}
