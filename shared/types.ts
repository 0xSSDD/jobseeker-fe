// shared/types.ts - Consolidated types
export interface User {
  id: number;
  username: string;
  password: string;
}

// Basic file upload representation
export interface UploadedFile {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  id?: string;
  user_id?: string | null;
  storage_path?: string;
  uploaded_at?: string;
  parsed_content?: string | null;
  skills?: string[] | null;
  file_path?: string;
  name?: string;
  email?: string | null;
  phone?: string | null;
}

// Education for resumes
export interface Education {
  institution: string;
  degree: string;
  field?: string;
  startDate?: string;
  endDate?: string;
}

// Experience record - consolidated both versions
export interface Experience {
  id?: string;
  resume_id?: string;
  title: string;
  company: string;
  start_date?: string;
  end_date?: string | null;
  startDate?: string;
  endDate?: string;
  description?: string | null;
}

// Full resume - complete user profile
export interface Resume {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  user_id?: string | null;
  filename?: string;
  storage_path?: string;
  file_path: string;
  uploaded_at?: string;
  parsed_content?: string | null;
  skills: string[];
  experiences?: Experience[];
  education?: Education[];
  summary?: string;
  latestRole?: Experience;
  created_at?: string;
  updated_at?: string;
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

// Insert interfaces for database operations
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

// Client-specific types
export type CurrentStep = "upload" | "search" | "loading" | "results";

export interface JobSearchState {
  currentStep: CurrentStep;
  resume: UploadedFile | null; // Using UploadedFile to be consistent with components
  jobTitle: string;
  location: string;
  jobs: JobListing[];
  isSearching: boolean;
  error: string | null;
  jobSources: string[];
}

export interface DropzoneState {
  dragActive: boolean;
}