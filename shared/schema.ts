import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users schema for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Resumes schema for file uploads
export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  filename: text("filename").notNull(),
  originalname: text("originalname").notNull(),
  mimetype: text("mimetype").notNull(),
  size: integer("size").notNull(),
  uploadedAt: text("uploaded_at").notNull(),
  content: text("content"),
});

export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
});

// Job sources schema
export const jobSources = pgTable("job_sources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  key: text("key").notNull().unique(),
  enabled: boolean("enabled").notNull().default(true),
  logo: text("logo"),
});

export const insertJobSourceSchema = createInsertSchema(jobSources).omit({
  id: true,
});

// Jobs schema
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  salary: text("salary"),
  postedDate: text("posted_date").notNull(),
  matchScore: integer("match_score"),
  applyUrl: text("apply_url"), // URL to apply for the job
  logo: text("logo"),
  source: text("source"), // Source of the job (linkedin, indeed, etc.)
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
});

// Cover letters schema
export const coverLetters = pgTable("cover_letters", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id"),
  jobId: integer("job_id"),
  content: text("content").notNull(),
  filePath: text("file_path"),
  createdAt: text("created_at").notNull(),
});

export const insertCoverLetterSchema = createInsertSchema(coverLetters).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;

export type InsertJobSource = z.infer<typeof insertJobSourceSchema>;
export type JobSource = typeof jobSources.$inferSelect;

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;

export type InsertCoverLetter = z.infer<typeof insertCoverLetterSchema>;
export type CoverLetter = typeof coverLetters.$inferSelect;
