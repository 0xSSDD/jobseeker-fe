import { useState } from 'react'
import { Calendar, MapPin, Briefcase, Building, ExternalLink, Mail, Download, Loader2 } from 'lucide-react'
import { SiLinkedin, SiIndeed, SiGlassdoor } from 'react-icons/si'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Job } from '@/types'
import { formatDate, formatSalary } from '@/utils/helpers'

interface JobCardProps {
  job: Job;
  onGenerateCoverLetter: (jobId: string) => void;
  isGenerating?: boolean;
  coverLetterUrl?: string | null;
}

export function JobCard({ 
  job, 
  onGenerateCoverLetter,
  isGenerating = false,
  coverLetterUrl = null
}: JobCardProps) {
  const [showFullDescription, setShowFullDescription] = useState(false)
  
  // Truncate description for preview
  const maxLength = 250
  const truncatedDescription = job.description.length > maxLength
    ? job.description.substring(0, maxLength) + '...'
    : job.description
  
  // Check if this specific job is in the loading state
  const isThisJobGenerating = isGenerating
  
  // Create email link for Gmail with pre-filled subject and body
  const createGmailLink = () => {
    if (!coverLetterUrl) return ''
    
    const subject = `Application for ${job.title} position at ${job.company}`
    const body = `Dear ${job.hiring_manager_name || 'Hiring Manager'},

I am writing to express my interest in the ${job.title} position at ${job.company}.

Please find my cover letter at: ${coverLetterUrl}

Thank you for your consideration.

Best regards,
[Your Name]`
    
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${job.hiring_manager_email || ''}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    
    return gmailLink
  }
  
  return (
    <Card className="relative overflow-hidden border-l-4 border-l-primary">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">{job.title}</CardTitle>
              <SourceBadge source={job.source} logo={null} />
            </div>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Building className="h-4 w-4" />
              <span>{job.company}</span>
              
              {job.location && (
                <>
                  <span className="mx-1">•</span>
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </>
              )}
              
              {job.posted_date && (
                <>
                  <span className="mx-1">•</span>
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(job.posted_date)}</span>
                </>
              )}
            </CardDescription>
          </div>
          
          {job.salary && (
            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
              {formatSalary(job.salary)}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className={`prose prose-sm max-w-none ${!showFullDescription && 'line-clamp-3'}`}>
              <p>
                {showFullDescription ? job.description : truncatedDescription}
              </p>
            </div>
            {job.description.length > maxLength && (
              <Button 
                variant="link" 
                className="px-0 h-auto font-medium mt-1"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? 'Show less' : 'Read more'}
              </Button>
            )}
          </div>
          
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Requirements</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {job.requirements.slice(0, 4).map((req, i) => (
                  <li key={i} className="line-clamp-1">{req}</li>
                ))}
                {job.requirements.length > 4 && (
                  <li className="text-primary">+{job.requirements.length - 4} more</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-2 border-t pt-4">
        <Button 
          variant="default" 
          className="w-full sm:w-auto"
          disabled={isThisJobGenerating || !!coverLetterUrl}
          onClick={() => onGenerateCoverLetter(job.id)}
        >
          {isThisJobGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Cover Letter
            </>
          ) : coverLetterUrl ? (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download Cover Letter
            </>
          ) : (
            <>
              <Briefcase className="mr-2 h-4 w-4" />
              Generate Cover Letter
            </>
          )}
        </Button>
        
        {coverLetterUrl && (
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            asChild
          >
            <a href={createGmailLink()} target="_blank" rel="noopener noreferrer">
              <Mail className="mr-2 h-4 w-4" />
              Email with Gmail
            </a>
          </Button>
        )}
        
        <div className="grow"></div>
        
        <Button
          variant="ghost"
          size="icon"
          className="sm:ml-auto"
          asChild
        >
          <a href={job.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">Visit job posting</span>
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

interface SourceBadgeProps {
  source: string;
  logo: string | null;
}

function SourceBadge({ source, logo }: SourceBadgeProps) {
  let badgeColor = ''
  
  switch(source) {
    case 'linkedin':
      badgeColor = 'bg-blue-50 text-blue-600 border-blue-200';
      break;
    case 'indeed':
      badgeColor = 'bg-blue-50 text-blue-600 border-blue-200';
      break;
    case 'ziprecruiter':
      badgeColor = 'bg-purple-50 text-purple-600 border-purple-200';
      break;
    case 'glassdoor':
      badgeColor = 'bg-green-50 text-green-600 border-green-200';
      break;
    default:
      badgeColor = 'bg-gray-50 text-gray-600 border-gray-200';
  }
  
  return (
    <Badge variant="outline" className={`${badgeColor} flex items-center gap-1`}>
      {getSourceIcon(source)}
      <span className="capitalize">{source}</span>
    </Badge>
  )
}

// Helper function to get the correct icon for the job source
const getSourceIcon = (source: string) => {
  switch(source) {
    case 'linkedin':
      return <SiLinkedin className="w-3 h-3" />;
    case 'indeed':
      return <SiIndeed className="w-3 h-3" />;
    case 'glassdoor':
      return <SiGlassdoor className="w-3 h-3" />;
    case 'ziprecruiter':
      return <Briefcase className="w-3 h-3 text-[#5B4DE5]" />;
    default:
      return <Briefcase className="w-3 h-3" />;
  }
};