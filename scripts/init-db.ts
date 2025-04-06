// Initialize database tables and seed data
import { db } from "../server/db";
import { users, resumes, jobs, jobSources, coverLetters } from "../shared/schema";
import { eq } from "drizzle-orm";

async function initDatabase() {
  console.log("Initializing database...");
  
  try {
    // Initialize job sources
    console.log("Seeding job sources...");
    const existingSources = await db.select().from(jobSources);
    
    if (existingSources.length === 0) {
      await db.insert(jobSources).values([
        { name: 'LinkedIn', key: 'linkedin', enabled: true, logo: 'https://placehold.co/100x100/0077b5/ffffff?text=LI' },
        { name: 'Indeed', key: 'indeed', enabled: true, logo: 'https://placehold.co/100x100/2164f3/ffffff?text=IN' },
        { name: 'Glassdoor', key: 'glassdoor', enabled: false, logo: 'https://placehold.co/100x100/0caa41/ffffff?text=GD' },
        { name: 'ZipRecruiter', key: 'ziprecruiter', enabled: false, logo: 'https://placehold.co/100x100/5866eb/ffffff?text=ZR' },
        { name: 'Monster', key: 'monster', enabled: false, logo: 'https://placehold.co/100x100/6e32c9/ffffff?text=MO' },
      ]);
      console.log("Job sources seeded successfully.");
    } else {
      console.log(`Found ${existingSources.length} existing job sources. Skipping seed.`);
    }
    
    // Initialize jobs
    console.log("Seeding jobs...");
    const existingJobs = await db.select().from(jobs);
    
    if (existingJobs.length === 0) {
      await db.insert(jobs).values([
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
      ]);
      console.log("Jobs seeded successfully.");
    } else {
      console.log(`Found ${existingJobs.length} existing jobs. Skipping seed.`);
    }
    
    console.log("Database initialization complete!");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

// Run the init function
initDatabase().then(() => {
  console.log("Exiting...");
  process.exit(0);
});