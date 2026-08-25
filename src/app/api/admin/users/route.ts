import { NextRequest, NextResponse } from "next/server";
import { requireAuth, hashPassword } from "@/lib/auth";
import { db } from "@/db";
import * as schema from "@/db/schema";

// GET all users
export async function GET() {
  try {
    await requireAuth();
    const allUsers = await db.query.users.findMany({
      columns: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        passwordHash: false,
      },
      orderBy: (users, { desc }) => [desc(users.createdAt)],
    });
    return NextResponse.json({ users: allUsers });
  } catch (error) {
    console.error("List users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create user
export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const existing = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });
    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const newUser = await db
      .insert(schema.users)
      .values({ email, passwordHash, role: role || "admin" })
      .returning({
        id: schema.users.id,
        email: schema.users.email,
        role: schema.users.role,
        createdAt: schema.users.createdAt,
      });

    return NextResponse.json({ user: newUser[0] }, { status: 201 });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
