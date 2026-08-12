import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// GET all leads
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const division = searchParams.get("division");

    let whereClause;
    if (status || division) {
      const conditions = [];
      if (status) conditions.push(eq(schema.leads.status, status));
      if (division) conditions.push(eq(schema.leads.division, division));
      whereClause = conditions.length > 0 ? eq(conditions[0], conditions[0]) : undefined; // Simplified
    }

    const leads = await db.query.leads.findMany({
      where: whereClause,
      orderBy: [desc(schema.leads.createdAt)],
    });

    return NextResponse.json({ leads });
  } catch (error) {
    console.error("Get leads error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
