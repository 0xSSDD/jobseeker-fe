import React, { useState } from 'react';
import { Job } from '../services/jobSearchService';
import { ChevronUpIcon, ChevronDownIcon, MailIcon, DownloadIcon, ExternalLinkIcon } from 'lucide-react';

interface JobMatchesTableProps {
  jobs: Job[];
  onGenerateCoverLetter?: (jobId: string) => void;
  onDownloadCoverLetter?: (jobId: string) => void;
  onEmailJobApplication?: (jobId: string) => void;
}

export default function JobMatchesTable({ 
  jobs, 
  onGenerateCoverLetter,
  onDownloadCoverLetter,
  onEmailJobApplication 
}: JobMatchesTableProps) {
  const [isVisible, setIsVisible] = useState(true);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Example Job Matches</h2>
        <button 
          onClick={() => setIsVisible(!isVisible)}
          className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          {isVisible ? (
            <>
              <span>Hide Jobs</span>
              <ChevronUpIcon className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              <span>Show Jobs</span>
              <ChevronDownIcon className="ml-1 h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {isVisible && (
        <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
          <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 font-medium">Position</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Posted</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3">{job.title}</td>
                    <td className="px-4 py-3">{job.company}</td>
                    <td className="px-4 py-3">{job.location || 'Remote'}</td>
                    <td className="px-4 py-3">{formatDate(job.postedDate?.toString())}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => onEmailJobApplication && onEmailJobApplication(job.id)}
                          className="p-1.5 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                          title="Email application"
                        >
                          <MailIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => onDownloadCoverLetter && onDownloadCoverLetter(job.id)}
                          className="p-1.5 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                          title="Download cover letter"
                        >
                          <DownloadIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => onGenerateCoverLetter && onGenerateCoverLetter(job.id)}
                          className="p-1.5 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                          title="Generate cover letter"
                        >
                          <ExternalLinkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                    Upload your resume to find matching jobs
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}