import { useState } from 'react';
import { FiExternalLink, FiDownload, FiMail, FiLoader } from 'react-icons/fi';
import { SiLinkedin, SiIndeed, SiGlassdoor } from 'react-icons/si';
import { TbBrandZapier } from 'react-icons/tb';

interface Job {
  id: string;
  resume_id: string | null;
  title: string;
  company: string;
  location: string | null;
  description: string;
  requirements: string[] | null;
  url: string;
  source: string;
  posted_date: string | null;
  salary: string | null;
  hiring_manager_name: string | null;
  hiring_manager_email: string | null;
  hiring_manager_title: string | null;
  processed: boolean;
  created_at: string;
  updated_at: string;
}

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
  const [expanded, setExpanded] = useState(false);
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const formatSalary = (salary: string | null) => {
    if (!salary) return 'Not specified';
    return salary;
  };
  
  const handleGmailClick = () => {
    if (!coverLetterUrl) return;
    
    const subject = `Application for ${job.title} position at ${job.company}`;
    const to = job.hiring_manager_email || '';
    const body = `
Dear ${job.hiring_manager_name || 'Hiring Manager'},

I hope this email finds you well. I am writing to express my interest in the ${job.title} position at ${job.company}.

Please find my cover letter at: ${coverLetterUrl}

Thank you for your consideration.

Best regards,
[Your Name]
    `;
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
  };
  
  const shortDescription = job.description.length > 150 
    ? job.description.substring(0, 150) + '...' 
    : job.description;
  
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center">
            <SourceBadge source={job.source} logo={null} />
            <h3 className="text-lg font-semibold ml-2">{job.title}</h3>
          </div>
          
          <a 
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-primary transition-colors"
          >
            <FiExternalLink />
          </a>
        </div>
        
        <div className="mb-3">
          <p className="text-base font-medium">{job.company}</p>
          <p className="text-sm text-gray-500">{job.location || 'Remote'}</p>
        </div>
        
        <div className="mb-3">
          <p className={expanded ? '' : 'line-clamp-2'}>
            {expanded ? job.description : shortDescription}
          </p>
          {job.description.length > 150 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-primary hover:underline mt-1"
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
          <div>
            <span className="text-gray-500">Posted:</span> {formatDate(job.posted_date)}
          </div>
          <div>
            <span className="text-gray-500">Salary:</span> {formatSalary(job.salary)}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {!coverLetterUrl ? (
            <button
              onClick={() => onGenerateCoverLetter(job.id)}
              disabled={isGenerating}
              className={`
                flex items-center px-3 py-2 rounded-md text-sm font-medium
                ${isGenerating 
                  ? 'bg-gray-200 text-gray-500 cursor-wait' 
                  : 'bg-primary text-white hover:bg-primary/90'}
              `}
            >
              {isGenerating && <FiLoader className="animate-spin mr-2" />}
              Generate Cover Letter
            </button>
          ) : (
            <>
              <a 
                href={coverLetterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20"
              >
                <FiDownload className="mr-2" />
                Download Cover Letter
              </a>
              
              <button
                onClick={handleGmailClick}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-[#ea4335]/10 text-[#ea4335] hover:bg-[#ea4335]/20"
              >
                <FiMail className="mr-2" />
                Compose in Gmail
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface SourceBadgeProps {
  source: string;
  logo: string | null;
}

function SourceBadge({ source, logo }: SourceBadgeProps) {
  let icon;
  let color;
  
  switch (source.toLowerCase()) {
    case 'linkedin':
      icon = <SiLinkedin />;
      color = 'bg-[#0A66C2] text-white';
      break;
    case 'indeed':
      icon = <SiIndeed />;
      color = 'bg-[#003A9B] text-white';
      break;
    case 'glassdoor':
      icon = <SiGlassdoor />;
      color = 'bg-[#0CAA41] text-white';
      break;
    case 'ziprecruiter':
      icon = <TbBrandZapier />;
      color = 'bg-[#5C6AC4] text-white';
      break;
    default:
      icon = <FiExternalLink />;
      color = 'bg-gray-500 text-white';
  }
  
  return (
    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${color}`}>
      {icon}
    </div>
  );
}