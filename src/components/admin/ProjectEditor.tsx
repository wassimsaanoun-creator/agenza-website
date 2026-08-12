"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const MECHANICAL_CATEGORIES = ["CAD", "CAD/CAM", "Product Development", "Mold Design", "Simulation", "Engineering", "Manufacturing"];
const SOFTWARE_CATEGORIES = ["Website", "Web Application", "SaaS", "AI Automation", "Business System", "Mobile App", "Digital Transformation"];

const TABS = [
  { id: "general", num: "01", label: "GENERAL" },
  { id: "casestudy", num: "02", label: "CASE STUDY" },
  { id: "media", num: "03", label: "MEDIA" },
  { id: "seo", num: "04", label: "SEO" },
  { id: "publish", num: "05", label: "PUBLISH" },
];

const inputClass = "w-full px-4 py-3 bg-obsidian border border-white/[0.08] rounded-[8px] text-agenza-white placeholder-titanium/40 font-body focus:outline-none focus:border-electric transition-colors";
const labelClass = "block font-mono text-[11px] tracking-[0.15em] uppercase text-titanium mb-2";

interface ProjectEditorProps {
  projectId?: string;
}

export default function ProjectEditor({ projectId }: ProjectEditorProps) {
  const router = useRouter();
  const isEdit = !!projectId;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [media, setMedia] = useState<any[]>([]);
  const [toolInput, setToolInput] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const [formData, setFormData] = useState({
    title: "", division: "mechanical", category: "CAD", shortDescription: "", fullDescription: "",
    client: "", industry: "", year: new Date().getFullYear(), location: "",
    challenge: "", solution: "", process: "", results: "",
    tools: [] as string[], featured: false, status: "draft",
    seoTitle: "", seoDescription: "",
  });

  useEffect(() => {
    if (projectId) {
      fetch(`/api/admin/projects/${projectId}`).then((r) => r.json()).then((data) => {
        if (data.project) {
          const p = data.project;
          setFormData({
            title: p.title || "", division: p.division || "mechanical", category: p.category || "CAD",
            shortDescription: p.shortDescription || "", fullDescription: p.fullDescription || "",
            client: p.client || "", industry: p.industry || "", year: p.year || new Date().getFullYear(),
            location: p.location || "", challenge: p.challenge || "", solution: p.solution || "",
            process: p.process || "", results: p.results || "", tools: p.tools || [],
            featured: p.featured || false, status: p.status || "draft",
            seoTitle: p.seoTitle || "", seoDescription: p.seoDescription || "",
          });
        }
      });
      loadMedia();
    }
  }, [projectId]);

  const loadMedia = async () => {
    if (!projectId) return;
    const res = await fetch(`/api/admin/media?projectId=${projectId}`);
    if (res.ok) { const data = await res.json(); setMedia(data.media); }
  };

  const categories = formData.division === "mechanical" ? MECHANICAL_CATEGORIES : SOFTWARE_CATEGORIES;

  const uploadFiles = async (files: FileList | File[], targetProjectId: string) => {
    setUploading(true);
    const uploaded: any[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("projectId", targetProjectId);
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      if (res.ok) { const data = await res.json(); uploaded.push(data.media); }
    }
    setUploading(false);
    return uploaded;
  };

  const handleFileUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    if (isEdit && projectId) {
      await uploadFiles(files, projectId);
      loadMedia();
    } else {
      const uploaded = await uploadFiles(files, "temp");
      setMedia((prev) => [...prev, ...uploaded]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) handleFileUpload(e.dataTransfer.files);
  };

  const deleteMedia = async (id: string) => {
    await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    setMedia((prev) => prev.filter((m) => m.id !== id));
  };

  const setCover = async (id: string) => {
    await fetch(`/api/admin/media/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCover: true, projectId: projectId || media.find((m) => m.id === id)?.projectId }),
    });
    if (isEdit) loadMedia();
    else setMedia((prev) => prev.map((m) => ({ ...m, isCover: m.id === id })));
  };

  const addTool = () => {
    if (toolInput.trim() && !formData.tools.includes(toolInput.trim())) {
      setFormData({ ...formData, tools: [...formData.tools, toolInput.trim()] });
      setToolInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await fetch(`/api/admin/projects/${projectId}`, {
          method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
        });
      } else {
        const res = await fetch("/api/admin/projects", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
        });
        const data = await res.json();
        const newId = data.project.id;
        for (const m of media) {
          await fetch(`/api/admin/media/${m.id}`, {
            method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectId: newId }),
          });
        }
      }
      router.push("/admin/projects");
    } catch (error) {
      alert("Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/projects" className="font-mono text-[11px] tracking-[0.15em] text-titanium hover:text-electric">← PROJECTS</Link>
          <h2 className="mt-2 font-display font-semibold text-2xl text-agenza-white">
            {isEdit ? "Edit project" : "New project"}
          </h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-white/[0.08] overflow-x-auto">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition-all ${activeTab === tab.id ? "border-electric text-electric" : "border-transparent text-titanium hover:text-agenza-white"}`}>
            <span className="font-mono text-[10px]">{tab.num}</span>
            <span className="font-mono text-[11px] tracking-[0.1em]">{tab.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {activeTab === "general" && (
          <div className="bg-graphite border border-white/[0.08] rounded-[12px] p-6 md:p-8 space-y-6">
            <div>
              <label className={labelClass}>Project Title *</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={inputClass} required />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Division *</label>
                <select value={formData.division} onChange={(e) => setFormData({ ...formData, division: e.target.value, category: e.target.value === "mechanical" ? "CAD" : "Website" })} className={inputClass}>
                  <option value="mechanical">Mechanical Engineering</option>
                  <option value="software">Software & Digital</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Category *</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className={inputClass}>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Short Description *</label>
              <textarea value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} rows={3} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Full Description</label>
              <textarea value={formData.fullDescription} onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })} rows={5} className={inputClass} />
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              <div><label className={labelClass}>Client</label><input type="text" value={formData.client} onChange={(e) => setFormData({ ...formData, client: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>Industry</label><input type="text" value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>Year</label><input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })} className={inputClass} /></div>
              <div><label className={labelClass}>Location</label><input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className={inputClass} /></div>
            </div>
            <div>
              <label className={labelClass}>Tools / Technologies</label>
              <div className="flex gap-2">
                <input type="text" value={toolInput} onChange={(e) => setToolInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTool(); } }} placeholder="Add a tool and press Enter" className={inputClass} />
                <button type="button" onClick={addTool} className="px-4 py-3 bg-white/5 border border-white/[0.08] rounded-[8px] text-agenza-white hover:border-electric">+</button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tools.map((tool) => (
                  <span key={tool} className="inline-flex items-center gap-2 font-mono text-[11px] uppercase text-agenza-white border border-white/[0.08] rounded px-3 py-1">
                    {tool}
                    <button type="button" onClick={() => setFormData({ ...formData, tools: formData.tools.filter((t) => t !== tool) })} className="text-titanium hover:text-red-400">×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "casestudy" && (
          <div className="bg-graphite border border-white/[0.08] rounded-[12px] p-6 md:p-8 space-y-6">
            {[
              { key: "challenge", label: "The Challenge", ph: "What problem did the client face?" },
              { key: "solution", label: "The Approach", ph: "How did AGENZA solve it?" },
              { key: "process", label: "Engineering / Development", ph: "Describe the process" },
              { key: "results", label: "The Result", ph: "What were the outcomes?" },
            ].map((section) => (
              <div key={section.key}>
                <label className={labelClass}>{section.label}</label>
                <textarea value={(formData as any)[section.key]} onChange={(e) => setFormData({ ...formData, [section.key]: e.target.value })} rows={4} placeholder={section.ph} className={inputClass} />
              </div>
            ))}
          </div>
        )}

        {activeTab === "media" && (
          <div className="bg-graphite border border-white/[0.08] rounded-[12px] p-6 md:p-8">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-[12px] p-10 text-center transition-colors ${dragActive ? "border-electric bg-electric/5" : "border-white/[0.12]"}`}
            >
              <input type="file" multiple accept="image/*,video/mp4,.pdf" onChange={(e) => e.target.files && handleFileUpload(e.target.files)} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="font-display text-agenza-white text-lg">Drag & Drop Files Here</div>
                <div className="text-titanium text-sm mt-1">or click to browse</div>
                <div className="font-mono text-[10px] tracking-wide text-titanium/60 mt-3">JPG · PNG · GIF · WEBP · SVG · PDF · MP4</div>
              </label>
              {uploading && <div className="text-electric mt-4 font-mono text-sm">UPLOADING...</div>}
            </div>

            {media.length > 0 && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {media.map((m) => (
                  <div key={m.id} className="relative group bg-obsidian border border-white/[0.08] rounded-[8px] overflow-hidden">
                    <div className="aspect-square">
                      {m.fileType === "image" ? (
                        <img src={m.fileUrl} alt={m.filename} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-eng-grid-fine font-mono text-titanium text-xs">
                          {m.fileType === "video" ? "VIDEO" : "PDF"}
                        </div>
                      )}
                    </div>
                    {m.isCover && <span className="absolute top-2 left-2 font-mono text-[9px] px-2 py-0.5 bg-electric text-obsidian rounded">COVER</span>}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {!m.isCover && <button type="button" onClick={() => setCover(m.id)} className="font-mono text-[10px] px-2 py-1 bg-white/10 text-agenza-white rounded hover:bg-electric hover:text-obsidian">SET COVER</button>}
                      <button type="button" onClick={() => deleteMedia(m.id)} className="font-mono text-[10px] px-2 py-1 bg-red-500/80 text-white rounded">DELETE</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "seo" && (
          <div className="bg-graphite border border-white/[0.08] rounded-[12px] p-6 md:p-8 space-y-6">
            <div><label className={labelClass}>SEO Title</label><input type="text" value={formData.seoTitle} onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })} placeholder={formData.title} className={inputClass} /></div>
            <div><label className={labelClass}>SEO Description</label><textarea value={formData.seoDescription} onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })} rows={3} placeholder={formData.shortDescription} className={inputClass} /></div>
          </div>
        )}

        {activeTab === "publish" && (
          <div className="bg-graphite border border-white/[0.08] rounded-[12px] p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div><div className="text-agenza-white font-medium">Featured Project</div><div className="text-titanium text-sm">Show on homepage</div></div>
              <button type="button" onClick={() => setFormData({ ...formData, featured: !formData.featured })} className={`relative w-14 h-8 rounded-full transition-colors ${formData.featured ? "bg-electric" : "bg-white/10"}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${formData.featured ? "left-7" : "left-1"}`} />
              </button>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <div><div className="text-agenza-white font-medium">Status</div><div className="text-titanium text-sm">Draft or Published</div></div>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="px-4 py-2 bg-obsidian border border-white/[0.08] rounded-[8px] text-agenza-white">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-4">
          <button type="submit" disabled={loading} className="px-8 py-3.5 bg-electric text-obsidian font-medium rounded-[8px] transition-all hover:brightness-110 disabled:opacity-50">
            {loading ? "SAVING..." : isEdit ? "SAVE CHANGES" : "CREATE PROJECT"}
          </button>
          <Link href="/admin/projects" className="px-8 py-3.5 border border-white/[0.08] text-agenza-white font-medium rounded-[8px] hover:border-electric hover:text-electric transition-all">CANCEL</Link>
        </div>
      </form>
    </>
  );
}
