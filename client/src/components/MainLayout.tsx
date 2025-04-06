import React, { useState } from 'react';
import { SunIcon, MoonIcon } from 'lucide-react';
import JobSourcesSidebar from './JobSourcesSidebar';
import { JobSource } from '../services/jobSearchService';

interface MainLayoutProps {
  children: React.ReactNode;
  jobSources?: JobSource[];
  onToggleJobSource?: (id: number, enabled: boolean) => Promise<void>;
}

export default function MainLayout({ children, jobSources = [], onToggleJobSource }: MainLayoutProps) {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      <div className="flex flex-col md:flex-row h-screen">
        {/* Sidebar */}
        <div className="w-full md:w-64 border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
          <JobSourcesSidebar 
            jobSources={jobSources} 
            onToggleJobSource={onToggleJobSource} 
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-center dark:text-white">Job Search Assistant</h1>
            <button 
              onClick={toggleDarkMode} 
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5 text-yellow-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-auto p-6 dark:text-white">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}