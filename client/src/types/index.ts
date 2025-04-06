export interface UploadedFile {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
}

export type CurrentStep = "upload" | "search" | "loading" | "results";

export interface JobSearchState {
  currentStep: CurrentStep;
  resume: Resume | null;
  jobTitle: string;
  location: string;
  jobs: Job[];
  isSearching: boolean;
  error: string | null;
  jobSources: string[];
}

export interface DropzoneState {
  dragActive: boolean;
}

export interface JobSource {
  id: number;
  name: string;
  key: string;
  enabled: boolean;
  logo: string | null;
}

export interface Resume {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  file_path: string;
  latest_role: string;
  skills: string[];
  created_at: string;
  updated_at: string;
}

export interface Job {
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

export interface CoverLetter {
  id: string;
  resume_id: string;
  job_id: string;
  content: string;
  file_path: string;
  created_at: string;
  updated_at: string;
}