import { db } from "../db";
import * as schema from "../db/schema";
import { hashPassword } from "../lib/auth";

async function seed() {
  console.log("Seeding database...");

  // Create default admin user
  const existingUsers = await db.query.users.findMany();
  if (existingUsers.length === 0) {
    const passwordHash = await hashPassword("Admin123!");
    await db.insert(schema.users).values({
      email: "admin@agenza.com",
      passwordHash,
      role: "admin",
    });
    console.log("✓ Created admin user: admin@agenza.com");
  }

  // Create sample services
  const existingServices = await db.query.services.findMany();
  if (existingServices.length === 0) {
    const mechanicalServices = [
      { name: "CAD / 3D Modeling", description: "Professional 3D modeling and CAD design for product development." },
      { name: "Product Development", description: "End-to-end product development from concept to manufacturing." },
      { name: "CAD/CAM", description: "Computer-aided design and manufacturing solutions." },
      { name: "Injection Mold Design", description: "Precision mold design for plastic injection molding." },
      { name: "Engineering Calculations", description: "Structural analysis and engineering calculations." },
      { name: "Simulation", description: "FEA and CFD simulation for design validation." },
      { name: "Manufacturing Support", description: "Technical support for manufacturing processes." },
    ];

    const softwareServices = [
      { name: "Web Development", description: "Modern, responsive websites built with cutting-edge technologies." },
      { name: "Web Applications", description: "Custom web applications tailored to your business needs." },
      { name: "Business Systems", description: "Integrated business management systems and ERP solutions." },
      { name: "AI Automation", description: "Intelligent automation solutions powered by AI." },
      { name: "SaaS Development", description: "Scalable SaaS products from concept to launch." },
      { name: "Mobile Applications", description: "Native and cross-platform mobile app development." },
      { name: "Digital Transformation", description: "End-to-end digital transformation consulting and implementation." },
    ];

    for (const [index, service] of mechanicalServices.entries()) {
      await db.insert(schema.services).values({
        name: service.name,
        slug: service.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        division: "mechanical",
        description: service.description,
        status: "published",
        sortOrder: index,
      });
    }

    for (const [index, service] of softwareServices.entries()) {
      await db.insert(schema.services).values({
        name: service.name,
        slug: service.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        division: "software",
        description: service.description,
        status: "published",
        sortOrder: index,
      });
    }

    console.log("✓ Created sample services");
  }

  // Create sample testimonials
  const existingTestimonials = await db.query.testimonials.findMany();
  if (existingTestimonials.length === 0) {
    await db.insert(schema.testimonials).values([
      {
        name: "John Smith",
        company: "TechCorp Industries",
        position: "CTO",
        content: "AGENZA delivered exceptional results on our product development project. Their dual expertise in mechanical and digital was exactly what we needed.",
        rating: 5,
        status: "published",
      },
      {
        name: "Sarah Johnson",
        company: "InnovateLab",
        position: "Product Manager",
        content: "The team at AGENZA transformed our business processes with their automation solutions. Highly professional and results-driven.",
        rating: 5,
        status: "published",
      },
    ]);
    console.log("✓ Created sample testimonials");
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);
