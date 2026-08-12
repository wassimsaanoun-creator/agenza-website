import { NextRequest, NextResponse } from "next/server";
import { hashPassword, verifyPassword, createSession, setSessionCookie } from "@/lib/auth";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

const DEFAULT_ADMIN_EMAIL = "admin@agenza.com";
const DEFAULT_ADMIN_PASSWORD = "Admin123!";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if any users exist, if not create default admin
    const existingUsers = await db.query.users.findMany();
    
    if (existingUsers.length === 0) {
      const passwordHash = await hashPassword(DEFAULT_ADMIN_PASSWORD);
      await db.insert(schema.users).values({
        email: DEFAULT_ADMIN_EMAIL,
        passwordHash,
        role: "admin",
      });
      console.log("Default admin user created. Email:", DEFAULT_ADMIN_EMAIL);
    }

    // Find user by email
    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session
    const token = await createSession(user.id);
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
