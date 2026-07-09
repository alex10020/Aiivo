"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { clsx } from "clsx";

const TOPICS = ["General", "Support", "Sales & API", "Press", "Partnerships"];
const CONTACT_EMAIL = "alexander@aiivo.ai";

const inputBase =
  "w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-base text-ink outline-none transition-colors placeholder:text-faint focus:border-seal/55 focus:shadow-[0_0_0_3px_rgba(21,98,61,0.1)]";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = `[${topic}] Message from ${name || "the Aiivo site"}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Business: ${business || "—"}`,
      `Topic: ${topic}`,
      "",
      message,
    ].join("\n");
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setSent(true);
  }

  return (
    <div className="sheet paper-grain relative overflow-hidden rounded-2xl">
      <div className="relative p-6 sm:p-8">
        {/* form header strip */}
        <div className="flex items-center justify-between">
          <span className="label text-faint">Correspondence form</span>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint">
            AIV·CONTACT
          </span>
        </div>
        <div className="my-5 border-t border-dashed border-line" />

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="cf-name" className="label mb-2 block text-faint">
                Full name
              </label>
              <input
                id="cf-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                placeholder="Jordan Rivera"
                className={inputBase}
              />
            </div>
            <div>
              <label htmlFor="cf-email" className="label mb-2 block text-faint">
                Email
              </label>
              <input
                id="cf-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@business.com"
                className={inputBase}
              />
            </div>
          </div>

          <div>
            <label htmlFor="cf-business" className="label mb-2 block text-faint">
              Business{" "}
              <span className="tracking-normal text-faint/70 normal-case">
                (optional)
              </span>
            </label>
            <input
              id="cf-business"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              placeholder="e.g. Food truck, Denver CO"
              className={inputBase}
            />
          </div>

          <div>
            <span className="label mb-2 block text-faint">Topic</span>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((t) => {
                const active = t === topic;
                return (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setTopic(t)}
                    className={clsx(
                      "rounded-full border px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.12em] transition-colors",
                      active
                        ? "border-seal/45 bg-seal/[0.08] text-seal"
                        : "border-line text-muted hover:border-line-strong hover:text-ink"
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="cf-message" className="label mb-2 block text-faint">
              Message
            </label>
            <textarea
              id="cf-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              placeholder="Tell us what you need…"
              className={clsx(inputBase, "resize-y leading-relaxed")}
            />
          </div>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              className="group inline-flex items-center justify-center gap-1.5 rounded-lg bg-seal px-5 py-3 text-sm font-medium text-on-seal transition-colors hover:bg-seal-bright"
            >
              Send message
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            {sent ? (
              <span className="inline-flex items-center gap-1.5 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-seal">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
                Opened in your email app
              </span>
            ) : (
              <span className="font-mono text-[0.66rem] leading-relaxed text-faint">
                Opens your email client. Or write{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-muted underline underline-offset-2 hover:text-seal"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
