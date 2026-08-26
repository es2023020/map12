import { useState } from "react";
import {
  X,
  Download,
  Share2,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
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
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200 ${
        isFullscreen ? "p-0" : "p-3 sm:p-6"
      }`}
    >
      <div
        className={`relative flex flex-col w-full max-w-6xl h-[92vh] rounded-3xl border border-white/15 bg-slate-900 shadow-2xl overflow-hidden transition-all duration-300 ${
          isFullscreen ? "h-full w-full max-w-none rounded-none border-none" : ""
        }`}
      >
        {/* Luxury Dark Header Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-950/90 px-6 py-4 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/30 border border-amber-500/30 text-amber-400 font-bold shadow-inner">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                  {developerName}
                </span>
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[9px] font-bold border border-emerald-500/30 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> HD PDF Presentation
                </span>
              </div>
              <div className="font-display text-lg font-black text-white leading-tight mt-0.5">
                {projectName} Brochure
              </div>
            </div>
          </div>

          {/* Action Control Panel */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 rounded-2xl bg-slate-800/90 border border-white/10 p-1 text-xs text-white shadow-inner">
              <button
                onClick={handleZoomOut}
                className="rounded-xl p-2 hover:bg-slate-700 transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="px-2 font-mono font-bold text-amber-400 text-xs">{zoomLevel}%</span>
              <button
                onClick={handleZoomIn}
                className="rounded-xl p-2 hover:bg-slate-700 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              {zoomLevel !== 100 && (
                <button
                  onClick={handleResetZoom}
                  className="rounded-xl p-2 hover:bg-slate-700 transition-colors text-slate-400 hover:text-white cursor-pointer"
                  title="Reset Zoom"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Direct Download Button */}
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-3.5 py-2 text-xs font-bold transition-all border border-amber-500/30 cursor-pointer"
              title="Download Original PDF"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download Brochure</span>
            </button>

            {/* WhatsApp Share Button */}
            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 px-3.5 py-2 text-xs font-bold transition-all border border-emerald-500/30 cursor-pointer"
              title="Share via WhatsApp"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="rounded-2xl bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="rounded-2xl bg-slate-800 p-2 text-slate-300 hover:bg-rose-600 hover:text-white border border-white/10 transition-colors ml-1 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* PDF Reader Canvas Body */}
        <div className="relative flex-1 bg-slate-950 overflow-auto p-2 sm:p-4 flex justify-center items-start">
          <div
            className="w-full h-full transition-transform duration-200 origin-top"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
          >
            <iframe
              src={`${pdfUrl}#toolbar=1&view=FitH`}
              className="w-full h-full min-h-[750px] rounded-2xl border border-white/10 bg-slate-900 shadow-2xl"
              title={`${projectName} Brochure`}
            />
          </div>
        </div>

        {/* Executive Footer Bar */}
        <div className="flex items-center justify-between border-t border-white/10 bg-slate-950 px-6 py-2.5 text-[11px] text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Interactive Presentation Canvas for <strong>{projectName}</strong></span>
          </div>
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-amber-400 hover:underline font-semibold"
          >
            Open Original PDF <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
