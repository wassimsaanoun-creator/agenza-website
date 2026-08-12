"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/admin/AdminShell";

interface Media {
  id: string;
  projectId: string;
  fileUrl: string;
  fileType: string;
  filename: string;
  mimeType: string;
  createdAt: string;
}

export default function AdminMedia() {
  const [media, setMedia] = useState<Media[]>([]);
  const [uploading, setUploading] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => { load(); }, []);

  const load = async () => {
    const res = await fetch("/api/admin/media");
    if (res.ok) { const data = await res.json(); setMedia(data.media); }
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("projectId", "library");
      await fetch("/api/admin/media", { method: "POST", body: fd });
    }
    load();
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this file?")) return;
    await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    load();
  };

  const filtered = typeFilter === "all" ? media : media.filter((m) => m.fileType === typeFilter);

  return (
    <AdminShell title="Media Library" counts={{ media: media.length }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-electric">LIBRARY / MEDIA</span>
          <h2 className="mt-2 font-display font-semibold text-2xl text-agenza-white">All files</h2>
        </div>
        <label className="px-5 py-3 bg-electric text-obsidian font-medium rounded-[8px] cursor-pointer hover:brightness-110">
          {uploading ? "UPLOADING..." : "+ UPLOAD FILES"}
          <input type="file" multiple accept="image/*,video/mp4,.pdf" onChange={(e) => handleUpload(e.target.files)} className="hidden" disabled={uploading} />
        </label>
      </div>

      <div className="flex gap-2 mb-6">
        {["all", "image", "video", "document"].map((f) => (
          <button key={f} onClick={() => setTypeFilter(f)} className={`px-4 py-2 rounded-[8px] text-xs font-mono uppercase ${typeFilter === f ? "bg-electric text-obsidian" : "bg-graphite text-titanium border border-white/[0.08]"}`}>{f}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.length > 0 ? filtered.map((m) => (
          <div key={m.id} className="group relative bg-graphite border border-white/[0.08] rounded-[8px] overflow-hidden">
            <div className="aspect-square">
              {m.fileType === "image" ? (
                <img src={m.fileUrl} alt={m.filename} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-eng-grid-fine font-mono text-titanium text-xs">
                  {m.fileType === "video" ? "VIDEO" : "PDF"}
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={() => handleDelete(m.id)} className="font-mono text-[10px] px-3 py-1.5 bg-red-500/80 text-white rounded">DELETE</button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-obsidian to-transparent">
              <div className="font-mono text-[9px] text-titanium uppercase">{m.fileType}</div>
            </div>
          </div>
        )) : <div className="col-span-full py-16 text-center text-titanium">No media files yet</div>}
      </div>
    </AdminShell>
  );
}
