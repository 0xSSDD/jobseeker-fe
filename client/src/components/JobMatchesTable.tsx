import React, { useState } from 'react';
import { Mail, Download, ExternalLink, ChevronUp } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string | null;
  posted_date: string | null;
  source: string;
}

interface JobMatchesTableProps {
  jobs: Job[];
  onGenerateCoverLetter: (jobId: string) => void;
  isGeneratingCoverLetter?: Record<string, boolean>;
  coverLetterUrls?: Record<string, string>;
}

const JobMatchesTable: React.FC<JobMatchesTableProps> = ({
  jobs,
  onGenerateCoverLetter,
  isGeneratingCoverLetter = {},
  coverLetterUrls = {}
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Example Job Matches</h2>
        <button 
          onClick={toggleVisibility}
          className="text-muted-foreground flex items-center text-sm"
        >
          {isVisible ? 'Hide Jobs' : 'Show Jobs'} 
          <ChevronUp className={`ml-1 w-4 h-4 transition-transform ${isVisible ? '' : 'transform rotate-180'}`} />
        </button>
      </div>
      
      {isVisible && (
        <div className="overflow-x-auto border border-border rounded-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left bg-secondary/50">
                <th className="px-4 py-3 font-medium text-sm">Position</th>
                <th className="px-4 py-3 font-medium text-sm">Company</th>
                <th className="px-4 py-3 font-medium text-sm">Location</th>
                <th className="px-4 py-3 font-medium text-sm">Posted</th>
                <th className="px-4 py-3 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 text-sm">{job.title}</td>
                  <td className="px-4 py-3 text-sm">{job.company}</td>
                  <td className="px-4 py-3 text-sm">{job.location || 'Remote'}</td>
                  <td className="px-4 py-3 text-sm">{job.posted_date || 'Unknown'}</td>
                  <td className="px-4 py-3 flex space-x-1">
                    <button
                      onClick={() => onGenerateCoverLetter(job.id)}
                      disabled={isGeneratingCoverLetter[job.id]}
                      className="p-1.5 rounded-md bg-secondary inline-flex items-center justify-center hover:bg-secondary/80 transition-colors"
                      title="Email with Cover Letter"
                    >
                      {isGeneratingCoverLetter[job.id] ? (
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-foreground border-t-transparent"></div>
                      ) : (
                        <Mail className="w-4 h-4" />
                      )}
                    </button>
                    
                    <button
                      className="p-1.5 rounded-md bg-secondary inline-flex items-center justify-center hover:bg-secondary/80 transition-colors"
                      title="Download Cover Letter"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    
                    <button
                      className="p-1.5 rounded-md bg-secondary inline-flex items-center justify-center hover:bg-secondary/80 transition-colors"
                      title="View Job Details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default JobMatchesTable;