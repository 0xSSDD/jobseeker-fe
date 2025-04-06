import { useState } from 'react';
import { FiSearch, FiBriefcase, FiChevronRight } from 'react-icons/fi';
import { JobCard } from './JobCard';

interface Job {
  id: string;
  resume_id: string | null;
  title: string;
  company: string;
  location: string | null;
  description: string;
  requirements: string[] | null;
  url: string;
  source: string;
  posted_date: string | null;
  salary: string | null;
  hiring_manager_name: string | null;
  hiring_manager_email: string | null;
  hiring_manager_title: string | null;
  processed: boolean;
  created_at: string;
  updated_at: string;
}

interface ResultsComponentProps {
  jobs: Job[];
  onSearchAgain: () => void;
  onGenerateCoverLetter: (jobId: string) => void;
  isGeneratingCoverLetter: boolean;
  coverLetters?: Record<string, string>; // Map of job IDs to cover letter URLs
}

export function ResultsComponent({ 
  jobs, 
  onSearchAgain, 
  onGenerateCoverLetter,
  isGeneratingCoverLetter,
  coverLetters = {}
}: ResultsComponentProps) {
  const [generatingJobId, setGeneratingJobId] = useState<string | null>(null);
  
  const handleGenerateCoverLetter = (jobId: string) => {
    setGeneratingJobId(jobId);
    onGenerateCoverLetter(jobId);
  };
  
  return (
    <div className="w-full mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">
          {jobs.length > 0 
            ? `Found ${jobs.length} Matching Jobs` 
            : 'No Jobs Found'}
        </h2>
        <p className="text-gray-600">
          {jobs.length > 0 
            ? 'Here are the jobs that match your skills and preferences.' 
            : 'Try adjusting your search criteria or uploading a different resume.'}
        </p>
      </div>
      
      {jobs.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map(job => (
              <JobCard 
                key={job.id}
                job={job}
                onGenerateCoverLetter={handleGenerateCoverLetter}
                isGenerating={isGeneratingCoverLetter && generatingJobId === job.id}
                coverLetterUrl={coverLetters[job.id] || null}
              />
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <button
              onClick={onSearchAgain}
              className="inline-flex items-center px-4 py-2 border border-primary text-base font-medium rounded-md text-primary bg-white hover:bg-primary/5"
            >
              <FiSearch className="mr-2" />
              Search Again
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 text-gray-500 mb-6">
            <FiBriefcase className="text-3xl" />
          </div>
          <h3 className="text-lg font-medium mb-2">No matching jobs found</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            We couldn't find any jobs that match your search criteria. Try broadening your search or using different keywords.
          </p>
          <button
            onClick={onSearchAgain}
            className="inline-flex items-center px-4 py-2 border border-primary text-base font-medium rounded-md text-primary bg-white hover:bg-primary/5"
          >
            <FiSearch className="mr-2" />
            Try Another Search
          </button>
        </div>
      )}
    </div>
  );
}