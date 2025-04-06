import React, { useState, useEffect } from 'react';
import JobSourcesSidebar from './JobSourcesSidebar';
import { Moon, Sun } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // State for dark/light mode
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Mock job sources data for the sidebar
  const [jobSources, setJobSources] = useState([
    { id: '1', name: 'LinkedIn', key: 'linkedin', enabled: true },
    { id: '2', name: 'Indeed', key: 'indeed', enabled: true },
    { id: '3', name: 'Glassdoor', key: 'glassdoor', enabled: false },
  ]);

  // Apply theme when component mounts and when theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleToggleSource = (id: string, enabled: boolean) => {
    console.log(`Toggling source ${id} to ${enabled}`);
    setJobSources(jobSources.map(source => 
      source.id === id ? { ...source, enabled } : source
    ));
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
            className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            aria-label="Toggle theme"
            onClick={handleToggleTheme}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>

        <main className="max-w-4xl mx-auto py-6 px-6">
          <h1 className="text-2xl font-bold text-center mb-2">Job Search Assistant</h1>
          <p className="text-center text-muted-foreground mb-6">
            Upload your resume and let us find the perfect job matches with customized cover letters
          </p>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;