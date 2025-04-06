// shared/types.ts - Replace for schema.ts
export interface User {
  id: number;
  username: string;
  password: string;
}

export interface Resume {
  id: string;
  name: string;
  email: string;
  phone: string;
  user_id: string | null;
  filename: string;
  storage_path: string;
  uploaded_at: string;
  parsed_content: string | null;
  skills: string[] | null;
}

export interface Experience {
  id: string;
  resume_id: string;
  title: string;
  company: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
}

export interface JobSource {
  id: string;
  user_id: string | null;
  source_name: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobListing {
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
  logo?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CoverLetter {
  id: string;
  user_id: string | null;
  job_id: string;
  content: string;
  created_at: string;
}

// Add insertion interfaces as well
export interface InsertUser {
  username: string;
  password: string;
}

export interface InsertResume {
  user_id?: string | null;
  filename: string;
  storage_path: string;
  parsed_content?: string | null;
  skills?: string[] | null;
}

export interface InsertJobSource {
  user_id?: string | null;
  source_name: string;
  enabled?: boolean;
}

export interface InsertJobListing {
  title: string;
  company: string;
  location?: string | null;
  description: string;
  requirements?: string[] | null;
  url: string;
  source?: string;
  posted_date?: string | null;
  salary?: string | null;
  hiring_manager_name?: string | null;
  hiring_manager_email?: string | null;
  hiring_manager_title?: string | null;
  processed?: boolean;
}

export interface InsertCoverLetter {
  user_id?: string | null;
  job_id: string;
  content: string;
}

// Export types
