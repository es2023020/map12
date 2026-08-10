import { useState, useEffect } from "react";
import {
  FileText,
  X,
  Download,
  ExternalLink,
  Maximize2,
  Minimize2,
  BookOpen,
  Upload,
  AlertCircle,
  FileCheck,
  Loader2,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { brochureMap } from "@/data/brochure-map";

interface BrochureButtonProps {
  projectSlug: string;
  projectName: string;
}

export function BrochureButton({ projectSlug, projectName }: BrochureButtonProps) {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const user = useStore((s) => s.user);
  const isAdmin = user?.email?.toLowerCase() === "elsayedshoeip70@gmail.com";

  // Read brochure from the project store (set by admin dashboard)
  const projects = useStore((s) => s.compoundsList);
  const proj = projects?.find((p: any) => p.slug === projectSlug);
  const storedBrochureUrl: string | undefined = proj?.brochureUrl;
  const storedBrochureName: string | undefined = proj?.brochureFileName;
  const storedBrochureType: string | undefined = proj?.brochureType;
  const updateProject = useStore((s) => s.updateProject);

  // Fallback: check brochureMap for a static public brochure file
  const staticBrochureFile = brochureMap[projectSlug];
  const staticBrochureUrl = staticBrochureFile ? `/brochures/${staticBrochureFile}` : undefined;

  // Use stored URL if available, otherwise fall back to static mapped file
  const brochureUrl = storedBrochureUrl || staticBrochureUrl;
  const brochureName = storedBrochureName || staticBrochureFile || undefined;
  const brochureType = storedBrochureType || (staticBrochureFile ? "application/pdf" : undefined);

  // Determine whether brochure is available
  const hasBrochure = !!brochureUrl;

  // State to store the client-side safe Blob URL for inline PDF viewing
  const [resolvedUrl, setResolvedUrl] = useState<string>("");
  const [loadingPdf, setLoadingPdf] = useState<boolean>(false);

  useEffect(() => {
    if (!brochureUrl) {
      setResolvedUrl("");
      return;
    }

    if (brochureUrl.startsWith("data:")) {
      setLoadingPdf(true);
      try {
        const parts = brochureUrl.split(",");
        const contentType = parts[0].split(";")[0].split(":")[1] || "application/pdf";
        const base64Data = parts[1];

        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: contentType });
        const blobUrl = URL.createObjectURL(blob);

        setResolvedUrl(blobUrl);
      } catch (e) {
        console.error("Failed to parse data URL to blob", e);
        setResolvedUrl(brochureUrl); // fallback
      } finally {
        setLoadingPdf(false);
      }
    } else {
      // It's a static file path, resolve directly without fetching!
      setResolvedUrl(brochureUrl);
      setLoadingPdf(false);
    }

    return () => {
      // Clean up blob URL if created
      if (resolvedUrl && resolvedUrl.startsWith("blob:")) {
        URL.revokeObjectURL(resolvedUrl);
      }
    };
  }, [brochureUrl]);

  // Determine content type for viewer
  const isImage =
    brochureType?.startsWith("image/") ||
    (brochureUrl &&
      !brochureUrl.includes("application/pdf") &&
      (brochureUrl.startsWith("data:image") ||
        /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(brochureUrl)));
  const isPdf =
    brochureType === "application/pdf" ||
    brochureUrl?.includes("application/pdf") ||
    /\.pdf(\?|$)/i.test(brochureUrl ?? "");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Content = reader.result as string;
        updateProject(projectSlug, {
          brochureUrl: base64Content,
          brochureFileName: file.name,
          brochureType: file.type,
        });
        setUploading(false);
      };
      reader.onerror = () => {
        setUploadError("Failed to read file");
        setUploading(false);
      };
    } catch (err: any) {
      setUploadError(err.message || "An error occurred during file upload");
      setUploading(false);
    }
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-primary shadow-soft hover:border-accent/60 hover:bg-accent/5 hover:text-accent transition-all duration-200 group"
      >
        <BookOpen className="h-4 w-4 text-accent group-hover:scale-110 transition-transform" />
        View Brochure
        {hasBrochure && (
          <span className="ml-1 inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        )}
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/85 backdrop-blur-md"
          style={{ animation: "fadeIn 0.2s ease" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            className={`flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all duration-300 ${
              fullscreen ? "fixed inset-4" : "w-full max-w-4xl mx-4"
            }`}
            style={fullscreen ? {} : { height: "85vh" }}
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5 bg-card/85 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/60 shadow-sm">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="font-display font-bold text-sm text-primary truncate">
                    {projectName}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {brochureName ? brochureName : "Project Brochure"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {hasBrochure && (
                  <>
                    <a
                      href={resolvedUrl || brochureUrl}
                      download={brochureName || `${projectName}-Brochure`}
                      className="flex items-center gap-1.5 rounded-xl border border-border bg-secondary/40 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-secondary/70 transition-all"
                    >
                      <Download className="h-3.5 w-3.5" />{" "}
                      <span className="hidden xs:inline">Download</span>
                    </a>
                    <a
                      href={resolvedUrl || brochureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-xl border border-border bg-secondary/40 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-secondary/70 transition-all"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />{" "}
                      <span className="hidden xs:inline">Open Tab</span>
                    </a>
                  </>
                )}
                <button
                  onClick={() => setFullscreen(!fullscreen)}
                  className="rounded-xl border border-border bg-secondary/40 p-1.5 text-muted-foreground hover:text-primary transition-all"
                  title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {fullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    setFullscreen(false);
                  }}
                  className="rounded-xl border border-border bg-secondary/40 p-1.5 text-muted-foreground hover:text-destructive transition-all"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Document Viewer Frame */}
            <div className="flex-1 overflow-hidden bg-secondary/10 flex flex-col items-center justify-center p-4 sm:p-6 relative min-h-[300px] w-full">
              {loadingPdf ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 text-accent animate-spin" />
                  <span className="text-xs font-semibold text-primary">
                    Loading brochure preview...
                  </span>
                </div>
              ) : hasBrochure ? (
                isPdf ? (
                  <div className="h-full w-full flex flex-col gap-2">
                    <div className="sm:hidden flex items-center justify-between gap-2 bg-accent/10 border border-accent/20 rounded-xl p-3 text-xs text-primary shrink-0">
                      <span className="font-medium text-accent">
                        PDF Viewer is limited on mobile
                      </span>
                      <a
                        href={resolvedUrl || brochureUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 bg-accent text-white px-2.5 py-1 rounded-lg font-bold text-[11px]"
                      >
                        Open Brochure <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <iframe
                      src={
                        resolvedUrl
                          ? `${resolvedUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`
                          : ""
                      }
                      className="flex-1 w-full border-0 bg-white dark:bg-zinc-950 rounded-lg shadow-sm"
                      title={`${projectName} Brochure`}
                    />
                  </div>
                ) : isImage ? (
                  <img
                    src={resolvedUrl || brochureUrl}
                    alt={`${projectName} Brochure`}
                    className="max-h-full max-w-full object-contain rounded-xl shadow-lg"
                  />
                ) : (
                  // Other file types (doc, ppt, etc.) – show download prompt
                  <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center space-y-5 shadow-lg">
                    <div className="mx-auto rounded-full bg-accent/10 p-5 w-fit">
                      <FileCheck className="h-10 w-10 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary text-base">Brochure Ready</h3>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        <strong>{brochureName}</strong> is available for download. This file type
                        cannot be previewed in-browser.
                      </p>
                    </div>
                    <a
                      href={resolvedUrl || brochureUrl}
                      download={brochureName || `${projectName}-Brochure`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent text-white font-bold text-sm hover:bg-accent/90 transition-colors py-3 px-6 shadow-md"
                    >
                      <Download className="h-4 w-4" /> Download Brochure
                    </a>
                  </div>
                )
              ) : (
                <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center space-y-5 shadow-lg border-dashed">
                  <div className="mx-auto rounded-full bg-accent/10 p-5 w-fit">
                    <FileText className="h-10 w-10 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-base">Brochure Coming Soon</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      The official sales brochure and master plan documents for{" "}
                      <strong>{projectName}</strong> are currently under compilation.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <a
                      href={`https://wa.me/201029324783?text=Hi!%20I%20am%20requesting%20the%20latest%20sales%20brochure%20and%20price%20list%20for%20${encodeURIComponent(projectName)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 text-white font-bold text-xs hover:bg-green-600 transition-colors py-3 shadow-md"
                    >
                      Request via WhatsApp Web
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}
