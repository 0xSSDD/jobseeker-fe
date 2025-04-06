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
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Example Job Matches</h2>
        <button 
          onClick={toggleVisibility}
          className="text-gray-400 hover:text-white flex items-center"
        >
          {isVisible ? 'Hide Jobs' : 'Show Jobs'} 
          <ChevronUp className={`ml-1 w-4 h-4 transition-transform ${isVisible ? '' : 'transform rotate-180'}`} />
        </button>
      </div>
      
      {isVisible && (
        <div className="overflow-x-auto">
          <table className="w-full bg-black bg-opacity-30 rounded-lg overflow-hidden">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="px-4 py-3 text-gray-300 font-medium">Position</th>
                <th className="px-4 py-3 text-gray-300 font-medium">Company</th>
                <th className="px-4 py-3 text-gray-300 font-medium">Location</th>
                <th className="px-4 py-3 text-gray-300 font-medium">Posted</th>
                <th className="px-4 py-3 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                  <td className="px-4 py-4 text-white">{job.title}</td>
                  <td className="px-4 py-4 text-white">{job.company}</td>
                  <td className="px-4 py-4 text-white">{job.location || 'Remote'}</td>
                  <td className="px-4 py-4 text-white">{job.posted_date || 'Unknown'}</td>
                  <td className="px-4 py-4 flex space-x-2">
                    <button
                      onClick={() => onGenerateCoverLetter(job.id)}
                      disabled={isGeneratingCoverLetter[job.id]}
                      className="p-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                      title="Generate Cover Letter"
                    >
                      {isGeneratingCoverLetter[job.id] ? (
                        <div className="w-5 h-5 animate-spin rounded-full border-t-2 border-white"></div>
                      ) : (
                        <Mail className="w-5 h-5" />
                      )}
                    </button>
                    
                    {coverLetterUrls[job.id] && (
                      <a
                        href={coverLetterUrls[job.id]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                        title="Download Cover Letter"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                    )}
                    
                    <a
                      href={`https://example.com/job/${job.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                      title="View Job Details"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
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