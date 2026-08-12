import { promises as fs } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import sharp from "sharp";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");
const PROJECTS_DIR = join(UPLOAD_DIR, "projects");
const LEADS_DIR = join(UPLOAD_DIR, "leads");

// Ensure directories exist
async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

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
  await ensureDir(UPLOAD_DIR);
  
  const baseDir = subDir === "leads" ? LEADS_DIR : PROJECTS_DIR;
  await ensureDir(baseDir);

  const ext = getExtension(mimeType);
  const uuid = randomUUID();
  const filename = `${uuid}.${ext}`;
  const filepath = join(baseDir, filename);

  // Process images with sharp for optimization
  if (mimeType.startsWith("image/") && mimeType !== "image/svg+xml") {
    try {
      const metadata = await sharp(buffer).metadata();
      
      // Resize large images
      if (metadata.width && metadata.width > 1920) {
        await sharp(buffer)
          .resize(1920, null, { withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toFile(filepath);
      } else {
        await sharp(buffer).toFile(filepath);
      }
    } catch (error) {
      // If sharp fails, save original
      await fs.writeFile(filepath, buffer);
    }
  } else {
    await fs.writeFile(filepath, buffer);
  }

  // Get file size
  const stats = await fs.stat(filepath);

  return {
    filename,
    originalName,
    url: `/uploads/${subDir}/${filename}`,
    mimeType,
    size: stats.size,
    fileType: getFileType(mimeType),
  };
}

export async function deleteFile(url: string): Promise<void> {
  try {
    // Convert URL to file path
    const relativePath = url.replace("/uploads/", "");
    const filepath = join(UPLOAD_DIR, relativePath);
    await fs.unlink(filepath);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
}

export async function getFileBuffer(url: string): Promise<Buffer | null> {
  try {
    const relativePath = url.replace("/uploads/", "");
    const filepath = join(UPLOAD_DIR, relativePath);
    return await fs.readFile(filepath);
  } catch (error) {
    console.error("Error reading file:", error);
    return null;
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
