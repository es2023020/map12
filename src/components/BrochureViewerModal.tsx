import { useState, useRef } from "react";
import {
  X,
  Download,
  Share2,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  FileText,
  Sparkles,
  ExternalLink,
  Printer,
} from "lucide-react";

interface Props {
  pdfUrl: string;
  projectName: string;
  developerName?: string;
  onClose: () => void;
}

export function BrochureViewerModal({
  pdfUrl,
  projectName,
  developerName = "Developer",
  onClose,
}: Props) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fullUrl = pdfUrl.startsWith("http")
    ? pdfUrl
    : `${window?.location?.origin || "https://propertyatlas.eg"}${pdfUrl.startsWith("/") ? "" : "/"}${pdfUrl}`;

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 25, 200));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 25, 50));
  const handleResetZoom = () => setZoomLevel(100);

  const handleShareWhatsApp = () => {
    const shareText = `*${projectName} Official Brochure* (${developerName})\nView executive project presentation & floor plans:\n${fullUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `${projectName.replace(/[^a-zA-Z0-9]/g, "_")}_Brochure.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-hidden animate-in fade-in duration-200 ${
        isFullscreen ? "p-0" : "p-4 sm:p-6"
      }`}
    >
      <div
        className={`relative flex flex-col w-full max-w-6xl h-[90vh] rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl overflow-hidden transition-all duration-300 ${
          isFullscreen ? "h-full w-full max-w-none rounded-none border-none" : ""
        }`}
      >
        {/* Header Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-zinc-900/90 px-6 py-4 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground font-bold shadow-sm">
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                  Official Project Presentation
                </span>
                <span className="rounded-full bg-emerald-500/15 text-emerald-400 px-2 py-0.5 text-[9px] font-bold border border-emerald-500/20">
                  HD Document Viewer
                </span>
              </div>
              <div className="font-display text-base font-bold text-white leading-tight mt-0.5">
                {projectName} Brochure
              </div>
            </div>
          </div>

          {/* Action Toolbar Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 rounded-xl bg-zinc-800/80 border border-white/10 p-1 text-xs text-white">
              <button
                onClick={handleZoomOut}
                className="rounded-lg p-1.5 hover:bg-zinc-700 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="px-2 font-mono font-bold text-[11px] min-w-[42px] text-center">
                {zoomLevel}%
              </span>
              <button
                onClick={handleZoomIn}
                className="rounded-lg p-1.5 hover:bg-zinc-700 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="rounded-lg p-1.5 hover:bg-zinc-700 transition-colors border-l border-white/10 ml-0.5"
                title="Reset Zoom"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Direct Download PDF */}
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>

            {/* Share WhatsApp */}
            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-emerald-700 transition-all cursor-pointer"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>

            {/* Open Raw Tab */}
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/10 bg-zinc-800 p-2 text-white/80 hover:text-white hover:bg-zinc-700 transition-all cursor-pointer"
              title="Open Raw PDF"
            >
              <ExternalLink className="h-4 w-4" />
            </a>

            {/* Toggle Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="rounded-xl border border-white/10 bg-zinc-800 p-2 text-white/80 hover:text-white hover:bg-zinc-700 transition-all cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-zinc-800 p-2 text-white/80 hover:text-white hover:bg-zinc-700 transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* PDF Presentation Frame */}
        <div className="relative flex-1 bg-zinc-950 overflow-hidden flex items-center justify-center p-2">
          <div
            className="w-full h-full transition-transform duration-200"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: "center center",
            }}
          >
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
              title={`${projectName} Brochure`}
              className="w-full h-full rounded-2xl border border-white/10 shadow-2xl bg-zinc-900"
            />
          </div>
        </div>

        {/* Modal Footer Info */}
        <div className="flex items-center justify-between border-t border-white/10 bg-zinc-900/80 px-6 py-3 text-xs text-white/70 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="font-medium text-white">{developerName}</span>
            <span>•</span>
            <span className="text-white/60">{projectName} Master Presentation</span>
          </div>

          <div className="text-[11px] font-medium text-white/50">
            Press ESC or click close to exit reader
          </div>
        </div>
      </div>
    </div>
  );
}
