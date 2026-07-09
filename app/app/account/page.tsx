import { redirect } from "next/navigation";
import { Mail, ShieldCheck } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { currentUser } from "@/lib/engine/session";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await currentUser();
  if (!user) redirect("/signin?next=/app/account");

  return (
    <div className="mx-auto max-w-2xl">
      <Eyebrow>Account</Eyebrow>
      <h1 className="mt-4 text-3xl leading-[1.08] tracking-tight text-ink sm:text-4xl">
        Your <span className="italic seal-text">registration</span>.
      </h1>

      <div className="sheet paper-grain mt-8 overflow-hidden rounded-2xl">
        <div className="flex items-start gap-3.5 p-6 sm:p-8">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-seal/25 bg-seal/[0.07] text-seal">
            <Mail className="h-4 w-4" />
          </span>
          <div>
            <p className="label text-faint">Email on record</p>
            <p className="mt-1 font-mono text-sm text-ink">{user.email}</p>
          </div>
        </div>
        <div className="border-t border-dashed border-line px-6 py-5 sm:px-8">
          <p className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-faint">
            <ShieldCheck className="h-3.5 w-3.5 text-seal" />
            Member since {new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-muted">
        Billing and plan management arrive with the Stripe integration — until
        then, all lookups run on the free Discover tier.
      </p>
    </div>
  );
}
