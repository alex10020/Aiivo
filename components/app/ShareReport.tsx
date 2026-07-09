"use client";

/* Share / print / email the report — the deliverable actions on a record. */
import { useState } from "react";
import { Check, Copy, ExternalLink, Mail, Loader2, AlertTriangle } from "lucide-react";

export function ShareReport({
  recordId,
  shareToken,
}: {
  recordId: string;
  shareToken: string;
}) {
  const [copied, setCopied] = useState(false);
  const [emailState, setEmailState] = useState<"idle" | "busy" | "sent" | "error">("idle");
  const [emailMsg, setEmailMsg] = useState("");

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/r/${shareToken}`
      : `/r/${shareToken}`;

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function email() {
    setEmailState("busy");
    setEmailMsg("");
    try {
      const res = await fetch(`/api/records/${recordId}/email`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message ?? "Send failed.");
      setEmailState("sent");
      setEmailMsg(`Sent to ${data.to}`);
    } catch (err) {
      setEmailState("error");
      setEmailMsg(err instanceof Error ? err.message : "Send failed.");
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-card p-6">
      <p className="label">Your report</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        A read-only copy of this record lives at a private link — open it to
        print or save as PDF, or share it with a partner, landlord or lender.
        Anyone with the link can view it.
      </p>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-line bg-paper p-2 pl-3.5">
        <span className="min-w-0 flex-1 truncate font-mono text-xs text-ink-soft">{url}</span>
        <button
          onClick={copy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-line bg-card px-3 py-2 font-mono text-[0.68rem] uppercase tracking-wider text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-seal" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <a
          href={`/r/${shareToken}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-seal px-4 py-2.5 text-sm font-medium text-on-seal transition-colors hover:bg-seal-bright"
        >
          <ExternalLink className="h-4 w-4" />
          Open report (print / PDF)
        </a>
        <button
          onClick={email}
          disabled={emailState === "busy"}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-card px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-line-strong disabled:opacity-50"
        >
          {emailState === "busy" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          Email me this report
        </button>
      </div>

      {emailMsg && (
        <p
          className={`mt-3 flex items-center gap-2 font-mono text-xs ${
            emailState === "error" ? "text-stamp" : "text-seal"
          }`}
        >
          {emailState === "error" ? <AlertTriangle className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
          {emailMsg}
        </p>
      )}
    </div>
  );
}
