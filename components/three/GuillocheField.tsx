"use client";

import dynamic from "next/dynamic";

// WebGL stays client-only and lazy — the page is fully legible without it.
const GuillocheCanvas = dynamic(() => import("./GuillocheCanvas"), {
  ssr: false,
  loading: () => null,
});

export default function GuillocheField({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      <GuillocheCanvas />
    </div>
  );
}
