import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import JobCard from "./JobCard";
import { Job } from "@shared/schema";
import { useState } from "react";

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
    <Card className="bg-white rounded-lg shadow-md">
      <CardContent className="p-6 md:p-8">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#0077B5] flex items-center justify-center text-white">
              3
            </div>
            <h2 className="ml-3 text-xl font-semibold text-[#333333]">
              Job opportunities for you
            </h2>
          </div>
          <p className="text-[#86888A] ml-11">
            Based on your resume, we found these matching opportunities.
          </p>
        </div>

        <div className="space-y-4 mt-6">
          {jobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#86888A]">No job matches found. Try adjusting your search criteria.</p>
            </div>
          ) : (
            jobs.slice(0, visibleJobs).map((job) => <JobCard key={job.id} job={job} />)
          )}
        </div>

        {jobs.length > visibleJobs && (
          <div className="mt-8 flex justify-center">
            <Button 
              variant="outline" 
              className="border border-[#0077B5] text-[#0077B5] rounded-full px-6 py-2 font-medium hover:bg-blue-50"
              onClick={handleLoadMore}
            >
              Show More Results
            </Button>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Button 
            className="bg-[#0077B5] text-white rounded-full px-6 py-2 font-medium hover:bg-blue-700"
            onClick={onSearchAgain}
          >
            Refine Search
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
