import { useState, useEffect } from "react";
import { FileText, X, Download, ExternalLink, Maximize2, Minimize2, BookOpen, Upload, AlertCircle, RefreshCw, FileCheck } from "lucide-react";
import { useStore } from "@/lib/store";

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
  const isAdmin = user?.email.toLowerCase() === "elsayedshoeip70@gmail.com";

  // Read brochure from the project store (set by admin dashboard)
  const projects = useStore((s) => s.compoundsList);
  const proj = projects?.find((p: any) => p.slug === projectSlug);
  const storedBrochureUrl: string | undefined = proj?.brochureUrl;
  const storedBrochureName: string | undefined = proj?.brochureFileName;
  const storedBrochureType: string | undefined = proj?.brochureType;
  const updateProject = useStore((s) => s.updateProject);

  // Determine whether brochure is available
  const hasBrochure = !!storedBrochureUrl;

  // Determine content type for viewer
  const isImage = storedBrochureType?.startsWith("image/") || (storedBrochureUrl && !storedBrochureUrl.includes("application/pdf") && (storedBrochureUrl.startsWith("data:image") || /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(storedBrochureUrl)));
  const isPdf = storedBrochureType === "application/pdf" || storedBrochureUrl?.includes("application/pdf") || /\.pdf(\?|$)/i.test(storedBrochureUrl ?? "");

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
        {hasBrochure && <span className="ml-1 inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />}
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/85 backdrop-blur-md"
          style={{ animation: "fadeIn 0.2s ease" }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
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
                  <div className="font-display font-bold text-sm text-primary truncate">{projectName}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {storedBrochureName ? storedBrochureName : "Project Brochure"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {hasBrochure && (
                  <>
                    <a
                      href={storedBrochureUrl}
                      download={storedBrochureName || `${projectName}-Brochure`}
                      className="hidden sm:flex items-center gap-1.5 rounded-xl border border-border bg-secondary/40 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-secondary/70 transition-all"
                    >
                      <Download className="h-3.5 w-3.5" /> Download
                    </a>
                    {!storedBrochureUrl?.startsWith("data:") && (
                      <a
                        href={storedBrochureUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-1.5 rounded-xl border border-border bg-secondary/40 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-secondary/70 transition-all"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Open Tab
                      </a>
                    )}
                  </>
                )}
                <button
                  onClick={() => setFullscreen(!fullscreen)}
                  className="rounded-xl border border-border bg-secondary/40 p-1.5 text-muted-foreground hover:text-primary transition-all"
                  title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => { setOpen(false); setFullscreen(false); }}
                  className="rounded-xl border border-border bg-secondary/40 p-1.5 text-muted-foreground hover:text-destructive transition-all"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Document Viewer Frame */}
            <div className="flex-1 overflow-hidden bg-secondary/10 flex flex-col items-center justify-center p-6 relative">
              {hasBrochure ? (
                isPdf ? (
                  <iframe
                    src={`${storedBrochureUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                    className="h-full w-full border-0 bg-white dark:bg-zinc-950 rounded-lg shadow-sm"
                    title={`${projectName} Brochure`}
                  />
                ) : isImage ? (
                  <img
                    src={storedBrochureUrl}
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
                        <strong>{storedBrochureName}</strong> is available for download.
                        This file type cannot be previewed in-browser.
                      </p>
                    </div>
                    <a
                      href={storedBrochureUrl}
                      download={storedBrochureName || `${projectName}-Brochure`}
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
                      The official sales brochure and master plan documents for <strong>{projectName}</strong> are currently under compilation. 
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

                  {/* Super-Admin Upload Gate */}
                  {isAdmin && (
                    <div className="border-t border-border/60 pt-5 mt-3 text-left">
                      <span className="block text-[10px] font-bold text-accent uppercase tracking-wider mb-2">Administrator Quick Console</span>
                      <div className="rounded-xl border border-dashed border-border/80 bg-secondary/20 p-4 relative flex flex-col items-center justify-center text-center">
                        {uploading ? (
                          <div className="flex flex-col items-center gap-2 py-2">
                            <RefreshCw className="h-5 w-5 text-accent animate-spin" />
                            <span className="text-[10px] font-bold text-primary">Uploading &amp; indexing brochure...</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-6 w-6 text-muted-foreground mb-1.5" />
                            <span className="text-xs font-semibold text-primary">Upload Brochure</span>
                            <span className="text-[9px] text-muted-foreground mt-0.5 mb-3">PDF, Word, PowerPoint, or Image</span>
                            
                            <label className="cursor-pointer rounded-lg bg-accent text-white font-semibold text-[10px] px-3 py-1.5 hover:bg-accent/90 transition-colors">
                              Select File
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,.ppt,.pptx,image/*"
                                className="hidden"
                                onChange={handleUpload}
                              />
                            </label>
                          </>
                        )}
                        {uploadError && (
                          <div className="mt-2 flex items-center gap-1 text-[9px] text-destructive font-semibold">
                            <AlertCircle className="h-3 w-3" /> {uploadError}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
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
