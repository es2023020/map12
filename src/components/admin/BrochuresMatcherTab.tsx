import { useState, useEffect } from "react";
import { 
  FileText, 
  RefreshCw, 
  Check, 
  AlertCircle, 
  Trash2, 
  Link as LinkIcon, 
  FolderSearch, 
  HelpCircle,
  FileCheck,
  CheckCircle,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BrochuresMatcherTabProps {
  compoundsList: any[];
  updateProject: (slug: string, updates: any) => void;
}

export function BrochuresMatcherTab({ compoundsList, updateProject }: BrochuresMatcherTabProps) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [autoLinked, setAutoLinked] = useState<any[]>([]);
  const [flagged, setFlagged] = useState<any[]>([]);
  const [unmatched, setUnmatched] = useState<any[]>([]);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [manualMatches, setManualMatches] = useState<Record<string, string>>({});
  const [linkedStatus, setLinkedStatus] = useState<Record<string, boolean>>({});

  const runScanner = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/brochures-match");
      if (!res.ok) throw new Error("Scanner API failed");
      const data = await res.json();
      setSummary(data.summary);
      setAutoLinked(data.autoLinked || []);
      setFlagged(data.flagged || []);
      setUnmatched(data.unmatched || []);
      setConflicts(data.conflicts || []);
      
      // Reset status
      setLinkedStatus({});
      setManualMatches({});
    } catch (err: any) {
      alert(`Error running brochure matcher scan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runScanner();
  }, []);

  const handleAutoLinkAll = () => {
    let count = 0;
    autoLinked.forEach(item => {
      if (!linkedStatus[item.filename]) {
        updateProject(item.projectSlug, {
          brochureUrl: `/brochures/${item.filename}`,
          brochureFileName: item.filename,
          brochureType: "application/pdf"
        });
        linkedStatus[item.filename] = true;
        count++;
      }
    });
    setLinkedStatus({ ...linkedStatus });
    alert(`Successfully auto-linked ${count} brochures to their database project entries!`);
  };

  const handleLinkSingle = (filename: string, projectSlug: string) => {
    updateProject(projectSlug, {
      brochureUrl: `/brochures/${filename}`,
      brochureFileName: filename,
      brochureType: "application/pdf"
    });
    setLinkedStatus(prev => ({ ...prev, [filename]: true }));
    alert(`Linked "${filename}" to project successfully!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold text-primary flex items-center gap-2">
          <FolderSearch className="h-5 w-5 text-accent" /> Fuzzy brochures Auto-Linker
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Scan the <code className="bg-secondary/40 px-1 py-0.5 rounded text-accent font-semibold text-[10px]">/public/brochures</code> folder to automatically match PDF filenames with platform projects.
        </p>
      </div>

      <div className="flex gap-4">
        <Button onClick={runScanner} disabled={loading} size="sm" className="rounded-xl text-xs flex items-center gap-1.5">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Scan brochures Folder
        </Button>
        {autoLinked.length > 0 && (
          <Button onClick={handleAutoLinkAll} size="sm" variant="outline" className="rounded-xl text-xs border-emerald-500 text-emerald-600 hover:bg-emerald-500/10">
            <Check className="h-3.5 w-3.5 mr-1" /> Auto-Link All High Confidence ({autoLinked.length})
          </Button>
        )}
      </div>

      {summary && (
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-600">High Confidence Matches</span>
            <span className="block text-2xl font-extrabold text-emerald-600 mt-1">{summary.autoLinkedCount}</span>
            <span className="text-[9px] text-muted-foreground mt-0.5 block">Ready to auto-link</span>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-600">Flagged For Review</span>
            <span className="block text-2xl font-extrabold text-amber-600 mt-1">{summary.flaggedCount}</span>
            <span className="text-[9px] text-muted-foreground mt-0.5 block">Needs manual mapping</span>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-center">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-red-600">Conflicts / Duplicates</span>
            <span className="block text-2xl font-extrabold text-red-600 mt-1">{summary.duplicateCount}</span>
            <span className="text-[9px] text-muted-foreground mt-0.5 block">Conflicting file targets</span>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Unmatched files</span>
            <span className="block text-2xl font-extrabold text-primary mt-1">{summary.unmatchedCount}</span>
            <span className="text-[9px] text-muted-foreground mt-0.5 block">No candidate found</span>
          </div>
        </div>
      )}

      {/* Conflicts section */}
      {conflicts.length > 0 && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 space-y-3">
          <h3 className="text-xs font-bold text-red-600 flex items-center gap-1.5 uppercase tracking-wider">
            <AlertCircle className="h-4 w-4" /> Duplicate / Conflict Alerts ({conflicts.length})
          </h3>
          <p className="text-[11px] text-red-600/80 leading-relaxed">
            These files matched projects that already have brochures uploaded or have multiple files matching the same project name. Manual verification required.
          </p>

          <div className="divide-y divide-red-500/10 border border-red-500/15 rounded-xl overflow-hidden bg-card text-xs">
            {conflicts.map((c, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <div>
                  <span className="font-bold text-primary block">{c.filename}</span>
                  <span className="text-[10px] text-red-500 font-semibold block mt-0.5">
                    {c.conflictType === "multiple_files_matching_one_project" 
                      ? `Conflict: Multiple files matching "${c.projectName}" (${c.files.join(", ")})` 
                      : `Conflict: Project "${c.projectName}" already has brochure set`}
                  </span>
                </div>
                <button
                  onClick={() => handleLinkSingle(c.filename, c.projectSlug)}
                  className="rounded-lg border border-red-200 hover:border-red-500 px-2.5 py-1 text-[10px] font-semibold text-red-600 transition-colors"
                >
                  Force Link This File
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* High confidence autoLink view */}
      {autoLinked.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
            <FileCheck className="h-4.5 w-4.5 text-emerald-500" /> High Confidence Matches ({autoLinked.length})
          </h3>

          <div className="divide-y divide-border/60 border border-border/80 rounded-xl overflow-hidden text-xs">
            {autoLinked.map((item) => {
              const isLinked = linkedStatus[item.filename];
              return (
                <div key={item.filename} className="p-3.5 flex items-center justify-between hover:bg-secondary/15 transition-all">
                  <div className="min-w-0">
                    <span className="font-bold text-primary block truncate max-w-[280px]">{item.filename}</span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">
                      Fuzzy Match: <span className="font-semibold text-emerald-500">{item.projectName}</span> ({Math.round(item.score * 100)}% match)
                    </span>
                  </div>
                  {isLinked ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                      <CheckCircle className="h-3.5 w-3.5" /> Linked
                    </span>
                  ) : (
                    <button
                      onClick={() => handleLinkSingle(item.filename, item.projectSlug)}
                      className="rounded-lg bg-accent text-white px-3 py-1.5 text-[10px] font-bold hover:bg-accent/90 transition-colors"
                    >
                      Confirm Match
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Medium confidence review view */}
      {flagged.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="h-4.5 w-4.5 text-amber-500" /> Medium Confidence Review ({flagged.length})
          </h3>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            These files require manual mapping to candidates identified by similarity matching.
          </p>

          <div className="divide-y divide-border/60 border border-border/80 rounded-xl overflow-hidden text-xs">
            {flagged.map((item) => {
              const isLinked = linkedStatus[item.filename];
              const selectedSlug = manualMatches[item.filename] || "";

              return (
                <div key={item.filename} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/10 transition-all">
                  <div>
                    <span className="font-bold text-primary block truncate max-w-[280px]">{item.filename}</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {item.topCandidates.map((c: any) => (
                        <button
                          key={c.slug}
                          onClick={() => setManualMatches(prev => ({ ...prev, [item.filename]: c.slug }))}
                          className={`rounded px-2 py-0.5 text-[9px] font-semibold border transition-all ${
                            selectedSlug === c.slug 
                              ? "bg-accent/15 text-accent border-accent" 
                              : "bg-secondary/40 text-muted-foreground border-border hover:bg-secondary"
                          }`}
                        >
                          {c.name} ({Math.round(c.score * 100)}%)
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                    <select
                      value={selectedSlug}
                      onChange={(e) => setManualMatches(prev => ({ ...prev, [item.filename]: e.target.value }))}
                      className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] focus:outline-none w-44"
                    >
                      <option value="">-- Select Project --</option>
                      {compoundsList.map(c => (
                        <option key={c.slug} value={c.slug}>{c.name}</option>
                      ))}
                    </select>

                    {isLinked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle className="h-3.5 w-3.5" /> Linked
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          if (!selectedSlug) {
                            alert("Please select a target project first.");
                            return;
                          }
                          handleLinkSingle(item.filename, selectedSlug);
                        }}
                        className="rounded-lg bg-accent text-white px-3 py-1.5 text-[10px] font-bold hover:bg-accent/90 transition-all shadow"
                      >
                        Confirm Match
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Unmatched files */}
      {unmatched.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="h-4.5 w-4.5 text-slate-400" /> Unmatched PDF Files ({unmatched.length})
          </h3>
          <p className="text-[11px] text-muted-foreground">
            No clear project match candidates were found for these files. You can map them to any existing compound manually.
          </p>

          <div className="divide-y divide-border/60 border border-border/80 rounded-xl overflow-hidden text-xs">
            {unmatched.map((item) => {
              const isLinked = linkedStatus[item.filename];
              const selectedSlug = manualMatches[item.filename] || "";

              return (
                <div key={item.filename} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/10 transition-all">
                  <span className="font-bold text-primary block truncate max-w-[280px]">{item.filename}</span>

                  <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                    <select
                      value={selectedSlug}
                      onChange={(e) => setManualMatches(prev => ({ ...prev, [item.filename]: e.target.value }))}
                      className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] focus:outline-none w-44"
                    >
                      <option value="">-- Select Project --</option>
                      {compoundsList.map(c => (
                        <option key={c.slug} value={c.slug}>{c.name}</option>
                      ))}
                    </select>

                    {isLinked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle className="h-3.5 w-3.5" /> Linked
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          if (!selectedSlug) {
                            alert("Please select a target project first.");
                            return;
                          }
                          handleLinkSingle(item.filename, selectedSlug);
                        }}
                        className="rounded-lg bg-accent text-white px-3 py-1.5 text-[10px] font-bold hover:bg-accent/90 transition-all shadow"
                      >
                        Link File
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
