import { useState } from 'react'
import { UploadComponent } from './UploadComponent'
import { SearchComponent } from './SearchComponent'
import { LoadingComponent } from './LoadingComponent'
import { ResultsComponent } from './ResultsComponent'
import { Resume, JobSource, Job, CurrentStep } from '@/types'
import { searchJobs, generateCoverLetter } from '@/utils/helpers'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

interface JobSearchAppProps {
  jobSources: JobSource[];
}

export default function JobSearchApp({ jobSources }: JobSearchAppProps) {
  const [state, setState] = useState({
    currentStep: 'upload' as CurrentStep,
    resume: null as Resume | null,
    jobTitle: '',
    location: '',
    jobs: [] as Job[],
    isSearching: false,
    error: null as string | null,
    jobSources: jobSources.map(s => s.key),
    coverLetters: {} as Record<string, string>,
    currentGeneratingJobId: null as string | null
  })
  
  const handleUploadSuccess = (resumeData: Resume) => {
    setState(prev => ({
      ...prev,
      currentStep: 'search',
      resume: resumeData,
      // If we have a latest role from the resume, use it as the initial job title
      jobTitle: resumeData.latest_role || ''
    }))
  }
  
  const handleSearch = async (title: string, location: string, sources: string[]) => {
    setState(prev => ({
      ...prev,
      isSearching: true,
      currentStep: 'loading'
    }))
    
    try {
      // Make sure we have a resume ID
      if (!state.resume?.id) {
        throw new Error('Resume not found')
      }
      
      const jobs = await searchJobs(title, location, sources, state.resume.id)
      
      // Short delay to ensure loading animation is visible
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          currentStep: 'results',
          jobTitle: title,
          location: location,
          jobSources: sources,
          jobs,
          isSearching: false
        }))
      }, 1500)
    } catch (error) {
      console.error('Search error:', error)
      setState(prev => ({
        ...prev,
        error: 'Failed to search for jobs. Please try again.',
        isSearching: false,
        currentStep: 'search'
      }))
    }
  }
  
  const handleSearchAgain = () => {
    setState(prev => ({
      ...prev,
      currentStep: 'search'
    }))
  }
  
  const handleGenerateCoverLetter = async (jobId: string) => {
    if (!state.resume?.id) return
    
    setState(prev => ({
      ...prev,
      currentGeneratingJobId: jobId
    }))
    
    try {
      const coverLetter = await generateCoverLetter(jobId, state.resume.id)
      
      setState(prev => ({
        ...prev, 
        coverLetters: {
          ...prev.coverLetters,
          [jobId]: coverLetter.file_path
        },
        currentGeneratingJobId: null
      }))
    } catch (error) {
      console.error('Cover letter generation error:', error)
      setState(prev => ({
        ...prev,
        currentGeneratingJobId: null
      }))
    }
  }
  
  return (
    <div className="container max-w-7xl mx-auto py-6 px-4 md:px-6">
      <div className="grid md:grid-cols-12 gap-6">
        {/* Sidebar for app info + control panel */}
        <div className="md:col-span-4 lg:col-span-3">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">LinkedUp</CardTitle>
              <CardDescription>AI-powered job search tool</CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="space-y-4">
                <p>Simplify your job search with smart matching and personalized cover letters.</p>
                
                <div>
                  <h3 className="font-medium mb-2">How it works</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    <li className={state.currentStep === 'upload' ? 'text-primary font-medium' : ''}>
                      Upload your resume
                    </li>
                    <li className={state.currentStep === 'search' ? 'text-primary font-medium' : ''}>
                      Set your job preferences
                    </li>
                    <li className={state.currentStep === 'loading' ? 'text-primary font-medium' : ''}>
                      Find matching opportunities
                    </li>
                    <li className={state.currentStep === 'results' ? 'text-primary font-medium' : ''}>
                      Generate personalized cover letters
                    </li>
                  </ol>
                </div>
                
                {state.resume && (
                  <div className="bg-muted p-3 rounded-md">
                    <h3 className="font-medium text-sm mb-1">Your Resume</h3>
                    <p className="text-sm text-muted-foreground">{state.resume.name}</p>
                    <p className="text-sm text-muted-foreground">{state.resume.latest_role}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content area */}
        <div className="md:col-span-8 lg:col-span-9">
          {state.currentStep === 'upload' && (
            <UploadComponent onUploadSuccess={handleUploadSuccess} />
          )}
          
          {state.currentStep === 'search' && (
            <SearchComponent
              jobSources={jobSources}
              jobTitle={state.jobTitle}
              location={state.location}
              onSearch={handleSearch}
              isSearching={state.isSearching}
            />
          )}
          
          {state.currentStep === 'loading' && (
            <LoadingComponent />
          )}
          
          {state.currentStep === 'results' && (
            <ResultsComponent
              jobs={state.jobs}
              onSearchAgain={handleSearchAgain}
              onGenerateCoverLetter={handleGenerateCoverLetter}
              isGeneratingCoverLetter={state.currentGeneratingJobId !== null}
              coverLetters={state.coverLetters}
            />
          )}
        </div>
      </div>
    </div>
  )
}