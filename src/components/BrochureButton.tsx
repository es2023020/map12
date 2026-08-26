import { useState, useEffect } from "react";
import { BrochureViewerModal } from "@/components/BrochureViewerModal";
import { FileText, BookOpen, Upload, AlertCircle, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { brochureMap } from "@/data/brochure-map";

interface BrochureButtonProps {
  projectSlug: string;
  projectName: string;
}

export function BrochureButton({ projectSlug, projectName }: BrochureButtonProps) {
  const [showViewerModal, setShowViewerModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const user = useStore((s) => s.user);
  const isAdmin = user?.email?.toLowerCase() === "elsayedshoeip70@gmail.com";

  // Read brochure from the project store (set by admin dashboard)
  const projects = useStore((s) => s.compoundsList);
  const proj = projects?.find((p: any) => p.slug === projectSlug);
  const storedBrochureUrl: string | undefined = proj?.brochureUrl;
  const updateProject = useStore((s) => s.updateProject);

  // Fallback: check brochureMap for a static public brochure file
  const staticBrochureFile = brochureMap[projectSlug];
  const staticBrochureUrl = staticBrochureFile ? `/brochures/${staticBrochureFile}` : undefined;

  // Use stored URL if available, otherwise fall back to static mapped file
  const brochureUrl = storedBrochureUrl || staticBrochureUrl;
  const hasBrochure = !!brochureUrl;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.type.startsWith("image/")) {
      setUploadError("Please upload a PDF or image file.");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setUploadError("File size must be under 25MB.");
      return;
    }

    setUploading(true);
    setUploadError("");

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      updateProject(projectSlug, {
        brochureUrl: dataUrl,
        brochureFileName: file.name,
        brochureType: file.type,
      });
      setUploading(false);
    };

    reader.onerror = () => {
      setUploadError("Failed to read file.");
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {hasBrochure ? (
          <button
            onClick={() => setShowViewerModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-accent-foreground shadow-sm hover:bg-accent/90 transition-all cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            <span>View Brochure</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5" />
              Brochure Coming Soon
            </span>

            {isAdmin && (
              <label className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-accent bg-accent/10 px-3 py-2 text-xs font-bold text-accent hover:bg-accent/20 cursor-pointer transition-all">
                {uploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                <span>{uploading ? "Uploading..." : "Upload Brochure"}</span>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
          </div>
        )}

        {uploadError && (
          <span className="text-[10px] font-semibold text-rose-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> {uploadError}
          </span>
        )}
      </div>

      {/* Render High-End In-App HD Brochure Viewer Modal */}
      {showViewerModal && brochureUrl && (
        <BrochureViewerModal
          pdfUrl={brochureUrl}
          projectName={projectName}
          developerName={proj?.developer || "Developer"}
          onClose={() => setShowViewerModal(false)}
        />
      )}
    </>
  );
}
