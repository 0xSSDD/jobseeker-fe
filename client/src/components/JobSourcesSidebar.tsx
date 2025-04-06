import React from 'react';
import { JobSource } from '../services/jobSearchService';
import { SiLinkedin, SiIndeed, SiGlassdoor, SiMonster } from 'react-icons/si';
import { BriefcaseIcon } from 'lucide-react';

interface JobSourcesSidebarProps {
  jobSources: JobSource[];
  onToggleJobSource?: (id: number, enabled: boolean) => Promise<void>;
}

export default function JobSourcesSidebar({ jobSources, onToggleJobSource }: JobSourcesSidebarProps) {
  
  const getIconForSource = (key: string) => {
    switch (key.toLowerCase()) {
      case 'linkedin':
        return <SiLinkedin className="h-5 w-5" />;
      case 'indeed':
        return <SiIndeed className="h-5 w-5" />;
      case 'glassdoor':
        return <SiGlassdoor className="h-5 w-5" />;
      case 'ziprecruiter':
        return <BriefcaseIcon className="h-5 w-5" />;
      case 'monster':
        return <SiMonster className="h-5 w-5" />;
      default:
        return <BriefcaseIcon className="h-5 w-5" />;
    }
  };

  const handleToggle = (id: number, enabled: boolean) => {
    if (onToggleJobSource) {
      onToggleJobSource(id, !enabled);
    }
  };

  return (
    <div className="h-full p-4 dark:bg-gray-800 dark:text-white">
      <h2 className="text-xl font-bold mb-4">Job Sources</h2>
      
      <div className="space-y-3">
        {jobSources.map((source) => (
          <div key={source.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getIconForSource(source.key)}
              <span>{source.name}</span>
            </div>
            
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox"
                className="sr-only peer"
                checked={source.enabled}
                onChange={() => handleToggle(source.id, source.enabled)}
              />
              <div className={`relative w-11 h-6 rounded-full peer-focus:outline-none 
                peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 
                ${source.enabled ? 
                  'bg-blue-600 after:translate-x-full after:border-white' : 
                  'bg-gray-200 dark:bg-gray-700 after:border-gray-300 dark:after:border-gray-600'} 
                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                after:bg-white after:border after:rounded-full after:h-5 after:w-5 
                after:transition-all dark:border-gray-600`}>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}