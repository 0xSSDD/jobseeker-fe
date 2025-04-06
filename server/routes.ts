import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertResumeSchema, insertJobSchema, insertJobSourceSchema } from "@shared/schema";
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
      
      // Save resume info to storage
      const resume = {
        userId: null, // No authentication in this demo
        filename,
        originalname,
        mimetype,
        size,
        uploadedAt: new Date().toISOString(),
        content: "", // In a real app, we'd parse the resume content here
      };

      // Validate the resume data
      const validatedResume = insertResumeSchema.parse(resume);
      
      // Save to storage
      const savedResume = await storage.saveResume(validatedResume);
      
      res.status(200).json({
        message: "Resume uploaded successfully",
        resume: {
          filename,
          originalname,
          mimetype,
          size,
        },
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
      const jobs = await storage.getJobs(jobTitle, location, sources);
      
      res.status(200).json({ jobs });
    } catch (error) {
      console.error("Job search error:", error);
      res.status(500).json({ error: "Failed to search for jobs" });
    }
  });

  // Get job details endpoint
  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const jobId = parseInt(req.params.id);
      const job = await storage.getJobById(jobId);
      
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
      
      // In a real app, we'd generate a cover letter using the resume and job data
      // For this demo, we'll just return a mock response
      
      // Short timeout to simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      res.status(200).json({
        coverLetter: {
          id: Math.floor(Math.random() * 10000),
          resumeId,
          jobId,
          content: "Dear Hiring Manager,\n\nI am writing to express my interest in the position at your company. With my skills and experience, I believe I would be a great fit for this role.\n\nSincerely,\nYour Name",
          filePath: "/coverletter-12345.pdf",
          createdAt: new Date().toISOString(),
        }
      });
    } catch (error) {
      console.error("Generate cover letter error:", error);
      res.status(500).json({ error: "Failed to generate cover letter" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
