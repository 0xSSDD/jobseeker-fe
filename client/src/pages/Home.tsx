import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import ResumeUpload from '../components/ResumeUpload';
import JobMatchesTable from '../components/JobMatchesTable';
import { JobSource, Job } from '../services/jobSearchService';
import jobSearchService from '../services/jobSearchService';
import { Resume } from '../models/Resume';

export default function Home() {
  const [jobSources, setJobSources] = useState<JobSource[]>([]);
  const [resume, setResume] = useState<Resume | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  // Fetch job sources when component mounts
  useEffect(() => {
    const fetchJobSources = async () => {
      const sources = await jobSearchService.getJobSources();
      setJobSources(sources);
    };

    fetchJobSources();
  }, []);

  // Mock jobs data for the UI
  useEffect(() => {
    const mockJobs: Job[] = [
      {
        id: '1',
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'Remote',
        description: 'Join our team to build the next generation platform...',
        requirements: ['5+ years experience', 'React', 'Node.js'],
        url: 'https://example.com/job/1',
        source: 'LinkedIn',
        postedDate: '2025-03-20',
        salary: '$120k - $150k',
        hiringManagerName: 'John Doe',
        hiringManagerEmail: 'john@techcorp.com',
        hiringManagerTitle: 'Engineering Manager',
        processed: true,
        createdAt: '2025-04-01',
        updatedAt: '2025-04-01',
        resumeId: null
      },
      {
        id: '2',
        title: 'Full Stack Developer',
        company: 'Startup Inc',
        location: 'New York, NY',
        description: 'Looking for a full-stack developer with experience...',
        requirements: ['3+ years experience', 'JavaScript', 'AWS'],
        url: 'https://example.com/job/2',
        source: 'Indeed',
        postedDate: '2025-03-21',
        salary: '$100k - $130k',
        hiringManagerName: null,
        hiringManagerEmail: null,
        hiringManagerTitle: null,
        processed: true,
        createdAt: '2025-04-01',
        updatedAt: '2025-04-01',
        resumeId: null
      },
      {
        id: '3',
        title: 'Frontend Engineer',
        company: 'Design Co',
        location: 'San Francisco, CA',
        description: 'We are looking for a talented frontend engineer...',
        requirements: ['2+ years experience', 'React', 'CSS'],
        url: 'https://example.com/job/3',
        source: 'Glassdoor',
        postedDate: '2025-03-19',
        salary: '$110k - $140k',
        hiringManagerName: 'Jane Smith',
        hiringManagerEmail: 'jane@designco.com',
        hiringManagerTitle: 'Creative Director',
        processed: true,
        createdAt: '2025-04-01',
        updatedAt: '2025-04-01',
        resumeId: null
      }
    ];
    
    setJobs(mockJobs);
  }, []);

  const handleUploadSuccess = (uploadedResume: Resume) => {
    setResume(uploadedResume);
    // In a real app, we'd trigger the job search here
  };

  const handleToggleJobSource = async (id: number, enabled: boolean) => {
    const updatedSource = await jobSearchService.toggleJobSource(id, enabled);
    if (updatedSource) {
      setJobSources(current => 
        current.map(source => 
          source.id === id ? {...source, enabled} : source
        )
      );
    }
  };

  const handleGenerateCoverLetter = (jobId: string) => {
    setIsGeneratingCoverLetter(true);
    setActiveJobId(jobId);
    
    // Simulate API call
    setTimeout(() => {
      setIsGeneratingCoverLetter(false);
      setActiveJobId(null);
      alert('Cover letter generated!');
    }, 2000);
  };

  const handleDownloadCoverLetter = (jobId: string) => {
    alert('Cover letter downloaded!');
  };

  const handleEmailJobApplication = (jobId: string) => {
    // In a real implementation, we'd generate the Gmail link and redirect
    window.open('https://mail.google.com/mail/u/0/#compose', '_blank');
  };

  return (
    <MainLayout jobSources={jobSources} onToggleJobSource={handleToggleJobSource}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-lg mt-2 text-gray-600 dark:text-gray-400">
            Upload your resume and let us find the perfect job matches with customized cover letters
          </p>
        </div>
        
        <ResumeUpload 
          onUploadSuccess={handleUploadSuccess}
          isUploading={isUploading}
        />
        
        <JobMatchesTable 
          jobs={jobs}
          onGenerateCoverLetter={handleGenerateCoverLetter}
          onDownloadCoverLetter={handleDownloadCoverLetter}
          onEmailJobApplication={handleEmailJobApplication}
        />
      </div>
    </MainLayout>
  );
}