import { useState } from 'react'
import { Search, Filter, RefreshCw } from 'lucide-react'
import { JobCard } from '@/components/JobCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Job } from '@/types'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

interface ResultsComponentProps {
  jobs: Job[];
  onSearchAgain: () => void;
  onGenerateCoverLetter: (jobId: string) => void;
  isGeneratingCoverLetter: boolean;
  coverLetters?: Record<string, string>; // Map of job IDs to cover letter URLs
}

export function ResultsComponent({ 
  jobs,
  onSearchAgain,
  onGenerateCoverLetter,
  isGeneratingCoverLetter,
  coverLetters = {}
}: ResultsComponentProps) {
  const [searchQuery, setSearchQuery] = useState('')
  
  // Filter jobs based on search query
  const filteredJobs = jobs.filter(job => {
    const query = searchQuery.toLowerCase()
    return (
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      (job.location && job.location.toLowerCase().includes(query)) ||
      job.description.toLowerCase().includes(query)
    )
  })
  
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Search Results</h2>
          <p className="text-muted-foreground">
            Found {jobs.length} matching job{jobs.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter results..."
              className="pl-9 w-full sm:w-[200px] md:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={onSearchAgain}
          >
            <RefreshCw className="h-4 w-4" />
            <span>New Search</span>
          </Button>
        </div>
      </div>
      
      {filteredJobs.length === 0 ? (
        <Card className="w-full">
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <Filter className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No matching jobs</h3>
            <p className="text-muted-foreground mb-4">
              {jobs.length > 0 
                ? 'Try using different search terms or clear the filter.'
                : 'We couldn\'t find any jobs matching your criteria. Try broadening your search.'}
            </p>
            {jobs.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setSearchQuery('')}
              >
                Clear Filter
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredJobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              onGenerateCoverLetter={onGenerateCoverLetter} 
              isGenerating={isGeneratingCoverLetter}
              coverLetterUrl={coverLetters[job.id] || null}
            />
          ))}
        </div>
      )}
    </div>
  )
}