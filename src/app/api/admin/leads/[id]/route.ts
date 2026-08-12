import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single lead
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const { id } = await params;

    const lead = await db.query.leads.findFirst({
      where: eq(schema.leads.id, id),
    });

    if (!lead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ lead });
  } catch (error) {
    console.error("Get lead error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update lead
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();

    const updatedLead = await db
      .update(schema.leads)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(schema.leads.id, id))
      .returning();

    if (!updatedLead[0]) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ lead: updatedLead[0] });
  } catch (error) {
    console.error("Update lead error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE lead
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const { id } = await params;

    // First delete associated attachments
    await db.delete(schema.leadAttachments).where(eq(schema.leadAttachments.leadId, id));

    // Then delete lead
    await db.delete(schema.leads).where(eq(schema.leads.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete lead error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
