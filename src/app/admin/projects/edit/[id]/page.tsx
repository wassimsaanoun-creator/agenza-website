"use client";

import { use } from "react";
import AdminShell from "@/components/admin/AdminShell";
import ProjectEditor from "@/components/admin/ProjectEditor";

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <AdminShell title="Edit Project">
      <ProjectEditor projectId={id} />
    </AdminShell>
  );
}
