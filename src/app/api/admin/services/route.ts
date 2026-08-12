import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";

// GET all services
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const division = searchParams.get("division");
    const status = searchParams.get("status");

    let whereClause;
    if (division || status) {
      whereClause = (services: any) => {
        const conditions = [];
        if (division) conditions.push(eq(services.division, division));
        if (status) conditions.push(eq(services.status, status));
        return conditions.length > 0 ? conditions.reduce((a: any, b: any) => eq(a, b)) : undefined;
      };
    }

    const services = await db.query.services.findMany({
      where: whereClause,
      orderBy: [asc(schema.services.sortOrder)],
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error("Get services error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create new service
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    
    // Generate slug from name if not provided
    let slug = body.slug || body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if slug already exists
    const existingService = await db.query.services.findFirst({
      where: eq(schema.services.slug, slug),
    });

    if (existingService) {
      slug = `${slug}-${Date.now()}`;
    }

    const newService = await db.insert(schema.services).values({
      ...body,
      slug,
      benefits: body.benefits || [],
      processSteps: body.processSteps || [],
      status: body.status || "published",
      sortOrder: body.sortOrder || 0,
    }).returning();

    return NextResponse.json({ service: newService[0] }, { status: 201 });
  } catch (error) {
    console.error("Create service error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
