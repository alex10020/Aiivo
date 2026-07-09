/* Shared Anthropic helper for engine workstreams. */
import Anthropic from "@anthropic-ai/sdk";
import { UpstreamError } from "./errors";

const MODEL = "claude-opus-4-8";

export type Effort = "low" | "medium" | "high" | "xhigh" | "max";

/* Deploy-time quality/latency dial. On Vercel Hobby (60s function cap) set
   AIIVO_ENGINE_EFFORT=medium; on a paid plan leave unset for full depth. */
export function engineEffort(fallback: Effort): Effort {
  const e = process.env.AIIVO_ENGINE_EFFORT;
  return e === "low" || e === "medium" || e === "high" || e === "xhigh" || e === "max"
    ? e
    : fallback;
}

export function hasAI(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export function anthropic(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new UpstreamError("ANTHROPIC_API_KEY not set");
  return new Anthropic({ apiKey });
}

/** One structured-output call → parsed JSON of type T.
 *  `effort` trades depth for latency: "low" for clarify/classify,
 *  "high" for the permit-map enrichment where accuracy is the product. */
export async function jsonComplete<T>(args: {
  system: string;
  user: string;
  schema: Record<string, unknown>;
  maxTokens?: number;
  effort?: Effort;
  thinking?: boolean;
}): Promise<T> {
  const message = await anthropic().messages.create({
    model: MODEL,
    max_tokens: args.maxTokens ?? 8000,
    system: args.system,
    messages: [{ role: "user", content: args.user }],
    ...(args.thinking ? { thinking: { type: "adaptive" as const } } : {}),
    output_config: {
      effort: args.effort ?? "medium",
      format: { type: "json_schema", schema: args.schema },
    },
  });

  if (message.stop_reason === "refusal") {
    throw new UpstreamError("Model declined the request");
  }

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  try {
    return JSON.parse(text) as T;
  } catch {
    const s = text.indexOf("{");
    const e = text.lastIndexOf("}");
    if (s !== -1 && e > s) return JSON.parse(text.slice(s, e + 1)) as T;
    throw new UpstreamError("Model did not return valid JSON");
  }
}
