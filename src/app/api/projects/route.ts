import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, and, desc, asc } from "drizzle-orm";

// GET published projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const division = searchParams.get("division");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");
    const slug = searchParams.get("slug");

    const conditions = [eq(schema.projects.status, "published")];
    
    if (division) {
      conditions.push(eq(schema.projects.division, division));
    }
    
    if (category) {
      conditions.push(eq(schema.projects.category, category));
    }
    
    if (featured === "true") {
      conditions.push(eq(schema.projects.featured, true));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // If slug is provided, get single project
    if (slug) {
      const project = await db.query.projects.findFirst({
        where: and(whereClause, eq(schema.projects.slug, slug)),
      });

      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }

      // Get project media
      const media = await db.query.projectMedia.findMany({
        where: eq(schema.projectMedia.projectId, project.id),
        orderBy: asc(schema.projectMedia.sortOrder),
      });

      return NextResponse.json({ project: { ...project, media } });
    }

    // Get multiple projects
    let projects = await db.query.projects.findMany({
      where: whereClause,
      orderBy: [
        desc(schema.projects.featured),
        asc(schema.projects.sortOrder),
        desc(schema.projects.createdAt),
      ],
    });

    // Apply limit if specified
    if (limit) {
      projects = projects.slice(0, parseInt(limit));
    }

    // Get media for each project
    const projectsWithMedia = await Promise.all(
      projects.map(async (project) => {
        const media = await db.query.projectMedia.findMany({
          where: eq(schema.projectMedia.projectId, project.id),
          orderBy: asc(schema.projectMedia.sortOrder),
        });
        return { ...project, media };
      })
    );

    return NextResponse.json({ projects: projectsWithMedia });
  } catch (error) {
    console.error("Get projects error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
