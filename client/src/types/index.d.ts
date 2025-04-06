// Type definitions for the project

// pdf-parse module declaration
declare module 'pdf-parse' {
  function parse(buffer: Buffer): Promise<{
    text: string;
    numpages: number;
    info: any;
    metadata: any;
    version: string;
  }>;
  export = parse;
}

// Supabase types
export interface SupabaseResume {
  id: string;
  user_id: string | null;
  filename: string;
  storage_path: string;
  uploaded_at: string;
  parsed_content: string | null;
  skills: string[] | null;
}

export interface SupabaseExperience {
  id: string;
  resume_id: string;
  title: string;
  company: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
}

export interface SupabaseJobSource {
  id: string;
  user_id: string | null;
  source_name: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupabaseJobListing {
  id: string;
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

export interface SupabaseCoverLetter {
  id: string;
  user_id: string | null;
  job_id: string;
  content: string;
  created_at: string;
}