/* =============================================================================
   TRANSACTIONAL EMAIL — Resend, env-gated.
   No RESEND_API_KEY → hasEmail() is false and senders throw a clear
   EngineError the routes surface to the UI. Verify a sending domain in Resend
   and set EMAIL_FROM (e.g. "Aiivo <reports@aiivo.ai>") before production.
   ========================================================================== */

import { Resend } from "resend";
import { UpstreamError } from "./errors";
import type { ComplianceRecord } from "./types";

export function hasEmail(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function from(): string {
  return process.env.EMAIL_FROM ?? "Aiivo <onboarding@resend.dev>";
}

/** Plain, trustworthy transactional email — no marketing fluff in a legal-ish
    document delivery. Inline styles only (email clients ignore stylesheets). */
function reportHtml(record: ComplianceRecord, shareUrl: string): string {
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<!doctype html>
<html><body style="margin:0;padding:32px 16px;background:#f3efe4;font-family:Georgia,'Times New Roman',serif;color:#1b1813;">
  <div style="max-width:560px;margin:0 auto;background:#faf7ef;border:1px solid #d8d2c2;border-radius:14px;padding:32px;">
    <p style="margin:0;font-family:Consolas,Menlo,monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#6b6456;">Aiivo · Compliance Report</p>
    <h1 style="margin:14px 0 0;font-size:24px;font-weight:400;line-height:1.2;">Your compliance report is ready.</h1>
    <p style="margin:14px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#423d34;">
      ${esc(record.summary)}<br/>
      <span style="color:#6b6456;">${esc(record.jurisdictionLabel)} · ${record.items.length} permits · ${esc(record.estimatedCost)} · ${esc(record.estimatedTimeline)}</span>
    </p>
    <p style="margin:24px 0 0;">
      <a href="${shareUrl}" style="display:inline-block;background:#15623d;color:#f6f2e7;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;text-decoration:none;padding:12px 22px;border-radius:8px;">View &amp; download your report</a>
    </p>
    <p style="margin:18px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#6b6456;">
      The link opens your full report — use your browser's Print &rarr; Save as PDF for a copy.
      Anyone with this link can view the report, so share it deliberately.
    </p>
    <hr style="margin:24px 0;border:none;border-top:1px solid #d8d2c2;"/>
    <p style="margin:0;font-family:Consolas,Menlo,monospace;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#9b9281;line-height:1.7;">
      Aiivo · Official Compliance Record · © 2026<br/>
      Informational research tool — not legal advice. Verify each item with the issuing authority.
    </p>
  </div>
</body></html>`;
}

export async function sendReportEmail(
  to: string,
  record: ComplianceRecord,
  shareUrl: string
): Promise<void> {
  if (!hasEmail()) {
    throw new UpstreamError(
      "Email is not configured — add RESEND_API_KEY to the environment."
    );
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: from(),
    to,
    subject: `Your Aiivo compliance report — ${record.jurisdictionLabel}`,
    html: reportHtml(record, shareUrl),
    text: `Your Aiivo compliance report is ready.\n\n${record.summary}\n${record.jurisdictionLabel} · ${record.items.length} permits · ${record.estimatedCost} · ${record.estimatedTimeline}\n\nView & download: ${shareUrl}\n\nInformational research tool — not legal advice. Verify each item with the issuing authority.`,
  });
  if (error) throw new UpstreamError(`Email send failed: ${error.message}`);
}
