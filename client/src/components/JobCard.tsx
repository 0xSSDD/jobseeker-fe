import { Job } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Mail, ExternalLink, Star, Building, DollarSign, MapPin, Clock } from "lucide-react";
import { useState } from "react";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Function to calculate days ago from posted date
  const getDaysAgo = (postedDate: string) => {
    try {
      const posted = new Date(postedDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - posted.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return "Today";
      } else if (diffDays === 1) {
        return "Yesterday";
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
      } else {
        const months = Math.floor(diffDays / 30);
        return `${months} ${months === 1 ? 'month' : 'months'} ago`;
      }
    } catch {
      return "Recently";
    }
  };

  // Handle Gmail button click
  const handleSendEmail = () => {
    // Create email url with subject and body
    const subject = encodeURIComponent(`Application for ${job.title} at ${job.company}`);
    const body = encodeURIComponent("Dear Hiring Manager,\n\n[Your cover letter will appear here]\n\nSincerely,\n[Your Name]");
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoUrl);
  };

  // Handle download button click
  const handleDownloadCoverLetter = () => {
    // This would typically trigger a download of the cover letter
    alert("In a real app, this would download your customized cover letter as a PDF/DOCX file");
  };

  return (
    <Card className="overflow-hidden border border-gray-200 hover:border-indigo-200 transition-all">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 hidden sm:block">
              <CompanyLogo company={job.company} logo={job.logo || ''} />
            </div>
            
            <div className="flex-grow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                  <div className="flex flex-wrap items-center text-sm text-gray-600 mt-1 gap-x-3 gap-y-1">
                    <div className="flex items-center">
                      <Building className="mr-1 h-3.5 w-3.5" />
                      {job.company}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-3.5 w-3.5" />
                      {job.location}
                    </div>
                    {job.salary && (
                      <div className="flex items-center">
                        <DollarSign className="mr-1 h-3.5 w-3.5" />
                        {job.salary}
                      </div>
                    )}
                  </div>
                </div>
                
                {job.matchScore && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <Star className="mr-1 h-3 w-3 fill-green-500 text-green-100" /> 
                    {job.matchScore}% Match
                  </Badge>
                )}
              </div>
              
              <div className="mt-3">
                <p className={`text-sm text-gray-600 ${expanded ? '' : 'line-clamp-2'}`}>
                  {job.description}
                </p>
                {job.description && job.description.length > 150 && (
                  <button 
                    className="text-xs text-indigo-600 hover:text-indigo-800 mt-1"
                    onClick={() => setExpanded(!expanded)}
                  >
                    {expanded ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
              
              <div className="flex items-center text-xs text-gray-500 mt-3">
                <Clock className="mr-1 h-3.5 w-3.5" />
                Posted {getDaysAgo(job.postedDate)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 flex flex-wrap gap-2 justify-end border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-white"
            onClick={() => window.open(job.applyUrl || '#', '_blank')}
          >
            <ExternalLink className="mr-1 h-3.5 w-3.5" />
            View Job
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-white"
            onClick={handleSendEmail}
          >
            <Mail className="mr-1 h-3.5 w-3.5" />
            Send via Email
          </Button>
          
          <Button
            size="sm"
            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={handleDownloadCoverLetter}
          >
            <Download className="mr-1 h-3.5 w-3.5" />
            Download Cover Letter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CompanyLogo({ company, logo }: { company: string; logo: string }) {
  // If logo is a URL, use it directly
  if (logo && logo.startsWith('http')) {
    return (
      <div className="h-12 w-12 flex items-center justify-center rounded-full bg-white border border-gray-200">
        <img 
          className="h-8 w-8 object-contain" 
          src={logo} 
          alt={`${company} logo`} 
        />
      </div>
    );
  }

  // Otherwise use a default placeholder
  return (
    <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg font-bold">
      {company.charAt(0)}
    </div>
  );
}
