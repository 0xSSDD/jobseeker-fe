import React from 'react';
import { Switch } from './ui/switch';

interface JobSource {
  id: string;
  name: string;
  key: string;
  enabled: boolean;
}

interface JobSourcesSidebarProps {
  jobSources: JobSource[];
  onToggleSource: (id: string, enabled: boolean) => void;
}

const JobSourcesSidebar: React.FC<JobSourcesSidebarProps> = ({ 
  jobSources, 
  onToggleSource 
}) => {
  return (
    <div className="py-4 px-6 border-r border-border h-screen">
      <h2 className="text-xl font-bold mb-6">Job Sources</h2>
      <div className="space-y-6">
        {jobSources.map((source) => (
          <div key={source.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {source.key === 'linkedin' && (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
                  ></path>
                </svg>
              )}
              {source.key === 'indeed' && (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M11.92 17.402a2.962 2.962 0 0 1-2.958 2.963 2.962 2.962 0 0 1-2.963-2.963 2.962 2.962 0 0 1 2.963-2.962c1.63 0 2.958 1.329 2.958 2.962m-2.958-6.042a6.042 6.042 0 1 0 0 12.085 6.042 6.042 0 0 0 0-12.085m7.109.412h-2.509v9.885h-3.088V7.686H5.456V4.598h10.615v3.088z"
                  ></path>
                </svg>
              )}
              {source.key === 'glassdoor' && (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M8 9.5h8v2H8v-2m-2.5-5A1.5 1.5 0 0 0 4 6v12a1.5 1.5 0 0 0 1.5 1.5h14a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5h-14m14 2V6h-14v2h14M5.5 18V10h14v8h-14z"
                  ></path>
                </svg>
              )}
              <span>{source.name}</span>
            </div>
            <div 
              onClick={() => onToggleSource(source.id, !source.enabled)}
              className="cursor-pointer"
            >
              <Switch 
                checked={source.enabled}
                onCheckedChange={(checked) => onToggleSource(source.id, checked)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobSourcesSidebar;