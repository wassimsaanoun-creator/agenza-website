import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { saveFile, validateFile, ALLOWED_FILE_TYPES } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form fields
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const company = formData.get("company") as string;
    const website = formData.get("website") as string;
    const country = formData.get("country") as string;
    const division = formData.get("division") as string;
    const service = formData.get("service") as string;
    const description = formData.get("description") as string;
    const timeline = formData.get("timeline") as string;
    const budget = formData.get("budget") as string;

    // Validate required fields
    if (!name || !email || !description || !division) {
      return NextResponse.json(
        { error: "Name, email, description, and division are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create lead
    const newLead = await db.insert(schema.leads).values({
      name,
      email,
      phone: phone || null,
      company: company || null,
      website: website || null,
      country: country || null,
      division,
      service: service || null,
      description,
      timeline: timeline || null,
      budget: budget || null,
      status: "new",
      source: "website",
    }).returning();

    // Handle file uploads if any
    const files = formData.getAll("files") as File[];
    if (files && files.length > 0) {
      for (const file of files) {
        if (file.size > 0) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const validation = validateFile(file.type, buffer.length);
          
          if (validation.valid) {
            const uploadedFile = await saveFile(buffer, file.type, file.name, "leads");
            
            await db.insert(schema.leadAttachments).values({
              leadId: newLead[0].id,
              fileUrl: uploadedFile.url,
              filename: uploadedFile.originalName,
              mimeType: uploadedFile.mimeType,
              fileSize: uploadedFile.size,
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your inquiry. We will contact you soon.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
