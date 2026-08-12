import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, asc } from "drizzle-orm";

// GET published testimonials
export async function GET() {
  try {
    const testimonials = await db.query.testimonials.findMany({
      where: eq(schema.testimonials.status, "published"),
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
