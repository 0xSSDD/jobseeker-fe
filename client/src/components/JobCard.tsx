import { Job } from "@shared/schema";
import { Card } from "@/components/ui/card";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
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

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-lg font-semibold text-[#333333]">{job.title}</h3>
            <div className="mt-1 text-[#86888A]">
              <span>{job.company}</span>
              <span className="mx-2">•</span>
              <span>{job.location}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {job.matchScore && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {job.matchScore}% Match
                </span>
              )}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Posted {getDaysAgo(job.postedDate)}
              </span>
            </div>
          </div>
          {job.logo && (
            <div className="flex-shrink-0">
              <CompanyLogo company={job.company} logo={job.logo} />
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm text-[#333333] line-clamp-2">{job.description}</p>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-[#86888A]">
              <span>{job.salary}</span>
            </div>
            <button className="text-[#0077B5] hover:text-blue-700 font-medium text-sm">
              See details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompanyLogo({ company, logo }: { company: string; logo: string }) {
  // If logo is a URL, use it directly
  if (logo.startsWith('http')) {
    return (
      <img 
        className="h-12 w-12 object-contain" 
        src={logo} 
        alt={`${company} logo`} 
      />
    );
  }

  // Otherwise use a default placeholder
  return (
    <div className="h-12 w-12 rounded-full bg-[#0077B5] text-white flex items-center justify-center text-xl font-bold">
      {company.charAt(0)}
    </div>
  );
}
