import { useState, useEffect } from 'react'
import { Search, MapPin, Filter } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { SiLinkedin, SiIndeed, SiGlassdoor } from 'react-icons/si'
import { Briefcase } from 'lucide-react'
import { JobSource } from '@/types'

interface SearchComponentProps {
  jobSources: JobSource[];
  jobTitle: string;
  location: string;
  onSearch: (title: string, location: string, sources: string[]) => void;
  isSearching: boolean;
}

export function SearchComponent({ 
  jobSources,
  jobTitle: initialJobTitle = '',
  location: initialLocation = '',
  onSearch,
  isSearching 
}: SearchComponentProps) {
  const [jobTitle, setJobTitle] = useState(initialJobTitle)
  const [location, setLocation] = useState(initialLocation)
  const [sources, setSources] = useState<JobSource[]>(
    jobSources.map(s => ({ ...s, enabled: true }))
  )
  
  useEffect(() => {
    // Update job title if provided from parent
    if (initialJobTitle && initialJobTitle !== jobTitle) {
      setJobTitle(initialJobTitle)
    }
  }, [initialJobTitle])
  
  const handleToggleSource = (id: number, enabled: boolean) => {
    setSources(prev => prev.map(source => 
      source.id === id ? { ...source, enabled } : source
    ))
  }
  
  const handleSearch = () => {
    // Get enabled sources
    const enabledSources = sources
      .filter(source => source.enabled)
      .map(source => source.key)
    
    onSearch(jobTitle, location, enabledSources)
  }
  
  const getSourceIcon = (key: string) => {
    switch(key) {
      case 'linkedin':
        return <SiLinkedin className="h-4 w-4 text-[#0A66C2]" />;
      case 'indeed':
        return <SiIndeed className="h-4 w-4 text-[#2164F3]" />;
      case 'glassdoor':
        return <SiGlassdoor className="h-4 w-4 text-[#0CAA41]" />;
      case 'ziprecruiter':
        return <Briefcase className="h-4 w-4 text-[#5B4DE5]" />;
      default:
        return <Briefcase className="h-4 w-4" />;
    }
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Find Your Next Opportunity</h2>
        <p className="text-muted-foreground mt-2">
          Search for relevant jobs across multiple platforms
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Search Preferences</CardTitle>
          <CardDescription>
            Set your job search criteria and select the platforms to search
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="jobTitle"
                  placeholder="Software Engineer, Product Manager, Designer..."
                  className="pl-9"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="City, State, or Remote"
                  className="pl-9"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">Job Sources</h3>
            </div>
            <div className="grid gap-3">
              {sources.map((source) => (
                <div key={source.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getSourceIcon(source.key)}
                    <Label htmlFor={`source-${source.id}`} className="text-sm font-normal cursor-pointer">
                      {source.name}
                    </Label>
                  </div>
                  <Switch
                    id={`source-${source.id}`}
                    checked={source.enabled}
                    onCheckedChange={(checked) => handleToggleSource(source.id, checked)}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end border-t pt-4">
          <Button 
            size="lg"
            onClick={handleSearch}
            disabled={!jobTitle.trim() || isSearching}
          >
            {isSearching ? 'Searching...' : 'Search Jobs'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}