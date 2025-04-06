import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
});

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