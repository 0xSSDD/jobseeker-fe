import { Resume, JobListing } from "@shared/types";

export interface UploadedFile {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
}

export type CurrentStep = "upload" | "search" | "loading" | "results";

export interface JobSearchState {
  currentStep: CurrentStep;
  resume: UploadedFile | null;
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
