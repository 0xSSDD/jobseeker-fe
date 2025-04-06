import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Supabase client setup
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Schema definitions for type safety
export const resumeSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid().nullable(),
  filename: z.string(),
  storage_path: z.string(),
  uploaded_at: z.string().datetime(),
  parsed_content: z.string().nullable(),
  skills: z.array(z.string()).nullable(),
});

export const coverLetterSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid().nullable(),
  job_id: z.string(),
  content: z.string(),
  created_at: z.string().datetime(),
});

export const jobSourceSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid().nullable(),
  source_name: z.string(),
  enabled: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Type definitions
export type Resume = z.infer<typeof resumeSchema>;
export type CoverLetter = z.infer<typeof coverLetterSchema>;
export type JobSource = z.infer<typeof jobSourceSchema>;

// Insert schema definitions
export const insertResumeSchema = resumeSchema.omit({ 
  id: true, 
  uploaded_at: true 
});

export const insertCoverLetterSchema = coverLetterSchema.omit({ 
  id: true, 
  created_at: true 
});

export const insertJobSourceSchema = jobSourceSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});

// Insert type definitions
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type InsertCoverLetter = z.infer<typeof insertCoverLetterSchema>;
export type InsertJobSource = z.infer<typeof insertJobSourceSchema>;

/**
 * Upload a resume file to Supabase storage
 */
export async function uploadResumeFile(file: File) {
  try {
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `resume-${Date.now()}.${fileExt}`;
    
    // Upload to the resumes bucket
    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(fileName, file);
      
    if (error) {
      throw error;
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('resumes')
      .getPublicUrl(fileName);
      
    return { filePath: publicUrl, fileName };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Upload a cover letter file to Supabase storage
 */
export async function uploadCoverLetterFile(content: string, jobId: string) {
  try {
    // Generate a unique filename
    const fileName = `cover-letter-${jobId}-${Date.now()}.txt`;
    
    // Convert string to Blob for upload
    const blob = new Blob([content], { type: 'text/plain' });
    
    // Upload to the cover_letters bucket
    const { data, error } = await supabase.storage
      .from('cover_letters')
      .upload(fileName, blob);
      
    if (error) {
      throw error;
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('cover_letters')
      .getPublicUrl(fileName);
      
    return { filePath: publicUrl, fileName };
  } catch (error) {
    console.error('Error uploading cover letter:', error);
    throw error;
  }
}