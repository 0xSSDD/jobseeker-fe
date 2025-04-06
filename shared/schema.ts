import { pgTable, text, serial, integer, boolean, json, timestamp, uuid, primaryKey } from "drizzle-orm/pg-core";
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
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  filePath: text("file_path").notNull(),
  latestRole: text("latest_role").notNull(),
  skills: text("skills").array().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Experiences schema
export const experiences = pgTable("experiences", {
  id: uuid("id").defaultRandom().primaryKey(),
  resumeId: uuid("resume_id").references(() => resumes.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  company: text("company").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const insertExperienceSchema = createInsertSchema(experiences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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

// Job listings schema
export const jobListings = pgTable("job_listings", {
  id: uuid("id").defaultRandom().primaryKey(),
  resumeId: uuid("resume_id").references(() => resumes.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  description: text("description").notNull(),
  requirements: text("requirements").array(),
  url: text("url").notNull(),
  source: text("source").default('linkedin'),
  postedDate: timestamp("posted_date", { withTimezone: true }),
  salary: text("salary"),
  hiringManagerName: text("hiring_manager_name"),
  hiringManagerEmail: text("hiring_manager_email"),
  hiringManagerTitle: text("hiring_manager_title"),
  processed: boolean("processed").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const insertJobListingSchema = createInsertSchema(jobListings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Cover letters schema
export const coverLetters = pgTable("coverletters", {
  id: uuid("id").defaultRandom().primaryKey(),
  resumeId: uuid("resume_id").references(() => resumes.id, { onDelete: 'cascade' }),
  jobId: uuid("job_id").references(() => jobListings.id, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  filePath: text("file_path").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const insertCoverLetterSchema = createInsertSchema(coverLetters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Email drafts schema
export const emailDrafts = pgTable("email_drafts", {
  id: uuid("id").defaultRandom().primaryKey(),
  resumeId: uuid("resume_id").references(() => resumes.id, { onDelete: 'cascade' }),
  jobId: uuid("job_id").references(() => jobListings.id, { onDelete: 'cascade' }),
  coverLetterId: uuid("cover_letter_id").references(() => coverLetters.id, { onDelete: 'cascade' }),
  subject: text("subject").notNull(),
  recipient: text("recipient").notNull(),
  body: text("body").notNull(),
  sent: boolean("sent").default(false),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const insertEmailDraftSchema = createInsertSchema(emailDrafts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Applications schema
export const applications = pgTable("applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  resumeId: uuid("resume_id").references(() => resumes.id, { onDelete: 'cascade' }),
  jobId: uuid("job_id").references(() => jobListings.id, { onDelete: 'cascade' }),
  coverLetterId: uuid("cover_letter_id").references(() => coverLetters.id),
  emailDraftId: uuid("email_draft_id").references(() => emailDrafts.id),
  status: text("status").notNull(),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;

export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Experience = typeof experiences.$inferSelect;

export type InsertJobSource = z.infer<typeof insertJobSourceSchema>;
export type JobSource = typeof jobSources.$inferSelect;

export type InsertJobListing = z.infer<typeof insertJobListingSchema>;
export type JobListing = typeof jobListings.$inferSelect;

export type InsertCoverLetter = z.infer<typeof insertCoverLetterSchema>;
export type CoverLetter = typeof coverLetters.$inferSelect;

export type InsertEmailDraft = z.infer<typeof insertEmailDraftSchema>;
export type EmailDraft = typeof emailDrafts.$inferSelect;

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;
