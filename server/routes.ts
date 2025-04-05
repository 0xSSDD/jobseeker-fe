import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertResumeSchema, insertJobSchema } from "@shared/schema";
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
      const { jobTitle, location } = req.body;
      
      // In a real application, this would use the resume content to match with jobs
      // For this demo, we'll return mock job data that would normally be fetched from a job API
      
      // Short timeout to simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get jobs from storage
      const jobs = await storage.getJobs(jobTitle, location);
      
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

  const httpServer = createServer(app);
  return httpServer;
}
