import { Resume, Job } from "@shared/schema";

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
  jobs: Job[];
  isSearching: boolean;
  error: string | null;
}

export interface DropzoneState {
  dragActive: boolean;
}
