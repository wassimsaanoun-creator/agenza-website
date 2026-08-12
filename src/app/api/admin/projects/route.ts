import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

// GET all projects
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const division = searchParams.get("division");
    const status = searchParams.get("status");
    const featured = searchParams.get("featured");

    const conditions = [];
    if (division) conditions.push(eq(schema.projects.division, division));
    if (status) conditions.push(eq(schema.projects.status, status));
    if (featured !== null && featured !== undefined) conditions.push(eq(schema.projects.featured, featured === "true"));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const projects = await db.query.projects.findMany({
      where: whereClause,
      orderBy: [desc(schema.projects.createdAt)],
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Get projects error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create new project
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    
    // Generate slug from title if not provided
    let slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if slug already exists
    const existingProject = await db.query.projects.findFirst({
      where: eq(schema.projects.slug, slug),
    });

    if (existingProject) {
      slug = `${slug}-${Date.now()}`;
    }

    const newProject = await db.insert(schema.projects).values({
      ...body,
      slug,
      tools: body.tools || [],
      featured: body.featured || false,
      status: body.status || "draft",
      sortOrder: body.sortOrder || 0,
    }).returning();

    return NextResponse.json({ project: newProject[0] }, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
