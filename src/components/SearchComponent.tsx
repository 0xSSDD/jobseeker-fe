import { useState } from 'react';
import { FiSearch, FiMapPin, FiBriefcase } from 'react-icons/fi';
import { SiLinkedin, SiIndeed, SiGlassdoor } from 'react-icons/si';
import { TbBrandZapier } from 'react-icons/tb';

interface JobSource {
  id: number;
  name: string;
  key: string;
  enabled: boolean;
  logo: string | null;
}

interface SearchComponentProps {
  jobSources: JobSource[];
  jobTitle: string;
  location: string;
  onSearch: (title: string, location: string, sources: string[]) => void;
  isSearching: boolean;
}

export function SearchComponent({ 
  jobSources, 
  jobTitle, 
  location, 
  onSearch, 
  isSearching 
}: SearchComponentProps) {
  const [title, setTitle] = useState(jobTitle);
  const [locationInput, setLocationInput] = useState(location);
  const [selectedSources, setSelectedSources] = useState<JobSource[]>(
    jobSources.filter(source => source.enabled)
  );
  
  const handleSourceToggle = (sourceId: number) => {
    setSelectedSources(prev => {
      const source = jobSources.find(s => s.id === sourceId);
      if (!source) return prev;
      
      const isSelected = prev.some(s => s.id === sourceId);
      
      if (isSelected) {
        return prev.filter(s => s.id !== sourceId);
      } else {
        return [...prev, source];
      }
    });
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const sourceKeys = selectedSources.map(source => source.key);
    onSearch(title, locationInput, sourceKeys);
  };
  
  const getSourceIcon = (key: string) => {
    switch (key) {
      case 'linkedin':
        return <SiLinkedin className="text-[#0A66C2]" />;
      case 'indeed':
        return <SiIndeed className="text-[#003A9B]" />;
      case 'glassdoor':
        return <SiGlassdoor className="text-[#0CAA41]" />;
      case 'ziprecruiter':
        return <TbBrandZapier className="text-[#5C6AC4]" />;
      default:
        return <FiSearch />;
    }
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Find Your Dream Job</h2>
        <p className="text-gray-600">
          Search for jobs across multiple platforms with a single click.
        </p>
      </div>
      
      <form onSubmit={handleSearch} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiBriefcase className="text-gray-400" />
            </div>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Job Title"
              className="pl-10 w-full rounded-md border border-gray-300 py-3 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMapPin className="text-gray-400" />
            </div>
            <input
              type="text"
              value={locationInput}
              onChange={e => setLocationInput(e.target.value)}
              placeholder="Location"
              className="pl-10 w-full rounded-md border border-gray-300 py-3 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Sources
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {jobSources.map(source => (
              <div
                key={source.id}
                onClick={() => handleSourceToggle(source.id)}
                className={`
                  flex items-center gap-2 p-3 rounded-md border cursor-pointer transition-colors
                  ${selectedSources.some(s => s.id === source.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'}
                `}
              >
                <div className="text-xl">
                  {getSourceIcon(source.key)}
                </div>
                <span className="text-sm font-medium">{source.name}</span>
              </div>
            ))}
          </div>
          {selectedSources.length === 0 && (
            <p className="text-red-500 text-xs mt-1">
              Please select at least one search source
            </p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isSearching || selectedSources.length === 0 || !title || !locationInput}
          className={`
            w-full py-3 px-4 rounded-md font-medium text-white shadow-sm
            ${isSearching || selectedSources.length === 0 || !title || !locationInput
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'}
          `}
        >
          {isSearching ? 'Searching...' : 'Search Jobs'}
        </button>
      </form>
    </div>
  );
}