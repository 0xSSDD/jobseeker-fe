import React, { useEffect, useState } from 'react';
import { Switch } from './ui/switch';

interface JobSource {
  id: number;
  name: string;
  key: string;
  enabled: boolean;
  logo: string | null;
}

const JobSourcesSidebar: React.FC = () => {
  const [jobSources, setJobSources] = useState<JobSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobSources = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/job-sources');
        
        if (!response.ok) {
          throw new Error('Failed to fetch job sources');
        }
        
        const data = await response.json();
        setJobSources(data.jobSources || []);
      } catch (err) {
        console.error('Error fetching job sources:', err);
        setError('Failed to load job sources');
      } finally {
        setLoading(false);
      }
    };

    fetchJobSources();
  }, []);

  const toggleJobSource = async (id: number, enabled: boolean) => {
    try {
      const response = await fetch(`/api/job-sources/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update job source');
      }
      
      // Update local state
      setJobSources(prev => 
        prev.map(source => 
          source.id === id ? { ...source, enabled } : source
        )
      );
    } catch (err) {
      console.error('Error toggling job source:', err);
    }
  };

  return (
    <div className="bg-black bg-opacity-90 p-5 h-full rounded-l-xl">
      <h2 className="text-white text-xl font-semibold mb-6">Job Sources</h2>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : (
        <div className="space-y-4">
          {jobSources.map((source) => (
            <div key={source.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {source.logo ? (
                  <img 
                    src={source.logo} 
                    alt={source.name} 
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white">
                    {source.name.charAt(0)}
                  </div>
                )}
                <span className="text-white">{source.name}</span>
              </div>
              <Switch 
                checked={source.enabled}
                onCheckedChange={(checked) => toggleJobSource(source.id, checked)}
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobSourcesSidebar;