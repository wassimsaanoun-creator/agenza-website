import { MetadataRoute } from "next";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agenza.studio";

  const staticRoutes = ["", "/mechanical", "/software", "/projects", "/about", "/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const projects = await db.query.projects.findMany({
      where: eq(schema.projects.status, "published"),
    });
    projectRoutes = projects.map((p) => ({
      url: `${baseUrl}/projects/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {}

  return [...staticRoutes, ...projectRoutes];
}
