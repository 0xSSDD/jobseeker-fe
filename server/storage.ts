import { users, resumes, jobs, jobSources, coverLetters, type User, type InsertUser, type Resume, type InsertResume, type Job, type InsertJob, type JobSource, type CoverLetter, type InsertCoverLetter } from "@shared/schema";
import { db } from "./db";
import { eq, like, ilike, and, or, inArray } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Resume methods
  saveResume(resume: InsertResume): Promise<Resume>;
  getResumeByUserId(userId: number | null): Promise<Resume | undefined>;
  
  // Job methods
  saveJob(job: InsertJob): Promise<Job>;
  getJobs(jobTitle?: string, location?: string, sources?: string[]): Promise<Job[]>;
  getJobById(id: number): Promise<Job | undefined>;
  
  // Job source methods
  getJobSources(): Promise<JobSource[]>;
  toggleJobSource(id: number, enabled: boolean): Promise<JobSource>;
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

  async getResumeByUserId(userId: number | null): Promise<Resume | undefined> {
    if (userId) {
      const [resume] = await db.select().from(resumes).where(eq(resumes.userId, userId)).orderBy(resumes.id).limit(1);
      return resume;
    }
    // If no userId provided, return the most recent resume
    const [resume] = await db.select().from(resumes).orderBy(resumes.id).limit(1);
    return resume;
  }
  
  // Job methods
  async saveJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db.insert(jobs).values(insertJob).returning();
    return job;
  }

  async getJobs(jobTitle?: string, location?: string, sources?: string[]): Promise<Job[]> {
    let conditions = [];
    
    if (jobTitle) {
      conditions.push(ilike(jobs.title, `%${jobTitle}%`));
    }
    
    if (location) {
      conditions.push(ilike(jobs.location, `%${location}%`));
    }
    
    if (sources && sources.length > 0) {
      conditions.push(inArray(jobs.source, sources));
    }
    
    if (conditions.length > 0) {
      return await db.select().from(jobs).where(and(...conditions));
    }
    
    return await db.select().from(jobs);
  }

  async getJobById(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private resumes: Map<number, Resume>;
  private jobs: Map<number, Job>;
  private jobSources: Map<number, JobSource>;
  private userIdCounter: number;
  private resumeIdCounter: number;
  private jobIdCounter: number;
  private jobSourceIdCounter: number;

  constructor() {
    this.users = new Map();
    this.resumes = new Map();
    this.jobs = new Map();
    this.jobSources = new Map();
    this.userIdCounter = 1;
    this.resumeIdCounter = 1;
    this.jobIdCounter = 1;
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
    const id = this.resumeIdCounter++;
    const resume: Resume = { 
      ...insertResume, 
      id,
      userId: insertResume.userId || null,
      content: insertResume.content || null
    };
    this.resumes.set(id, resume);
    return resume;
  }
  
  async getResumeByUserId(userId: number | null): Promise<Resume | undefined> {
    return Array.from(this.resumes.values()).find(
      (resume) => resume.userId === userId
    );
  }
  
  // Job methods
  async saveJob(insertJob: InsertJob): Promise<Job> {
    const id = this.jobIdCounter++;
    const job: Job = {
      ...insertJob,
      id,
      salary: insertJob.salary || null,
      matchScore: insertJob.matchScore || null,
      applyUrl: insertJob.applyUrl || null,
      logo: insertJob.logo || null,
      source: insertJob.source || null
    };
    this.jobs.set(id, job);
    return job;
  }
  
  async getJobs(jobTitle?: string, location?: string, sources?: string[]): Promise<Job[]> {
    let filteredJobs = Array.from(this.jobs.values());
    
    if (jobTitle) {
      const titleLower = jobTitle.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(titleLower)
      );
    }
    
    if (location) {
      const locationLower = location.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(locationLower)
      );
    }
    
    if (sources && sources.length > 0) {
      filteredJobs = filteredJobs.filter(job => 
        job.source && sources.includes(job.source)
      );
    }
    
    return filteredJobs;
  }
  
  async getJobById(id: number): Promise<Job | undefined> {
    return this.jobs.get(id);
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
    const sampleJobs: InsertJob[] = [
      {
        title: "Frontend Developer",
        company: "TechFlow",
        location: "San Francisco, CA",
        description: "We're looking for a skilled Frontend Developer to join our growing team. You'll be responsible for building beautiful, responsive user interfaces using React and modern JavaScript.",
        salary: "$110,000 - $140,000",
        matchScore: 92,
        postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        applyUrl: "https://example.com/apply",
        logo: "https://placehold.co/100x100/4f46e5/ffffff?text=TF",
        source: "linkedin"
      },
      {
        title: "Senior React Developer",
        company: "InnovateCorp",
        location: "New York, NY",
        description: "InnovateCorp is seeking an experienced React Developer to help build our next-generation web applications. You should have 4+ years of experience with React and deep knowledge of state management solutions.",
        salary: "$130,000 - $160,000",
        matchScore: 88,
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        applyUrl: "https://example.com/apply",
        logo: "https://placehold.co/100x100/4f46e5/ffffff?text=IC",
        source: "indeed"
      },
      {
        title: "Full Stack Developer",
        company: "GrowthLabs",
        location: "Remote",
        description: "Join our 100% remote team as a Full Stack Developer. We're building cutting-edge tools for startups. You should be comfortable with React, Node.js, and have experience with cloud services (AWS or GCP).",
        salary: "$120,000 - $150,000",
        matchScore: 85,
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        applyUrl: "https://example.com/apply",
        logo: "https://placehold.co/100x100/4f46e5/ffffff?text=GL",
        source: "linkedin"
      },
      {
        title: "UI/UX Developer",
        company: "DesignFlex",
        location: "Austin, TX",
        description: "DesignFlex is looking for a UI/UX Developer who can combine beautiful designs with functional code. You should have a strong portfolio showing your design skills and coding abilities.",
        salary: "$95,000 - $120,000",
        matchScore: 78,
        postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        applyUrl: "https://example.com/apply",
        logo: "https://placehold.co/100x100/4f46e5/ffffff?text=DF",
        source: "linkedin"
      },
      {
        title: "JavaScript Engineer",
        company: "CodeNova",
        location: "Seattle, WA",
        description: "We're building the next generation of developer tools and need a talented JavaScript Engineer. Experience with compiler theory, ASTs, or static analysis tools is a plus but not required.",
        salary: "$125,000 - $155,000",
        matchScore: 90,
        postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        applyUrl: "https://example.com/apply",
        logo: "https://placehold.co/100x100/4f46e5/ffffff?text=CN",
        source: "indeed"
      },
      {
        title: "Frontend Architect",
        company: "ScaleUp",
        location: "Boston, MA",
        description: "ScaleUp is searching for a Frontend Architect to lead our UI engineering efforts. You'll set technical direction, establish best practices, and mentor junior developers while working on complex UI challenges.",
        salary: "$150,000 - $180,000",
        matchScore: 82,
        postedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
        applyUrl: "https://example.com/apply",
        logo: "https://placehold.co/100x100/4f46e5/ffffff?text=SU",
        source: "glassdoor"
      }
    ];
    
    // Add sample jobs to storage
    sampleJobs.forEach(job => {
      this.saveJob(job);
    });
  }
}

// Choose the appropriate storage implementation
// For development and testing: export const storage = new MemStorage();
// For production with database: export const storage = new DatabaseStorage();
export const storage = new DatabaseStorage();
