import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single testimonial
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const { id } = await params;

    const testimonial = await db.query.testimonials.findFirst({
      where: eq(schema.testimonials.id, id),
    });

    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ testimonial });
  } catch (error) {
    console.error("Get testimonial error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update testimonial
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();

    const updatedTestimonial = await db
      .update(schema.testimonials)
      .set(body)
      .where(eq(schema.testimonials.id, id))
      .returning();

    if (!updatedTestimonial[0]) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ testimonial: updatedTestimonial[0] });
  } catch (error) {
    console.error("Update testimonial error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE testimonial
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const { id } = await params;

    await db.delete(schema.testimonials).where(eq(schema.testimonials.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete testimonial error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
