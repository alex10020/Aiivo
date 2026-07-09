import { clsx } from "clsx";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={clsx("label inline-flex items-center gap-2.5", className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-seal" />
      <span className="h-px w-5 bg-line-strong" />
      {children}
    </span>
  );
}
