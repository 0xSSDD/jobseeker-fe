import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertResumeSchema, insertJobListingSchema as insertJobSchema, insertJobSourceSchema } from "../shared/schema";
import { z } from "zod";

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadsDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedMimeTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, DOCX, DOC, and TXT files are allowed.") as any);
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Upload resume endpoint
  app.post("/api/resume/upload", upload.single("resume"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Extract file information
      const { filename, originalname, mimetype, size } = req.file;
      
      // Normally we would parse the resume here using a service like Claude or GPT
      // For this demo, we'll just use sample data
      const resume = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "555-123-4567",
        filePath: `/uploads/${filename}`,
        latestRole: "Senior Developer",
        skills: ["JavaScript", "React", "Node.js", "TypeScript"]
      };

      // Validate the resume data
      const validatedResume = insertResumeSchema.parse(resume);
      
      // Save to storage
      const savedResume = await storage.saveResume(validatedResume);
      
      res.status(200).json({
        message: "Resume uploaded successfully",
        resume: savedResume
      });
    } catch (error) {
      console.error("Resume upload error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid resume data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to upload resume" });
    }
  });

  // Search jobs endpoint
  app.post("/api/jobs/search", async (req, res) => {
    try {
      const { jobTitle, location, sources } = req.body;
      
      // In a real application, this would use the resume content to match with jobs
      // For this demo, we'll return mock job data that would normally be fetched from a job API
      
      // Short timeout to simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get jobs from storage
      const jobs = await storage.getJobListings(jobTitle, location, sources);
      
      res.status(200).json({ jobs });
    } catch (error) {
      console.error("Job search error:", error);
      res.status(500).json({ error: "Failed to search for jobs" });
    }
  });

  // Get job details endpoint
  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const jobId = req.params.id;
      const job = await storage.getJobListingById(jobId);
      
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      
      res.status(200).json({ job });
    } catch (error) {
      console.error("Get job error:", error);
      res.status(500).json({ error: "Failed to get job details" });
    }
  });
  
  // Get job sources endpoint
  app.get("/api/job-sources", async (req, res) => {
    try {
      const jobSources = await storage.getJobSources();
      res.status(200).json({ jobSources });
    } catch (error) {
      console.error("Get job sources error:", error);
      res.status(500).json({ error: "Failed to get job sources" });
    }
  });
  
  // Toggle job source endpoint
  app.patch("/api/job-sources/:id", async (req, res) => {
    try {
      const jobSourceId = parseInt(req.params.id);
      const { enabled } = req.body;
      
      if (typeof enabled !== 'boolean') {
        return res.status(400).json({ error: "Enabled field must be a boolean" });
      }
      
      const updatedJobSource = await storage.toggleJobSource(jobSourceId, enabled);
      res.status(200).json({ jobSource: updatedJobSource });
    } catch (error) {
      console.error("Toggle job source error:", error);
      res.status(500).json({ error: "Failed to toggle job source" });
    }
  });
  
  // Generate cover letter endpoint
  app.post("/api/cover-letters/generate", async (req, res) => {
    try {
      const { resumeId, jobId } = req.body;
      
      if (!resumeId || !jobId) {
        return res.status(400).json({ error: "Resume ID and Job ID are required" });
      }
      
      // In a real app, we'd generate a cover letter using Claude or GPT
      // and the resume/job details
      
      // Get resume and job details
      const resume = await storage.getResumeById(resumeId);
      const job = await storage.getJobListingById(jobId);
      
      if (!resume || !job) {
        return res.status(404).json({ 
          error: !resume ? "Resume not found" : "Job not found" 
        });
      }
      
      // Short timeout to simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Insert cover letter into storage
      const coverLetterData = {
        resumeId,
        jobId,
        content: `Dear Hiring Manager at ${job.company},\n\nI am writing to express my interest in the ${job.title} position. With my background as a ${resume.latestRole} and skills in ${resume.skills.join(", ")}, I believe I would be a great fit for this role.\n\nI am particularly drawn to ${job.company} because of its innovative approach to solving challenges in the industry. The ${job.title} role aligns perfectly with my career goals and expertise.\n\nI look forward to discussing how my skills and experience can benefit your team.\n\nSincerely,\n${resume.name}`,
        filePath: `/cover-letters/${resumeId}-${jobId}.pdf`
      };
      
      const coverLetter = await storage.saveCoverLetter(coverLetterData);
      
      res.status(200).json({ coverLetter });
    } catch (error) {
      console.error("Generate cover letter error:", error);
      res.status(500).json({ error: "Failed to generate cover letter" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
