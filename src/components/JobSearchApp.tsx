import { useState, useEffect } from 'react';
import { UploadComponent } from './UploadComponent';
import { SearchComponent } from './SearchComponent';
import { LoadingComponent } from './LoadingComponent';
import { ResultsComponent } from './ResultsComponent';
import { Resume } from '@/models/Resume';
import { jobSearchService, coverLetterService } from '@/services';

interface JobSource {
  id: number;
  name: string;
  key: string;
  enabled: boolean;
  logo: string | null;
}

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

interface JobSearchAppProps {
  jobSources: JobSource[];
}

type Step = 'upload' | 'search' | 'loading' | 'results';

export default function JobSearchApp({ jobSources }: JobSearchAppProps) {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [resume, setResume] = useState<Resume | null>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [coverLetters, setCoverLetters] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  
  // Automatically extract job title from resume once uploaded
  useEffect(() => {
    if (resume && resume.latestRole && resume.latestRole.title) {
      setJobTitle(resume.latestRole.title);
    }
  }, [resume]);
  
  const handleUploadSuccess = (resumeData: Resume) => {
    setResume(resumeData);
    setCurrentStep('search');
  };
  
  const handleSearch = async (title: string, location: string, sources: string[]) => {
    try {
      setError(null);
      setIsSearching(true);
      setCurrentStep('loading');
      setJobTitle(title);
      setLocation(location);
      setSelectedSources(sources);
      
      // Get jobs
      const results = await jobSearchService.searchJobs(
        title, 
        location, 
        sources,
        resume?.id
      );
      
      setJobs(results);
      setCurrentStep('results');
    } catch (err) {
      console.error('Error searching jobs:', err);
      setError('Failed to search for jobs. Please try again.');
      setCurrentStep('search');
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleSearchAgain = () => {
    setCurrentStep('search');
  };
  
  const handleGenerateCoverLetter = async (jobId: string) => {
    if (!resume || !resume.id) {
      setError('Resume information is missing. Please upload your resume again.');
      return;
    }
    
    try {
      setIsGeneratingCoverLetter(true);
      
      // Generate cover letter
      const coverLetter = await coverLetterService.generateCoverLetter(
        jobId,
        resume.id
      );
      
      // Update coverLetters state
      setCoverLetters(prev => ({
        ...prev,
        [jobId]: coverLetter.file_path
      }));
    } catch (err) {
      console.error('Error generating cover letter:', err);
      setError('Failed to generate cover letter. Please try again.');
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <UploadComponent 
            onUploadSuccess={handleUploadSuccess} 
          />
        );
        
      case 'search':
        return (
          <SearchComponent 
            jobSources={jobSources}
            jobTitle={jobTitle}
            location={location}
            onSearch={handleSearch}
            isSearching={isSearching}
          />
        );
        
      case 'loading':
        return <LoadingComponent />;
        
      case 'results':
        return (
          <ResultsComponent 
            jobs={jobs}
            onSearchAgain={handleSearchAgain}
            onGenerateCoverLetter={handleGenerateCoverLetter}
            isGeneratingCoverLetter={isGeneratingCoverLetter}
            coverLetters={coverLetters}
          />
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {/* Application Progress Steps */}
      <div className="mb-10">
        <div className="flex items-center justify-center space-x-2 sm:space-x-4">
          <div 
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
              ${currentStep === 'upload' ? 'bg-primary text-white' : 'bg-primary/20 text-primary'}
            `}
          >
            1
          </div>
          <div 
            className={`flex-1 h-1 max-w-[60px]
              ${currentStep === 'upload' ? 'bg-gray-200' : 'bg-primary'}
            `}
          ></div>
          <div 
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
              ${currentStep === 'search' ? 'bg-primary text-white' : 
               ['loading', 'results'].includes(currentStep) ? 'bg-primary/20 text-primary' : 
               'bg-gray-200 text-gray-500'}
            `}
          >
            2
          </div>
          <div 
            className={`flex-1 h-1 max-w-[60px]
              ${['loading', 'results'].includes(currentStep) ? 'bg-primary' : 'bg-gray-200'}
            `}
          ></div>
          <div 
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
              ${currentStep === 'results' ? 'bg-primary text-white' : 
               currentStep === 'loading' ? 'bg-primary text-white animate-pulse' : 
               'bg-gray-200 text-gray-500'}
            `}
          >
            3
          </div>
        </div>
        
        <div className="flex justify-center mt-2 text-sm font-medium text-gray-500">
          <div className="w-1/3 text-center">Upload</div>
          <div className="w-1/3 text-center">Search</div>
          <div className="w-1/3 text-center">Results</div>
        </div>
      </div>
      
      {renderStepContent()}
    </div>
  );
}