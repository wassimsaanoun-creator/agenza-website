import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { asc } from "drizzle-orm";

// GET all testimonials
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const testimonials = await db.query.testimonials.findMany({
      orderBy: [asc(schema.testimonials.sortOrder)],
    });

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error("Get testimonials error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create new testimonial
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();

    const newTestimonial = await db.insert(schema.testimonials).values({
      ...body,
      status: body.status || "published",
      sortOrder: body.sortOrder || 0,
    }).returning();

    return NextResponse.json({ testimonial: newTestimonial[0] }, { status: 201 });
  } catch (error) {
    console.error("Create testimonial error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
