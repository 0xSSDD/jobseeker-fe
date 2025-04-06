import { Job } from './coverLetterService';
import { Resume } from '../models/Resume';

export interface JobSource {
  id: number;
  name: string;
  key: string;
  enabled: boolean;
  logo: string | null;
}

interface JobSearchParams {
  title: string;
  location: string;
  sources: string[];
  resume?: Resume;
}

/**
 * Service for searching job listings across multiple platforms
 */
class JobSearchService {
  
  /**
   * Search for job listings based on title, location and sources
   */
  async searchJobs({ title, location, sources, resume }: JobSearchParams): Promise<Job[]> {
    try {
      // In a real implementation, we would make API calls to different job sources
      // and compile the results. For this demo, we'll return mock data.
      
      // Mock API call response
      const response = await fetch('/api/jobs/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle: title,
          location,
          sources,
          resumeId: resume?.id
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to search jobs: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.jobs || [];
    } catch (error) {
      console.error('Error searching jobs:', error);
      return [];
    }
  }
  
  /**
   * Get available job sources
   */
  async getJobSources(): Promise<JobSource[]> {
    try {
      const response = await fetch('/api/job-sources');
      
      if (!response.ok) {
        throw new Error(`Failed to get job sources: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.jobSources || [];
    } catch (error) {
      console.error('Error getting job sources:', error);
      return [];
    }
  }
  
  /**
   * Toggle a job source on/off
   */
  async toggleJobSource(id: number, enabled: boolean): Promise<JobSource | null> {
    try {
      const response = await fetch(`/api/job-sources/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to toggle job source: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.jobSource || null;
    } catch (error) {
      console.error('Error toggling job source:', error);
      return null;
    }
  }
}

// Export a singleton instance
export default new JobSearchService();