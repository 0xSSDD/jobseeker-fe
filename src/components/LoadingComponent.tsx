import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export function LoadingComponent() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Finding Your Perfect Match</h2>
        <p className="text-muted-foreground mt-2">
          Searching across job platforms for relevant opportunities
        </p>
      </div>
      
      <Card className="w-full">
        <CardContent className="pt-6 pb-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Searching LinkedIn</span>
                <span className="text-sm text-muted-foreground">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Searching Indeed</span>
                <span className="text-sm text-muted-foreground">90%</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Searching Glassdoor</span>
                <span className="text-sm text-muted-foreground">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Searching ZipRecruiter</span>
                <span className="text-sm text-muted-foreground">60%</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground animate-pulse">Analyzing job descriptions and matching to your resume...</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <JobSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

function JobSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="h-5 bg-muted rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
          <div className="pt-2">
            <div className="h-3 bg-muted rounded w-full animate-pulse mb-2"></div>
            <div className="h-3 bg-muted rounded w-full animate-pulse mb-2"></div>
            <div className="h-3 bg-muted rounded w-2/3 animate-pulse"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}