import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

// POST reorder media items
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const { projectId, mediaOrder } = body;

    if (!projectId || !Array.isArray(mediaOrder)) {
      return NextResponse.json(
        { error: "Project ID and media order array are required" },
        { status: 400 }
      );
    }

    // Update sort order for each media item
    await Promise.all(
      mediaOrder.map((item: { id: string; sortOrder: number }, index: number) =>
        db.update(schema.projectMedia)
          .set({ sortOrder: index })
          .where(eq(schema.projectMedia.id, item.id))
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reorder media error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
