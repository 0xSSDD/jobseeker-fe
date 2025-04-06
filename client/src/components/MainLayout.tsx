import React from 'react';
import JobSourcesSidebar from './JobSourcesSidebar';
import { Moon } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // Mock job sources data for the sidebar
  const jobSources = [
    { id: '1', name: 'LinkedIn', key: 'linkedin', enabled: true },
    { id: '2', name: 'Indeed', key: 'indeed', enabled: true },
    { id: '3', name: 'Glassdoor', key: 'glassdoor', enabled: false },
  ];

  const handleToggleSource = (id: string, enabled: boolean) => {
    console.log(`Toggling source ${id} to ${enabled}`);
    // In a real app, this would update the state and possibly call an API
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Job Sources Sidebar */}
      <div className="w-64 fixed h-full">
        <JobSourcesSidebar 
          jobSources={jobSources}
          onToggleSource={handleToggleSource}
        />
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 min-h-screen">
        {/* Theme toggle button */}
        <div className="absolute top-4 right-4">
          <button 
            className="p-2 rounded-full bg-secondary"
            aria-label="Toggle theme"
          >
            <Moon className="h-5 w-5" />
          </button>
        </div>

        <main className="max-w-4xl mx-auto py-8 px-6">
          <h1 className="text-2xl font-bold text-center mb-2">Job Search Assistant</h1>
          <p className="text-center text-muted-foreground mb-8">
            Upload your resume and let us find the perfect job matches with customized cover letters
          </p>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;