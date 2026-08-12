import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";

// GET published services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const division = searchParams.get("division");
    const slug = searchParams.get("slug");

    const conditions = [eq(schema.services.status, "published")];
    
    if (division) {
      conditions.push(eq(schema.services.division, division));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // If slug is provided, get single service
    if (slug) {
      const service = await db.query.services.findFirst({
        where: whereClause ? and(whereClause, eq(schema.services.slug, slug)) : eq(schema.services.slug, slug),
      });

      if (!service) {
        return NextResponse.json(
          { error: "Service not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ service });
    }

    // Get multiple services
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
