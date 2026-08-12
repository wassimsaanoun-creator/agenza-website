import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, count } from "drizzle-orm";

// GET dashboard statistics
export async function GET() {
  try {
    await requireAuth();

    // Get project counts
    const allProjects = await db.query.projects.findMany();
    const totalProjects = allProjects.length;
    const mechanicalProjects = allProjects.filter(p => p.division === "mechanical").length;
    const softwareProjects = allProjects.filter(p => p.division === "software").length;
    const publishedProjects = allProjects.filter(p => p.status === "published").length;
    const draftProjects = allProjects.filter(p => p.status === "draft").length;
    const featuredProjects = allProjects.filter(p => p.featured).length;

    // Get lead counts by status
    const allLeads = await db.query.leads.findMany();
    const newLeads = allLeads.filter(l => l.status === "new").length;
    const contactedLeads = allLeads.filter(l => l.status === "contacted").length;
    const qualifiedLeads = allLeads.filter(l => l.status === "qualified").length;

    // Get services count
    const services = await db.query.services.findMany();
    const totalServices = services.length;

    // Get testimonials count
    const testimonials = await db.query.testimonials.findMany();
    const publishedTestimonials = testimonials.filter(t => t.status === "published").length;

    // Get recent activity
    const recentProjects = allProjects
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const recentLeads = allLeads
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return NextResponse.json({
      stats: {
        totalProjects,
        mechanicalProjects,
        softwareProjects,
        publishedProjects,
        draftProjects,
        featuredProjects,
        totalServices,
        publishedTestimonials,
        leads: {
          total: allLeads.length,
          new: newLeads,
          contacted: contactedLeads,
          qualified: qualifiedLeads,
        },
      },
      recentActivity: {
        projects: recentProjects,
        leads: recentLeads,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
