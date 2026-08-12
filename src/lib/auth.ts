import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { randomUUID } from "crypto";

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string): Promise<string> {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await db.insert(schema.sessions).values({
    userId,
    token,
    expiresAt,
  });

  return token;
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return null;
  }

  // Verify session exists and is not expired
  const session = await db.query.sessions.findFirst({
    where: and(
      eq(schema.sessions.token, sessionCookie),
      gt(schema.sessions.expiresAt, new Date())
    ),
  });

  if (!session) {
    return null;
  }

  return session.userId;
}

export async function getCurrentUser() {
  const userId = await getSession();
  if (!userId) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, userId),
    columns: {
      id: true,
      email: true,
      role: true,
      passwordHash: false,
    },
  });

  return user || null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }
  return user;
}

export async function logout() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (sessionCookie) {
    await db.delete(schema.sessions).where(eq(schema.sessions.token, sessionCookie));
  }

  cookieStore.delete("session");
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: Math.floor(SESSION_DURATION / 1000),
    path: "/",
  });
}

