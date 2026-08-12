"use client";

import AdminShell from "@/components/admin/AdminShell";
import ProjectEditor from "@/components/admin/ProjectEditor";

export default function NewProjectPage() {
  return (
    <AdminShell title="New Project">
      <ProjectEditor />
    </AdminShell>
  );
}
