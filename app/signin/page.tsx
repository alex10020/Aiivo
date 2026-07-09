"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  KeyRound,
  Loader2,
  Mail,
  MailCheck,
  TriangleAlert,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Seal } from "@/components/ui/Seal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { browserClient } from "@/lib/engine/supabase-browser";

type Mode = "magic" | "password" | "signup";

export default function SignInPage() {
  const router = useRouter();
  const supabase = browserClient();
  const [mode, setMode] = useState<Mode>("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError("");
    try {
      if (mode === "magic") {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
        setSent(true);
      } else if (mode === "password") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/app");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
        setSent(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="border-b border-line">
        <div className="container-x flex items-center justify-between py-4">
          <Link href="/" aria-label="Aiivo home">
            <Logo />
          </Link>
          <Link
            href="/"
            className="label flex items-center gap-2 transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="container-x flex flex-1 items-center justify-center py-16">
        <div className="w-full max-w-md">
          <div className="relative">
            <div
              className="pointer-events-none absolute -right-6 -top-10 opacity-[0.06]"
              aria-hidden
            >
              <Seal className="h-36 w-36" />
            </div>
            <Eyebrow>Office of Record</Eyebrow>
            <h1 className="mt-4 text-3xl leading-[1.08] tracking-tight text-ink sm:text-4xl">
              Sign in to your <span className="italic seal-text">record</span>.
            </h1>
          </div>

          {!supabase ? (
            <div className="mt-8 rounded-2xl border border-gold/35 bg-gold/[0.06] p-6">
              <p className="flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-gold">
                <TriangleAlert className="h-4 w-4" />
                Accounts not connected yet
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Add your Supabase keys to <code className="font-mono">.env.local</code>{" "}
                (see <code className="font-mono">.env.example</code>), run the
                migrations, and restart — this page goes live automatically.
              </p>
              <Link
                href="/demo"
                className="group mt-4 inline-flex items-center gap-1.5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-seal hover:text-seal-bright"
              >
                Try the live demo instead
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          ) : sent ? (
            <div className="sheet paper-grain mt-8 rounded-2xl p-8 text-center">
              <MailCheck className="mx-auto h-8 w-8 text-seal" />
              <h2 className="mt-4 font-sans text-lg font-semibold tracking-normal text-ink">
                Check your inbox
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                We sent a sign-in link to{" "}
                <span className="font-mono text-ink">{email}</span>. Open it on
                this device to continue.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-8">
              <div className="sheet paper-grain relative overflow-hidden rounded-2xl p-6 sm:p-8">
                <div
                  className="pointer-events-none absolute inset-3 rounded-xl border border-line-strong/50"
                  aria-hidden
                />
                <div className="relative space-y-5">
                  <div>
                    <span className="label mb-2 block">Email</span>
                    <div className="flex items-center gap-2 rounded-xl border border-line bg-card p-2 pl-3.5 transition-colors focus-within:border-seal/55 focus-within:shadow-[0_0_0_3px_rgba(21,98,61,0.1)]">
                      <Mail className="h-5 w-5 shrink-0 text-seal" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@business.com"
                        aria-label="Email"
                        className="w-full bg-transparent py-2 text-base text-ink outline-none placeholder:text-faint"
                      />
                    </div>
                  </div>

                  {mode !== "magic" && (
                    <div>
                      <span className="label mb-2 block">Password</span>
                      <div className="flex items-center gap-2 rounded-xl border border-line bg-card p-2 pl-3.5 transition-colors focus-within:border-seal/55 focus-within:shadow-[0_0_0_3px_rgba(21,98,61,0.1)]">
                        <KeyRound className="h-5 w-5 shrink-0 text-seal" />
                        <input
                          type="password"
                          required
                          minLength={8}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
                          aria-label="Password"
                          className="w-full bg-transparent py-2 text-base text-ink outline-none placeholder:text-faint"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={busy}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-seal px-5 py-3 text-sm font-medium text-on-seal transition-colors hover:bg-seal-bright disabled:opacity-50"
                  >
                    {busy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                    {mode === "magic"
                      ? "Email me a sign-in link"
                      : mode === "password"
                        ? "Sign in"
                        : "Create account"}
                  </button>

                  {error && (
                    <p className="flex items-center gap-2 font-mono text-xs text-stamp">
                      <TriangleAlert className="h-3.5 w-3.5 shrink-0" />
                      {error}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {mode !== "magic" && (
                  <ModeLink onClick={() => setMode("magic")}>Use a sign-in link</ModeLink>
                )}
                {mode !== "password" && (
                  <ModeLink onClick={() => setMode("password")}>Use a password</ModeLink>
                )}
                {mode !== "signup" && (
                  <ModeLink onClick={() => setMode("signup")}>Create an account</ModeLink>
                )}
              </div>
            </form>
          )}
        </div>
      </main>

      <footer className="border-t border-line bg-paper-2">
        <div className="container-x py-8">
          <p className="text-center font-mono text-[0.62rem] uppercase tracking-[0.2em] text-faint">
            AIIVO · OFFICIAL COMPLIANCE RECORD · © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}

function ModeLink({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-muted underline-offset-4 transition-colors hover:text-seal hover:underline"
    >
      {children}
    </button>
  );
}
