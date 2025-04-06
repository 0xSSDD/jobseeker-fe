import { users, resumes, experiences, jobSources, jobListings, coverLetters, emailDrafts, applications, type User, type InsertUser, type Resume, type InsertResume, type Experience, type InsertExperience, type JobSource, type InsertJobSource, type JobListing, type InsertJobListing, type CoverLetter, type InsertCoverLetter } from "../shared/schema";
import { db } from "./db";
import { eq, like, ilike, and, or, inArray, desc } from "drizzle-orm";
import crypto from "crypto";

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
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Resume methods
  async saveResume(insertResume: InsertResume): Promise<Resume> {
    const [resume] = await db.insert(resumes).values(insertResume).returning();
    return resume;
  }

  async getResumeById(id: string): Promise<Resume | undefined> {
    const [resume] = await db.select().from(resumes).where(eq(resumes.id, id));
    return resume;
  }
  
  async getLatestResume(): Promise<Resume | undefined> {
    // Return the most recent resume
    const [resume] = await db.select().from(resumes).orderBy(desc(resumes.createdAt)).limit(1);
    return resume;
  }
  
  // Experience methods
  async saveExperience(insertExperience: InsertExperience): Promise<Experience> {
    const [experience] = await db.insert(experiences).values(insertExperience).returning();
    return experience;
  }
  
  async getExperiencesByResumeId(resumeId: string): Promise<Experience[]> {
    return await db.select().from(experiences).where(eq(experiences.resumeId, resumeId));
  }
  
  // Job methods
  async saveJobListing(insertJobListing: InsertJobListing): Promise<JobListing> {
    const [job] = await db.insert(jobListings).values(insertJobListing).returning();
    return job;
  }

  async getJobListings(jobTitle?: string, location?: string, sources?: string[]): Promise<JobListing[]> {
    let conditions = [];
    
    if (jobTitle) {
      conditions.push(ilike(jobListings.title, `%${jobTitle}%`));
    }
    
    if (location && location.trim() !== "") {
      conditions.push(ilike(jobListings.location, `%${location}%`));
    }
    
    if (sources && sources.length > 0) {
      conditions.push(inArray(jobListings.source, sources));
    }
    
    if (conditions.length > 0) {
      return await db.select().from(jobListings).where(and(...conditions));
    }
    
    return await db.select().from(jobListings);
  }

  async getJobListingById(id: string): Promise<JobListing | undefined> {
    const [job] = await db.select().from(jobListings).where(eq(jobListings.id, id));
    return job;
  }
  
  // Job source methods
  async getJobSources(): Promise<JobSource[]> {
    return await db.select().from(jobSources);
  }

  async toggleJobSource(id: number, enabled: boolean): Promise<JobSource> {
    const [updatedSource] = await db
      .update(jobSources)
      .set({ enabled })
      .where(eq(jobSources.id, id))
      .returning();
    
    if (!updatedSource) {
      throw new Error(`Job source with id ${id} not found`);
    }
    
    return updatedSource;
  }
  
  // Cover letter methods
  async saveCoverLetter(insertCoverLetter: InsertCoverLetter): Promise<CoverLetter> {
    const [coverLetter] = await db.insert(coverLetters).values(insertCoverLetter).returning();
    return coverLetter;
  }
  
  async getCoverLetterById(id: string): Promise<CoverLetter | undefined> {
    const [coverLetter] = await db.select().from(coverLetters).where(eq(coverLetters.id, id));
    return coverLetter;
  }
  
  async getCoverLettersByResumeId(resumeId: string): Promise<CoverLetter[]> {
    return await db.select().from(coverLetters).where(eq(coverLetters.resumeId, resumeId));
  }
  
  async getCoverLetterByJobId(jobId: string): Promise<CoverLetter | undefined> {
    const [coverLetter] = await db.select().from(coverLetters).where(eq(coverLetters.jobId, jobId));
    return coverLetter;
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
    const now = new Date();
    
    const resume: Resume = { 
      ...insertResume,
      id,
      createdAt: now,
      updatedAt: now
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
    
    // Sort by created date descending
    return resumes.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    })[0];
  }
  
  // Experience methods
  async saveExperience(insertExperience: InsertExperience): Promise<Experience> {
    const id = crypto.randomUUID();
    const now = new Date();
    
    const experience: Experience = {
      ...insertExperience,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    const resumeId = experience.resumeId;
    if (!this.experiences.has(resumeId)) {
      this.experiences.set(resumeId, []);
    }
    
    this.experiences.get(resumeId)?.push(experience);
    return experience;
  }
  
  async getExperiencesByResumeId(resumeId: string): Promise<Experience[]> {
    return this.experiences.get(resumeId) || [];
  }
  
  // Job methods
  async saveJobListing(insertJobListing: InsertJobListing): Promise<JobListing> {
    const id = crypto.randomUUID();
    const now = new Date();
    
    const job: JobListing = {
      ...insertJobListing,
      id,
      createdAt: now,
      updatedAt: now
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
    const now = new Date();
    
    const coverLetter: CoverLetter = {
      ...insertCoverLetter,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.coverLetters.set(id, coverLetter);
    return coverLetter;
  }
  
  async getCoverLetterById(id: string): Promise<CoverLetter | undefined> {
    return this.coverLetters.get(id);
  }
  
  async getCoverLettersByResumeId(resumeId: string): Promise<CoverLetter[]> {
    return Array.from(this.coverLetters.values()).filter(
      coverLetter => coverLetter.resumeId === resumeId
    );
  }
  
  async getCoverLetterByJobId(jobId: string): Promise<CoverLetter | undefined> {
    return Array.from(this.coverLetters.values()).find(
      coverLetter => coverLetter.jobId === jobId
    );
  }
  
  // Initialize with sample job sources
  private initializeJobSources() {
    const sources = [
      { id: this.jobSourceIdCounter++, name: 'LinkedIn', key: 'linkedin', enabled: true, logo: 'https://placehold.co/100x100/0077b5/ffffff?text=LI' },
      { id: this.jobSourceIdCounter++, name: 'Indeed', key: 'indeed', enabled: true, logo: 'https://placehold.co/100x100/2164f3/ffffff?text=IN' },
      { id: this.jobSourceIdCounter++, name: 'Glassdoor', key: 'glassdoor', enabled: false, logo: 'https://placehold.co/100x100/0caa41/ffffff?text=GD' },
      { id: this.jobSourceIdCounter++, name: 'ZipRecruiter', key: 'ziprecruiter', enabled: false, logo: 'https://placehold.co/100x100/5866eb/ffffff?text=ZR' },
      { id: this.jobSourceIdCounter++, name: 'Monster', key: 'monster', enabled: false, logo: 'https://placehold.co/100x100/6e32c9/ffffff?text=MO' },
    ];
    
    sources.forEach(source => {
      this.jobSources.set(source.id, source);
    });
  }

  // Initialize with sample jobs
  private initializeJobs() {
    const defaultResumeId = crypto.randomUUID();
    const sampleJobs: InsertJobListing[] = [
      {
        resumeId: defaultResumeId,
        title: "Frontend Developer",
        company: "TechFlow",
        location: "San Francisco, CA",
        description: "We're looking for a skilled Frontend Developer to join our growing team. You'll be responsible for building beautiful, responsive user interfaces using React and modern JavaScript.",
        requirements: ["React", "TypeScript", "CSS"],
        url: "https://example.com/apply",
        source: "linkedin",
        postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        salary: "$110,000 - $140,000",
        hiringManagerName: "Jane Smith",
        hiringManagerEmail: "jane@techflow.com",
        hiringManagerTitle: "Engineering Manager",
        processed: false
      },
      {
        resumeId: defaultResumeId,
        title: "Senior React Developer",
        company: "InnovateCorp",
        location: "New York, NY",
        description: "InnovateCorp is seeking an experienced React Developer to help build our next-generation web applications. You should have 4+ years of experience with React and deep knowledge of state management solutions.",
        requirements: ["React", "Redux", "Node.js"],
        url: "https://example.com/apply",
        source: "indeed",
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        salary: "$130,000 - $160,000",
        hiringManagerName: "John Doe",
        hiringManagerEmail: "john@innovatecorp.com",
        hiringManagerTitle: "CTO",
        processed: false
      },
      {
        resumeId: defaultResumeId,
        title: "Full Stack Developer",
        company: "GrowthLabs",
        location: "Remote",
        description: "Join our 100% remote team as a Full Stack Developer. We're building cutting-edge tools for startups. You should be comfortable with React, Node.js, and have experience with cloud services (AWS or GCP).",
        requirements: ["React", "Node.js", "AWS"],
        url: "https://example.com/apply",
        source: "linkedin",
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        salary: "$120,000 - $150,000",
        hiringManagerName: "Sarah Johnson",
        hiringManagerEmail: "sarah@growthlabs.com",
        hiringManagerTitle: "Head of Engineering",
        processed: false
      }
    ];
    
    // Add sample jobs to storage
    sampleJobs.forEach(job => {
      this.saveJobListing(job);
    });
  }
}

// Choose the appropriate storage implementation
// For development and testing: export const storage = new MemStorage();
// For production with database: export const storage = new DatabaseStorage();
export const storage = new DatabaseStorage();
