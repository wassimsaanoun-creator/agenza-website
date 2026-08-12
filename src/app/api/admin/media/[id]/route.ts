import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { deleteFile } from "@/lib/storage";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single media item
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const { id } = await params;

    const media = await db.query.projectMedia.findFirst({
      where: eq(schema.projectMedia.id, id),
    });

    if (!media) {
      return NextResponse.json(
        { error: "Media not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ media });
  } catch (error) {
    console.error("Get media error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update media
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();

    // If isCover is true, unset other covers for this project
    if (body.isCover === true && body.projectId) {
      await db.update(schema.projectMedia)
        .set({ isCover: false })
        .where(eq(schema.projectMedia.projectId, body.projectId));
    }

    const updatedMedia = await db
      .update(schema.projectMedia)
      .set({
        ...body,
        ...(body.projectId ? {} : { projectId: undefined }), // Don't allow changing projectId
      })
      .where(eq(schema.projectMedia.id, id))
      .returning();

    if (!updatedMedia[0]) {
      return NextResponse.json(
        { error: "Media not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ media: updatedMedia[0] });
  } catch (error) {
    console.error("Update media error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE media
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const { id } = await params;

    const media = await db.query.projectMedia.findFirst({
      where: eq(schema.projectMedia.id, id),
    });

    if (!media) {
      return NextResponse.json(
        { error: "Media not found" },
        { status: 404 }
      );
    }

    // Delete file from storage
    await deleteFile(media.fileUrl);

    // Delete database record
    await db.delete(schema.projectMedia).where(eq(schema.projectMedia.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete media error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
