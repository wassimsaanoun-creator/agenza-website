import { randomUUID } from "crypto";
import { supabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase";

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
];

export const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
];

export const ALLOWED_FILE_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_DOCUMENT_TYPES,
  ...ALLOWED_VIDEO_TYPES,
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export interface UploadedFile {
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  fileType: "image" | "video" | "document";
}

function getFileType(mimeType: string): "image" | "video" | "document" {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  return "document";
}

function getExtension(mimeType: string): string {
  const extMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
    "application/pdf": "pdf",
    "video/mp4": "mp4",
    "video/webm": "webm",
  };
  return extMap[mimeType] || "bin";
}

export async function saveFile(
  buffer: Buffer,
  mimeType: string,
  originalName: string,
  subDir: string = "projects"
): Promise<UploadedFile> {
  const ext = getExtension(mimeType);
  const uuid = randomUUID();
  const filename = `${uuid}.${ext}`;
  const storagePath = `${subDir}/${filename}`;

  let uploadBuffer = buffer;

  // Optimize images with sharp before upload (best-effort — if sharp fails to load
  // or process, fall back to uploading the original buffer unmodified)
  if (mimeType.startsWith("image/") && mimeType !== "image/svg+xml") {
    try {
      const sharp = (await import("sharp")).default;
      const metadata = await sharp(buffer).metadata();
      if (metadata.width && metadata.width > 1920) {
        uploadBuffer = await sharp(buffer)
          .resize(1920, null, { withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toBuffer();
      } else {
        uploadBuffer = await sharp(buffer).toBuffer();
      }
    } catch {
      // If sharp fails to load or process (e.g. platform binary issue), upload original buffer
      uploadBuffer = buffer;
    }
  }

  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, uploadBuffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(storagePath);

  return {
    filename,
    originalName,
    url: publicUrlData.publicUrl,
    mimeType,
    size: uploadBuffer.length,
    fileType: getFileType(mimeType),
  };
}

export async function deleteFile(url: string): Promise<void> {
  try {
    // Extract storage path from the public URL
    // Public URLs look like: .../storage/v1/object/public/project-media/projects/xxxx.png
    const marker = `/object/public/${STORAGE_BUCKET}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) {
      console.error("Could not parse storage path from URL:", url);
      return;
    }
    const storagePath = url.substring(idx + marker.length);

    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .remove([storagePath]);

    if (error) {
      console.error("Error deleting file from Supabase:", error.message);
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .toLowerCase();
}

export function validateFile(
  mimeType: string,
  size: number
): { valid: boolean; error?: string } {
  if (!ALLOWED_FILE_TYPES.includes(mimeType)) {
    return {
      valid: false,
      error: `File type ${mimeType} is not allowed`,
    };
  }

  if (size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
}
