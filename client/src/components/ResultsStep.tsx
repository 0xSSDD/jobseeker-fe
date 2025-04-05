import { Button } from "@/components/ui/button";
import JobCard from "./JobCard";
import { Job } from "@shared/schema";
import { useState } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";

interface ResultsStepProps {
  jobs: Job[];
  onSearchAgain: () => void;
}

export function ResultsStep({ jobs, onSearchAgain }: ResultsStepProps) {
  const [visibleJobs, setVisibleJobs] = useState(5);

  const handleLoadMore = () => {
    setVisibleJobs((prev) => prev + 5);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Your Custom Cover Letters
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
          onClick={onSearchAgain}
        >
          <ArrowLeft className="h-4 w-4" />
          New Search
        </Button>
      </div>
      
      <p className="text-gray-600">
        We found {jobs.length} job{jobs.length === 1 ? "" : "s"} matching your profile. Each job has a personalized cover letter ready to download or send.
      </p>

      {jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.slice(0, visibleJobs).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
          
          {jobs.length > visibleJobs && (
            <div className="flex justify-center mt-6">
              <Button 
                variant="outline"
                className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 flex items-center gap-2"
                onClick={handleLoadMore}
              >
                <RefreshCw className="h-4 w-4" />
                Load More Results
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-6 text-center">
          <p className="text-yellow-800 mb-3">No job matches found</p>
          <p className="text-yellow-700 text-sm">Try changing your job title or location for better results</p>
          <Button
            className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white"
            onClick={onSearchAgain}
          >
            Try A Different Search
          </Button>
        </div>
      )}
    </div>
  );
}
