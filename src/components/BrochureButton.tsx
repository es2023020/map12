import { useState } from "react";
import { FileText, X, Download, ExternalLink, Maximize2, Minimize2, BookOpen } from "lucide-react";

interface BrochureButtonProps {
  projectSlug: string;
  projectName: string;
}

/**
 * BrochureButton — shown on every project page.
 * Looks for /brochures/{slug}.pdf in the public folder.
 * If the file doesn't exist the browser simply shows an error inside the iframe,
 * so no extra server-side check is needed.
 */
export function BrochureButton({ projectSlug, projectName }: BrochureButtonProps) {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const pdfUrl = `/brochures/${projectSlug}.pdf`;

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-primary shadow-soft hover:border-accent/60 hover:bg-accent/5 hover:text-accent transition-all duration-200 group"
      >
        <BookOpen className="h-4 w-4 text-accent group-hover:scale-110 transition-transform" />
        View Brochure
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-md"
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
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5 bg-card/80 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/60 shadow-sm">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="font-display font-bold text-sm text-primary truncate">{projectName}</div>
                  <div className="text-[11px] text-muted-foreground">Project Brochure</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={pdfUrl}
                  download={`${projectName} Brochure.pdf`}
                  className="hidden sm:flex items-center gap-1.5 rounded-xl border border-border bg-secondary/40 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-secondary/70 transition-all"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </a>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1.5 rounded-xl border border-border bg-secondary/40 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-secondary/70 transition-all"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Open Tab
                </a>
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

            {/* PDF iframe */}
            <div className="flex-1 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                className="h-full w-full border-0"
                title={`${projectName} Brochure`}
              />
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
