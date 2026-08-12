import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { saveFile, validateFile, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/storage";

// GET all media (optionally filtered by project)
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const fileType = searchParams.get("fileType");

    let whereClause;
    if (projectId) {
      whereClause = eq(schema.projectMedia.projectId, projectId);
    } else if (fileType) {
      whereClause = eq(schema.projectMedia.fileType, fileType);
    }

    const media = await db.query.projectMedia.findMany({
      where: whereClause,
      orderBy: [desc(schema.projectMedia.createdAt)],
    });

    return NextResponse.json({ media });
  } catch (error) {
    console.error("Get media error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST upload new media
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const projectId = formData.get("projectId") as string;
    const altText = formData.get("altText") as string;
    const caption = formData.get("caption") as string;
    const isCover = formData.get("isCover") === "true";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Validate file
    const buffer = Buffer.from(await file.arrayBuffer());
    const validation = validateFile(file.type, buffer.length);
    
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Save file
    const uploadedFile = await saveFile(buffer, file.type, file.name);

    // If isCover, unset other covers for this project
    if (isCover) {
      await db.update(schema.projectMedia)
        .set({ isCover: false })
        .where(eq(schema.projectMedia.projectId, projectId));
    }

    // Get max sort order
    const existingMedia = await db.query.projectMedia.findMany({
      where: eq(schema.projectMedia.projectId, projectId),
    });
    const maxSortOrder = existingMedia.reduce((max, m) => Math.max(max, m.sortOrder), -1);

    // Create media record
    const newMedia = await db.insert(schema.projectMedia).values({
      projectId,
      fileUrl: uploadedFile.url,
      fileType: uploadedFile.fileType,
      mimeType: uploadedFile.mimeType,
      filename: uploadedFile.filename,
      altText: altText || file.name,
      caption,
      sortOrder: maxSortOrder + 1,
      isCover,
    }).returning();

    return NextResponse.json({ media: newMedia[0], file: uploadedFile });
  } catch (error) {
    console.error("Upload media error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
