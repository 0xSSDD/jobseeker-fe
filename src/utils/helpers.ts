import { supabase } from '@/lib/supabase';
import { jobSearchService, coverLetterService } from '@/services';
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function for merging Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string into a readable format
 */
export function formatDate(dateString: string): string {
  if (!dateString) return 'Not specified';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format a salary string into a readable format
 */
export function formatSalary(salary: string | null): string {
  if (!salary) return 'Not specified';
  return salary;
}

/**
 * Upload a file to Supabase storage
 */
export async function uploadFile(file: File, bucket: string = 'resumes'): Promise<{ filePath: string; fileName: string }> {
  const fileExt = file.name.split('.').pop();
  const fileName = `file-${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);
  
  if (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
  
  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);
  
  return { 
    filePath: publicUrl,
    fileName 
  };
}

/**
 * Search for jobs using the job search service
 */
export async function searchJobs(title: string, location: string, sources: string[], resumeId?: string) {
  return jobSearchService.searchJobs(title, location, sources, resumeId);
}

/**
 * Generate a cover letter for a job
 */
export async function generateCoverLetter(jobId: string, resumeId: string) {
  return coverLetterService.generateCoverLetter(jobId, resumeId);
}

/**
 * Create a mailto link for Gmail
 */
export function createGmailLink(
  to: string,
  subject: string,
  body: string
): string {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}