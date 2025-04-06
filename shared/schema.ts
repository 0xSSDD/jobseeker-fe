import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
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

// Resumes schema
export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id"),
  filename: text("filename").notNull(),
  originalname: text("originalname").notNull(),
  mimetype: text("mimetype").notNull(),
  size: integer("size").notNull(),
  uploaded_at: text("uploaded_at").notNull(),
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

// Jobs schema (renamed from job_listings to match existing schema)
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  description: text("description").notNull(),
  salary: text("salary"),
  posted_date: text("posted_date"),
  match_score: integer("match_score").default(0),
  apply_url: text("apply_url").notNull(),
  logo: text("logo"),
  source: text("source").default('linkedin'),
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
});

// Cover letters schema (renamed from coverletters to match existing schema)
export const coverLetters = pgTable("cover_letters", {
  id: serial("id").primaryKey(),
  resume_id: integer("resume_id").references(() => resumes.id),
  job_id: integer("job_id").references(() => jobs.id),
  content: text("content").notNull(),
  file_path: text("file_path"),
  created_at: text("created_at").notNull(),
});

export const insertCoverLetterSchema = createInsertSchema(coverLetters).omit({
  id: true,
});

// Export types
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
