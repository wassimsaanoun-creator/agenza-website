import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

// Users table for admin authentication
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Projects table
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  division: text("division").notNull(), // "mechanical" or "software"
  category: text("category").notNull(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description"),
  client: text("client"),
  industry: text("industry"),
  year: integer("year"),
  location: text("location"),
  challenge: text("challenge"),
  solution: text("solution"),
  process: text("process"),
  results: text("results"),
  tools: jsonb("tools").$type<string[]>().default([]),
  featured: boolean("featured").notNull().default(false),
  status: text("status").notNull().default("draft"), // "draft" or "published"
  sortOrder: integer("sort_order").default(0),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Project media table
export const projectMedia = pgTable("project_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(), // "image" or "video" or "document"
  mimeType: text("mime_type").notNull(),
  filename: text("filename").notNull(),
  altText: text("alt_text"),
  caption: text("caption"),
  sortOrder: integer("sort_order").notNull().default(0),
  isCover: boolean("is_cover").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Services table
export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  division: text("division").notNull(), // "mechanical" or "software"
  description: text("description").notNull(),
  content: text("content"),
  icon: text("icon"),
  imageUrl: text("image_url"),
  benefits: jsonb("benefits").$type<string[]>().default([]),
  processSteps: jsonb("process_steps").$type<string[]>().default([]),
  status: text("status").notNull().default("published"),
  sortOrder: integer("sort_order").default(0),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Testimonials table
export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  company: text("company"),
  position: text("position"),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  rating: integer("rating").default(5),
  status: text("status").notNull().default("published"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Leads table
export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  website: text("website"),
  country: text("country"),
  division: text("division").notNull(),
  service: text("service"),
  description: text("description").notNull(),
  timeline: text("timeline"),
  budget: text("budget"),
  status: text("status").notNull().default("new"), // new, contacted, qualified, meeting, proposal, won, lost
  source: text("source").default("website"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Lead attachments table
export const leadAttachments = pgTable("lead_attachments", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id")
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),
  fileUrl: text("file_url").notNull(),
  filename: text("filename").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Admin activity log table
export const adminActivity = pgTable("admin_activity", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminId: uuid("admin_id").notNull(),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: uuid("entity_id"),
  details: jsonb("details"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Sessions table for authentication
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Project categories table (for dynamic categories)
export const projectCategories = pgTable("project_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  division: text("division").notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
