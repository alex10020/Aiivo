"use client";

import { Printer } from "lucide-react";

/* Browser print → user picks "Save as PDF". The report page is deterministic
   server markup, so the PDF matches the screen exactly. */
export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-lg bg-seal px-4 py-2.5 text-sm font-medium text-on-seal transition-colors hover:bg-seal-bright print:hidden"
    >
      <Printer className="h-4 w-4" />
      Print / Save as PDF
    </button>
  );
}
