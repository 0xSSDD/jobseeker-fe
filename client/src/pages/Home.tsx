import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import ResumeUpload from '../components/ResumeUpload';
import JobMatchesTable from '../components/JobMatchesTable';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string | null;
  posted_date: string | null;
  source: string;
}

export default function Home() {
  const [resume, setResume] = useState<any | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState<Record<string, boolean>>({});
  const [coverLetterUrls, setCoverLetterUrls] = useState<Record<string, string>>({});

  // Mock jobs data to match the screenshot
  useEffect(() => {
    const mockJobs: Job[] = [
      {
        id: '1',
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'Remote',
        posted_date: '20/03/2024',
        source: 'linkedin'
      },
      {
        id: '2',
        title: 'Full Stack Developer',
        company: 'Startup Inc',
        location: 'New York, NY',
        posted_date: '21/03/2024',
        source: 'indeed'
      },
      {
        id: '3',
        title: 'Frontend Engineer',
        company: 'Design Co',
        location: 'San Francisco, CA',
        posted_date: '19/03/2024',
        source: 'glassdoor'
      }
    ];

    setJobs(mockJobs);
  }, []);

  const handleUploadSuccess = (uploadedResume: any) => {
    setResume(uploadedResume);
    setIsUploading(false);
    // In a real app, we'd trigger the job search here
  };

  const handleGenerateCoverLetter = async (jobId: string) => {
    // Set the generating state for this specific job
    setIsGeneratingCoverLetter(prev => ({
      ...prev,
      [jobId]: true
    }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Set the cover letter URL
      setCoverLetterUrls(prev => ({
        ...prev,
        [jobId]: `/api/cover-letters/${jobId}`
      }));
    } catch (error) {
      console.error('Error generating cover letter:', error);
    } finally {
      // Clear the generating state
      setIsGeneratingCoverLetter(prev => ({
        ...prev,
        [jobId]: false
      }));
    }
  };

  return (
    <MainLayout>
      <ResumeUpload
        onUploadSuccess={handleUploadSuccess}
        isUploading={isUploading}
        hasResume={resume !== null}
      />

      {/* <JobMatchesTable
        jobs={jobs}
        onGenerateCoverLetter={handleGenerateCoverLetter}
        isGeneratingCoverLetter={isGeneratingCoverLetter}
        coverLetterUrls={coverLetterUrls}
      /> */}
    </MainLayout>
  );
}