export interface JobSource {
  id: number;
  name: string;
  key: string;
  enabled: boolean;
  logo: string | null;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string | null;
  description: string;
  requirements: string[] | null;
  url: string;
  source: string;
  postedDate: Date | string | null;
  salary: string | null;
  hiringManagerName: string | null;
  hiringManagerEmail: string | null;
  hiringManagerTitle: string | null;
  processed: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  resumeId: string | null;
}

export interface SearchJobsParams {
  jobTitle: string;
  location?: string;
  sources?: string[];
  resumeId?: string;
}

class JobSearchService {
  /**
   * Get all available job sources
   */
  async getJobSources(): Promise<JobSource[]> {
    try {
      const response = await fetch('/api/job-sources');
      if (!response.ok) {
        throw new Error('Failed to fetch job sources');
      }
      const data = await response.json();
      return data.jobSources || [];
    } catch (error) {
      console.error('Error fetching job sources:', error);
      return [];
    }
  }

  /**
   * Toggle a job source's enabled status
   */
  async toggleJobSource(id: number, enabled: boolean): Promise<JobSource | null> {
    try {
      const response = await fetch(`/api/job-sources/${id}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle job source');
      }
      
      const data = await response.json();
      return data.jobSource;
    } catch (error) {
      console.error('Error toggling job source:', error);
      return null;
    }
  }

  /**
   * Search for jobs based on criteria
   */
  async searchJobs({ jobTitle, location, sources, resumeId }: SearchJobsParams): Promise<Job[]> {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (jobTitle) params.append('title', jobTitle);
      if (location) params.append('location', location);
      if (resumeId) params.append('resumeId', resumeId);
      if (sources && sources.length > 0) {
        sources.forEach(source => params.append('sources', source));
      }
      
      const response = await fetch(`/api/jobs/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to search jobs');
      }
      
      const data = await response.json();
      return data.jobs || [];
    } catch (error) {
      console.error('Error searching jobs:', error);
      return [];
    }
  }

  /**
   * Get job details by ID
   */
  async getJobById(id: string): Promise<Job | null> {
    try {
      const response = await fetch(`/api/jobs/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch job details');
      }
      
      const data = await response.json();
      return data.job;
    } catch (error) {
      console.error('Error fetching job details:', error);
      return null;
    }
  }
}

export const jobSearchService = new JobSearchService();
export default jobSearchService;