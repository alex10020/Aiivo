import Anthropic from "@anthropic-ai/sdk";
import type { ClarifyQuestion } from "@/lib/permits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

/* Clarify is latency-sensitive and simple — Opus 4.8 at low effort keeps it
   fast while staying on the same model family as the permit engine. */
const MODEL = "claude-opus-4-8";

const SYSTEM = `You are Aiivo's intake assistant. Given a business type, a location, and what it sells, produce a SHORT set of clarifying questions whose answers would genuinely change which permits apply.

Rules:
- Ask 2–4 questions, no more. Only ask things that materially change the permit set — for example: whether there will be employees; whether alcohol or other regulated products are sold; whether the space is a new build-out or an existing same-use space; seating/size; home-based vs commercial; or a specific service that triggers extra licensing.
- Do NOT ask for anything already implied by the inputs.
- Each question gets 2–5 short, concrete options. Include a neutral "Not sure" option where it helps.
- "multiple" is true only when several options can apply at once; otherwise false.
- Keep "question" under ~12 words and "help" to a brief one-line reason it matters.
- "id" is a short lowercase slug (e.g. "employees", "alcohol", "buildout").`;

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          question: { type: "string" },
          help: { type: "string" },
          multiple: { type: "boolean" },
          options: { type: "array", items: { type: "string" } },
        },
        required: ["id", "question", "help", "multiple", "options"],
      },
    },
  },
  required: ["questions"],
} as const;

const FALLBACK: ClarifyQuestion[] = [
  {
    id: "employees",
    question: "Will you have employees?",
    help: "Triggers workers' comp, payroll withholding and unemployment registration.",
    multiple: false,
    options: ["Yes", "No", "Not yet"],
  },
  {
    id: "space",
    question: "Is this a new build-out or an existing space?",
    help: "Decides whether a Certificate of Occupancy and new inspections apply.",
    multiple: false,
    options: ["New build-out", "Existing same-use space", "Not sure"],
  },
  {
    id: "alcohol",
    question: "Will you sell or serve alcohol?",
    help: "Adds a separate state license with a longer lead time.",
    multiple: false,
    options: ["Yes", "No"],
  },
];

function extractJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    /* ignore */
  }
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end > start) {
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {
      /* ignore */
    }
  }
  return null;
}

function coerceQuestions(raw: unknown): ClarifyQuestion[] {
  if (!raw || typeof raw !== "object") return [];
  const qs = (raw as { questions?: unknown }).questions;
  if (!Array.isArray(qs)) return [];
  return qs
    .map((q): ClarifyQuestion | null => {
      if (!q || typeof q !== "object") return null;
      const o = q as Record<string, unknown>;
      const options = Array.isArray(o.options)
        ? (o.options as unknown[]).map(String).filter(Boolean)
        : [];
      if (!o.question || options.length < 2) return null;
      return {
        id: String(o.id ?? o.question),
        question: String(o.question),
        help: String(o.help ?? ""),
        multiple: Boolean(o.multiple),
        options,
      };
    })
    .filter((q): q is ClarifyQuestion => q !== null)
    .slice(0, 4);
}

export async function POST(req: Request) {
  let body: { businessType?: string; location?: string; sells?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ questions: FALLBACK });
  }

  const businessType = (body.businessType ?? "").trim();
  const location = (body.location ?? "").trim();
  const sells = (body.sells ?? "").trim();

  if (!businessType || !location) {
    return Response.json({ questions: FALLBACK });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return Response.json({ questions: FALLBACK });

  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 1500,
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `Business type: ${businessType}
Location: ${location}
Sells / serves: ${sells || "Not specified"}

Produce the clarifying questions.`,
        },
      ],
      output_config: {
        effort: "low",
        format: { type: "json_schema", schema: SCHEMA },
      },
    });

    const text = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    const questions = coerceQuestions(extractJson(text));
    return Response.json({ questions: questions.length ? questions : FALLBACK });
  } catch (err) {
    console.error("[aiivo] clarify failed:", err);
    return Response.json({ questions: FALLBACK });
  }
}
