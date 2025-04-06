import { supabase } from './supabase';
import crypto from 'crypto';

// Type definitions to replace Drizzle's
export interface User {
  id: number;
  username: string;
  password: string;
}

export interface Resume {
  id: string;
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

// Insert interfaces
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

export interface InsertExperience {
  resume_id: string;
  title: string;
  company: string;
  start_date: string;
  end_date?: string | null;
  description?: string | null;
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

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Resume methods
  saveResume(resume: InsertResume): Promise<Resume>;
  getResumeById(id: string): Promise<Resume | undefined>;
  getLatestResume(): Promise<Resume | undefined>;

  // Experience methods
  saveExperience(experience: InsertExperience): Promise<Experience>;
  getExperiencesByResumeId(resumeId: string): Promise<Experience[]>;

  // Job methods
  saveJobListing(job: InsertJobListing): Promise<JobListing>;
  getJobListings(jobTitle?: string, location?: string, sources?: string[]): Promise<JobListing[]>;
  getJobListingById(id: string): Promise<JobListing | undefined>;

  // Job source methods
  getJobSources(): Promise<JobSource[]>;
  toggleJobSource(id: number, enabled: boolean): Promise<JobSource>;

  // Cover letter methods
  saveCoverLetter(coverLetter: InsertCoverLetter): Promise<CoverLetter>;
  getCoverLetterById(id: string): Promise<CoverLetter | undefined>;
  getCoverLettersByResumeId(resumeId: string): Promise<CoverLetter[]>;
  getCoverLetterByJobId(jobId: string): Promise<CoverLetter | undefined>;

  // New method
  updateResume(id: string, data: Partial<InsertResume>): Promise<Resume>;
}

// Database storage implementation using Supabase
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return data as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !data) return undefined;
    return data as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(insertUser)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  }

  // Resume methods
  async saveResume(insertResume: InsertResume): Promise<Resume> {
    const { data, error } = await supabase
      .from('resumes')
      .insert(insertResume)
      .select()
      .single();

    if (error) throw error;
    return data as Resume;
  }

  async getResumeById(id: string): Promise<Resume | undefined> {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return data as Resume;
  }

  async getLatestResume(): Promise<Resume | undefined> {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .order('uploaded_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return undefined;
    return data as Resume;
  }

  // Experience methods
  async saveExperience(insertExperience: InsertExperience): Promise<Experience> {
    const { data, error } = await supabase
      .from('experiences')
      .insert(insertExperience)
      .select()
      .single();

    if (error) throw error;
    return data as Experience;
  }

  async getExperiencesByResumeId(resumeId: string): Promise<Experience[]> {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('resume_id', resumeId);

    if (error) throw error;
    return data as Experience[];
  }

  // Job methods
  async saveJobListing(insertJobListing: InsertJobListing): Promise<JobListing> {
    const { data, error } = await supabase
      .from('job_listings')
      .insert(insertJobListing)
      .select()
      .single();

    if (error) throw error;
    return data as JobListing;
  }

  async getJobListings(jobTitle?: string, location?: string, sources?: string[]): Promise<JobListing[]> {
    let query = supabase
      .from('job_listings')
      .select('*');

    if (jobTitle) {
      query = query.ilike('title', `%${jobTitle}%`);
    }

    if (location && location.trim() !== "") {
      query = query.ilike('location', `%${location}%`);
    }

    if (sources && sources.length > 0) {
      query = query.in('source', sources);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as JobListing[];
  }

  async getJobListingById(id: string): Promise<JobListing | undefined> {
    const { data, error } = await supabase
      .from('job_listings')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return data as JobListing;
  }

  // Job source methods
  async getJobSources(): Promise<JobSource[]> {
    const { data, error } = await supabase
      .from('job_sources')
      .select('*');

    if (error) throw error;
    return data as JobSource[];
  }

  async toggleJobSource(id: number, enabled: boolean): Promise<JobSource> {
    const { data, error } = await supabase
      .from('job_sources')
      .update({ enabled })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Job source with id ${id} not found`);
    }

    return data as JobSource;
  }

  // Cover letter methods
  async saveCoverLetter(insertCoverLetter: InsertCoverLetter): Promise<CoverLetter> {
    const { data, error } = await supabase
      .from('cover_letters')
      .insert(insertCoverLetter)
      .select()
      .single();

    if (error) throw error;
    return data as CoverLetter;
  }

  async getCoverLetterById(id: string): Promise<CoverLetter | undefined> {
    const { data, error } = await supabase
      .from('cover_letters')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return data as CoverLetter;
  }

  async getCoverLettersByResumeId(resumeId: string): Promise<CoverLetter[]> {
    const { data, error } = await supabase
      .from('cover_letters')
      .select('*')
      .eq('resume_id', resumeId);

    if (error) throw error;
    return data as CoverLetter[];
  }

  async getCoverLetterByJobId(jobId: string): Promise<CoverLetter | undefined> {
    const { data, error } = await supabase
      .from('cover_letters')
      .select('*')
      .eq('job_id', jobId)
      .single();

    if (error || !data) return undefined;
    return data as CoverLetter;
  }

  // New method
  async updateResume(id: string, data: Partial<InsertResume>): Promise<Resume> {
    const { data: resumeData, error } = await supabase
      .from('resumes')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating resume:", error);
      throw error;
    }

    return resumeData;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private resumes: Map<string, Resume>;
  private experiences: Map<string, Experience[]>;
  private jobListings: Map<string, JobListing>;
  private jobSources: Map<number, JobSource>;
  private coverLetters: Map<string, CoverLetter>;
  private userIdCounter: number;
  private jobSourceIdCounter: number;

  constructor() {
    this.users = new Map();
    this.resumes = new Map();
    this.experiences = new Map();
    this.jobListings = new Map();
    this.jobSources = new Map();
    this.coverLetters = new Map();
    this.userIdCounter = 1;
    this.jobSourceIdCounter = 1;

    // Initialize with some sample job sources
    this.initializeJobSources();

    // Initialize with some sample jobs
    this.initializeJobs();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Resume methods
  async saveResume(insertResume: InsertResume): Promise<Resume> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const resume: Resume = {
      ...insertResume,
      id,
      uploaded_at: now,
      parsed_content: insertResume.parsed_content || null,
      skills: insertResume.skills || null,
      user_id: insertResume.user_id || null
    };

    this.resumes.set(id, resume);
    return resume;
  }

  async getResumeById(id: string): Promise<Resume | undefined> {
    return this.resumes.get(id);
  }

  async getLatestResume(): Promise<Resume | undefined> {
    const resumes = Array.from(this.resumes.values());
    if (resumes.length === 0) return undefined;

    // Sort by uploaded date descending
    return resumes.sort((a, b) => {
      const dateA = new Date(a.uploaded_at).getTime();
      const dateB = new Date(b.uploaded_at).getTime();
      return dateB - dateA;
    })[0];
  }

  // Experience methods
  async saveExperience(insertExperience: InsertExperience): Promise<Experience> {
    const id = crypto.randomUUID();

    const experience: Experience = {
      ...insertExperience,
      id,
      resume_id: insertExperience.resume_id,
      start_date: insertExperience.start_date,
      end_date: insertExperience.end_date || null,
      description: insertExperience.description || null
    };

    if (!this.experiences.has(experience.resume_id)) {
      this.experiences.set(experience.resume_id, []);
    }

    this.experiences.get(experience.resume_id)?.push(experience);
    return experience;
  }

  async getExperiencesByResumeId(resumeId: string): Promise<Experience[]> {
    return this.experiences.get(resumeId) || [];
  }

  // Job methods
  async saveJobListing(insertJobListing: InsertJobListing): Promise<JobListing> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const job: JobListing = {
      ...insertJobListing,
      id,
      created_at: now,
      updated_at: now,
      location: insertJobListing.location || null,
      requirements: insertJobListing.requirements || null,
      source: insertJobListing.source || "linkedin",
      posted_date: insertJobListing.posted_date || null,
      salary: insertJobListing.salary || null,
      hiring_manager_name: insertJobListing.hiring_manager_name || null,
      hiring_manager_email: insertJobListing.hiring_manager_email || null,
      hiring_manager_title: insertJobListing.hiring_manager_title || null,
      processed: insertJobListing.processed || false
    };

    this.jobListings.set(id, job);
    return job;
  }

  async getJobListings(jobTitle?: string, location?: string, sources?: string[]): Promise<JobListing[]> {
    let filteredJobs = Array.from(this.jobListings.values());

    if (jobTitle) {
      const titleLower = jobTitle.toLowerCase();
      filteredJobs = filteredJobs.filter(job =>
        job.title.toLowerCase().includes(titleLower)
      );
    }

    if (location && location.trim() !== "") {
      const locationLower = location.toLowerCase();
      filteredJobs = filteredJobs.filter(job =>
        job.location && job.location.toLowerCase().includes(locationLower)
      );
    }

    if (sources && sources.length > 0) {
      filteredJobs = filteredJobs.filter(job =>
        job.source && sources.includes(job.source)
      );
    }

    return filteredJobs;
  }

  async getJobListingById(id: string): Promise<JobListing | undefined> {
    return this.jobListings.get(id);
  }

  // Job source methods
  async getJobSources(): Promise<JobSource[]> {
    return Array.from(this.jobSources.values());
  }

  async toggleJobSource(id: number, enabled: boolean): Promise<JobSource> {
    const jobSource = this.jobSources.get(id);
    if (!jobSource) {
      throw new Error(`Job source with ID ${id} not found`);
    }

    const updatedJobSource = { ...jobSource, enabled };
    this.jobSources.set(id, updatedJobSource);
    return updatedJobSource;
  }

  // Cover letter methods
  async saveCoverLetter(insertCoverLetter: InsertCoverLetter): Promise<CoverLetter> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const coverLetter: CoverLetter = {
      ...insertCoverLetter,
      id,
      created_at: now,
      job_id: insertCoverLetter.job_id,
      user_id: insertCoverLetter.user_id || null
    };

    this.coverLetters.set(id, coverLetter);
    return coverLetter;
  }

  async getCoverLetterById(id: string): Promise<CoverLetter | undefined> {
    return this.coverLetters.get(id);
  }

  async getCoverLettersByResumeId(resumeId: string): Promise<CoverLetter[]> {
    return Array.from(this.coverLetters.values()).filter(
      coverLetter => resumeId === resumeId // We need to update this to match how resume IDs are linked to cover letters
    );
  }

  async getCoverLetterByJobId(jobId: string): Promise<CoverLetter | undefined> {
    return Array.from(this.coverLetters.values()).find(
      coverLetter => coverLetter.job_id === jobId
    );
  }

  // Initialize with sample job sources
  private initializeJobSources() {
    const now = new Date().toISOString();
    const sources = [
      {
        id: crypto.randomUUID(),
        user_id: null,
        source_name: 'LinkedIn',
        enabled: true,
        created_at: now,
        updated_at: now
      },
      {
        id: crypto.randomUUID(),
        user_id: null,
        source_name: 'Indeed',
        enabled: true,
        created_at: now,
        updated_at: now
      },
      {
        id: crypto.randomUUID(),
        user_id: null,
        source_name: 'Glassdoor',
        enabled: false,
        created_at: now,
        updated_at: now
      },
      {
        id: crypto.randomUUID(),
        user_id: null,
        source_name: 'ZipRecruiter',
        enabled: false,
        created_at: now,
        updated_at: now
      },
      {
        id: crypto.randomUUID(),
        user_id: null,
        source_name: 'Monster',
        enabled: false,
        created_at: now,
        updated_at: now
      },
    ];

    sources.forEach((source, index) => {
      this.jobSources.set(index + 1, source as any as JobSource);
    });
  }

  // Initialize with sample jobs
  private initializeJobs() {
    const now = new Date().toISOString();
    const sampleJobs = [
      {
        title: "Frontend Developer",
        company: "TechFlow",
        location: "San Francisco, CA",
        description: "We're looking for a skilled Frontend Developer to join our growing team. You'll be responsible for building beautiful, responsive user interfaces using React and modern JavaScript.",
        requirements: ["React", "TypeScript", "CSS"],
        url: "https://example.com/apply",
        source: "linkedin",
        posted_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        salary: "$110,000 - $140,000",
        hiring_manager_name: "Jane Smith",
        hiring_manager_email: "jane@techflow.com",
        hiring_manager_title: "Engineering Manager",
        processed: false,
        created_at: now,
        updated_at: now
      },
      {
        title: "Senior React Developer",
        company: "InnovateCorp",
        location: "New York, NY",
        description: "InnovateCorp is seeking an experienced React Developer to help build our next-generation web applications. You should have 4+ years of experience with React and deep knowledge of state management solutions.",
        requirements: ["React", "Redux", "Node.js"],
        url: "https://example.com/apply",
        source: "indeed",
        posted_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        salary: "$130,000 - $160,000",
        hiring_manager_name: "John Doe",
        hiring_manager_email: "john@innovatecorp.com",
        hiring_manager_title: "CTO",
        processed: false,
        created_at: now,
        updated_at: now
      },
      {
        title: "Full Stack Developer",
        company: "GrowthLabs",
        location: "Remote",
        description: "Join our 100% remote team as a Full Stack Developer. We're building cutting-edge tools for startups. You should be comfortable with React, Node.js, and have experience with cloud services.",
        requirements: ["React", "Node.js", "AWS"],
        url: "https://example.com/apply",
        source: "linkedin",
        posted_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        salary: "$120,000 - $150,000",
        hiring_manager_name: "Sarah Johnson",
        hiring_manager_email: "sarah@growthlabs.com",
        hiring_manager_title: "Head of Engineering",
        processed: false,
        created_at: now,
        updated_at: now
      }
    ];

    // Add sample jobs to storage
    sampleJobs.forEach(job => {
      const id = crypto.randomUUID();
      this.jobListings.set(id, { id, ...job } as any as JobListing);
    });
  }
}

// Choose the appropriate storage implementation
// For development and testing: export const storage = new MemStorage();
// For production with database: export const storage = new DatabaseStorage();
export const storage = new DatabaseStorage();
