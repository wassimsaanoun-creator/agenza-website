import { db } from "./index";
import * as schema from "./schema";
import { eq, and, gt, asc, desc } from "drizzle-orm";

// Export query helpers for each table
export const users = {
  findFirst: (where: any) => db.query.users.findFirst({ where }),
  findById: (id: string) =>
    db.query.users.findFirst({ where: eq(schema.users.id, id) }),
  findByEmail: (email: string) =>
    db.query.users.findFirst({ where: eq(schema.users.email, email) }),
  insert: (values: any) => db.insert(schema.users).values(values),
  update: (id: string, values: any) =>
    db.update(schema.users).set(values).where(eq(schema.users.id, id)),
  delete: (id: string) =>
    db.delete(schema.users).where(eq(schema.users.id, id)),
};

export const projects = {
  findMany: (where?: any, orderBy?: any) => db.query.projects.findMany({ where, orderBy }),
  findFirst: (where: any) => db.query.projects.findFirst({ where }),
  findById: (id: string) =>
    db.query.projects.findFirst({ where: eq(schema.projects.id, id) }),
  insert: (values: any) => db.insert(schema.projects).values(values),
  update: (id: string, values: any) =>
    db.update(schema.projects).set(values).where(eq(schema.projects.id, id)),
  delete: (id: string) =>
    db.delete(schema.projects).where(eq(schema.projects.id, id)),
};

export const projectMedia = {
  findMany: (where?: any) => db.query.projectMedia.findMany({ where }),
  findByProjectId: (projectId: string) =>
    db.query.projectMedia.findMany({
      where: eq(schema.projectMedia.projectId, projectId),
      orderBy: asc(schema.projectMedia.sortOrder),
    }),
  insert: (values: any) => db.insert(schema.projectMedia).values(values),
  update: (id: string, values: any) =>
    db.update(schema.projectMedia).set(values).where(eq(schema.projectMedia.id, id)),
  delete: (id: string) =>
    db.delete(schema.projectMedia).where(eq(schema.projectMedia.id, id)),
  deleteByProjectId: (projectId: string) =>
    db.delete(schema.projectMedia).where(eq(schema.projectMedia.projectId, projectId)),
};

export const services = {
  findMany: (where?: any, orderBy?: any) => db.query.services.findMany({ where, orderBy }),
  findFirst: (where: any) => db.query.services.findFirst({ where }),
  findById: (id: string) =>
    db.query.services.findFirst({ where: eq(schema.services.id, id) }),
  insert: (values: any) => db.insert(schema.services).values(values),
  update: (id: string, values: any) =>
    db.update(schema.services).set(values).where(eq(schema.services.id, id)),
  delete: (id: string) =>
    db.delete(schema.services).where(eq(schema.services.id, id)),
};

export const testimonials = {
  findMany: (where?: any, orderBy?: any) => db.query.testimonials.findMany({ where, orderBy }),
  findFirst: (where: any) => db.query.testimonials.findFirst({ where }),
  findById: (id: string) =>
    db.query.testimonials.findFirst({ where: eq(schema.testimonials.id, id) }),
  insert: (values: any) => db.insert(schema.testimonials).values(values),
  update: (id: string, values: any) =>
    db.update(schema.testimonials).set(values).where(eq(schema.testimonials.id, id)),
  delete: (id: string) =>
    db.delete(schema.testimonials).where(eq(schema.testimonials.id, id)),
};

export const leads = {
  findMany: (where?: any, orderBy?: any) => db.query.leads.findMany({ where, orderBy }),
  findFirst: (where: any) => db.query.leads.findFirst({ where }),
  findById: (id: string) =>
    db.query.leads.findFirst({ where: eq(schema.leads.id, id) }),
  insert: (values: any) => db.insert(schema.leads).values(values),
  update: (id: string, values: any) =>
    db.update(schema.leads).set(values).where(eq(schema.leads.id, id)),
  delete: (id: string) =>
    db.delete(schema.leads).where(eq(schema.leads.id, id)),
};

export const sessions = {
  findFirst: (where: any) => db.query.sessions.findFirst({ where }),
  insert: (values: any) => db.insert(schema.sessions).values(values),
  delete: (where: any) => db.delete(schema.sessions).where(where),
};

export const adminActivity = {
  findMany: (where?: any, orderBy?: any) => db.query.adminActivity.findMany({ where, orderBy }),
  insert: (values: any) => db.insert(schema.adminActivity).values(values),
};

export const projectCategories = {
  findMany: (where?: any, orderBy?: any) => db.query.projectCategories.findMany({ where, orderBy }),
  findFirst: (where: any) => db.query.projectCategories.findFirst({ where }),
  insert: (values: any) => db.insert(schema.projectCategories).values(values),
  update: (id: string, values: any) =>
    db.update(schema.projectCategories).set(values).where(eq(schema.projectCategories.id, id)),
  delete: (id: string) =>
    db.delete(schema.projectCategories).where(eq(schema.projectCategories.id, id)),
};
