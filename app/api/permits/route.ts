import Anthropic from "@anthropic-ai/sdk";
import { coerceResult, type PermitResult } from "@/lib/permits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/* Opus 4.8 at high effort with adaptive thinking: the permit map's accuracy
   IS the product, so this call gets the most capable model configuration. */
const MODEL = "claude-opus-4-8";

const SYSTEM = `You are Aiivo's permit research engine — an expert in U.S. business licensing and compliance across federal, state, county, and city jurisdictions.

Given a business type, a location, and what the business sells or serves, return the complete set of permits, licenses, registrations, and legally-required items the business needs to operate legally.

General rules:
- Be thorough and specific to the jurisdiction. Include every applicable level: federal, state, county, and city. Most small businesses need items at multiple levels.
- Use realistic issuing authorities, costs, processing times, and renewal cadences for the SPECIFIC location given — real agency names, real fee ranges, and the correct renewal cadence (note that many city licenses are biennial, not annual).
- Provide a real, specific filing/portal URL for each item where one exists (the agency's licensing page).
- "estimated_total_cost": a single short dollar figure or range ONLY, with no parenthetical notes or commentary (e.g. "$2,500–$5,000"). Put any caveats in "notes".
- "estimated_timeline": a single short range ONLY, with no explanatory clauses (e.g. "10–18 weeks").
- "total_permits" must equal the number of items in "permits".

Accuracy rules — avoid the most common AI mistakes:
- Jurisdiction overlap: do NOT list a county-level health or food permit for a business located INSIDE a major home-rule city that operates its own health department (e.g., Chicago, New York City, Los Angeles, Houston, San Francisco, Philadelphia). In those cities the city license covers food regulation; a separate county food permit does not apply. Only use a county health/food permit when the address is in unincorporated land or a smaller municipality without its own health department.
- No double-listing: do not add a generic "business license" on top of an activity-specific license that already serves as the operating license (e.g., a Retail Food Establishment License is effectively the business license for a café). If one registration already issues another (e.g., a state tax registration that includes the sales-tax permit), list it once and say so in the description — not as two separate filings.
- Certificate of Occupancy: include it only as "likely_required" or "verify", and state in its description that it is required for a new build-out or a change of use, and may already be in place if the space was previously the same type of business.
- Include commonly-missed legal requirements when they apply: workers' compensation insurance for any business that will have employees (required in nearly every state); for food businesses, BOTH a certified food-protection manager AND basic food-handler training for staff, plus any required pre-opening health-department plan review.

Confidence — tag every item honestly:
- "confirmed": clearly and unconditionally applies to this business in this jurisdiction.
- "likely_required": very probably applies but depends on minor specifics (signage, build-out, hiring).
- "verify": applicability genuinely depends on details not provided — use this instead of guessing.

Notes:
- "notes" is 2–4 short, concrete, location-specific compliance caveats (inspection sequencing, overlapping local taxes, zoning checks, seasonal sub-permits).`;

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    business_summary: { type: "string" },
    jurisdiction: { type: "string" },
    total_permits: { type: "integer" },
    estimated_total_cost: { type: "string" },
    estimated_timeline: { type: "string" },
    permits: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          issuing_authority: { type: "string" },
          level: { type: "string", enum: ["federal", "state", "county", "city"] },
          estimated_cost: { type: "string" },
          processing_time: { type: "string" },
          renewal: { type: "string" },
          description: { type: "string" },
          requirements: { type: "array", items: { type: "string" } },
          confidence: {
            type: "string",
            enum: ["confirmed", "likely_required", "verify"],
          },
          url: { type: "string" },
        },
        required: [
          "name",
          "issuing_authority",
          "level",
          "estimated_cost",
          "processing_time",
          "renewal",
          "description",
          "requirements",
          "confidence",
          "url",
        ],
      },
    },
    notes: { type: "array", items: { type: "string" } },
  },
  required: [
    "business_summary",
    "jurisdiction",
    "total_permits",
    "estimated_total_cost",
    "estimated_timeline",
    "permits",
    "notes",
  ],
} as const;

/* Tolerant JSON extraction — structured outputs returns clean JSON, but this
   keeps us safe if a model ever wraps it in prose or fences. */
function extractJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    /* fall through */
  }
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    try {
      return JSON.parse(fenced[1]);
    } catch {
      /* fall through */
    }
  }
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end > start) {
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {
      /* fall through */
    }
  }
  return null;
}

/* Curated sample so the demo always renders — used when no API key is set or
   the live call fails. Reflects the submitted business so it still feels live. */
function buildSample(
  businessType: string,
  location: string,
  sells: string
): PermitResult {
  const subject = [businessType, location].filter(Boolean).join(" — ");
  return {
    business_summary: `${subject}${sells ? ` (${sells})` : ""}`,
    jurisdiction: location || "United States",
    total_permits: 8,
    estimated_total_cost: "$1,340",
    estimated_timeline: "4–6 weeks",
    permits: [
      {
        name: "Employer Identification Number (EIN)",
        issuing_authority: "Internal Revenue Service",
        level: "federal",
        estimated_cost: "$0",
        processing_time: "Immediate online",
        renewal: "One-time",
        description:
          "Your business's federal tax ID, required to hire employees, open a business bank account, and file taxes.",
        requirements: ["Responsible party SSN/ITIN", "Legal entity formed"],
        confidence: "confirmed",
        url: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      },
      {
        name: "Sales & Use Tax Permit",
        issuing_authority: "State Department of Revenue",
        level: "state",
        estimated_cost: "$0",
        processing_time: "2–3 weeks",
        renewal: "Ongoing",
        description:
          "Authorises you to collect and remit sales tax on taxable goods and services.",
        requirements: ["EIN", "Business address", "NAICS code"],
        confidence: "confirmed",
        url: "https://www.irs.gov/businesses/small-businesses-self-employed",
      },
      {
        name: "Retail Food Establishment Permit",
        issuing_authority: "County / City Health Department",
        level: "city",
        estimated_cost: "$450",
        processing_time: "2–3 weeks",
        renewal: "Annual",
        description:
          "Required for any business preparing or serving food to the public; includes a health inspection.",
        requirements: ["Floor plan", "Menu", "Pre-opening inspection"],
        confidence: "confirmed",
        url: "https://www.fda.gov/food",
      },
      {
        name: "Certified Food Manager",
        issuing_authority: "State Department of Health",
        level: "state",
        estimated_cost: "$115",
        processing_time: "5 days",
        renewal: "5 years",
        description:
          "At least one certified food protection manager is required on staff for food-service operations.",
        requirements: ["Accredited exam", "On-site manager"],
        confidence: "confirmed",
        url: "https://www.fda.gov/food",
      },
      {
        name: "Certificate of Occupancy",
        issuing_authority: "City Development Services",
        level: "city",
        estimated_cost: "$462",
        processing_time: "3–6 weeks",
        renewal: "One-time",
        description:
          "Confirms the building is approved for your specific commercial use and meets code.",
        requirements: ["Signed lease", "Floor plan", "Final inspection"],
        confidence: "likely_required",
        url: "https://www.usa.gov/business-permits",
      },
      {
        name: "Sign Permit",
        issuing_authority: "City Planning Department",
        level: "city",
        estimated_cost: "$189",
        processing_time: "2 weeks",
        renewal: "One-time",
        description:
          "Required before installing exterior signage; rules vary by zoning district.",
        requirements: ["Sign dimensions", "Mounting details"],
        confidence: "likely_required",
        url: "https://www.usa.gov/business-permits",
      },
      {
        name: "Assumed Name (DBA)",
        issuing_authority: "County Clerk",
        level: "county",
        estimated_cost: "$24",
        processing_time: "3 days",
        renewal: "10 years",
        description:
          "Registers the trade name you operate under if it differs from your legal entity name.",
        requirements: ["Legal entity name", "Owner ID"],
        confidence: "confirmed",
        url: "https://www.usa.gov/business-permits",
      },
      {
        name: "Grease Trap Discharge Permit",
        issuing_authority: "City Water Utility",
        level: "city",
        estimated_cost: "$100",
        processing_time: "2 weeks",
        renewal: "Annual",
        description:
          "Governs disposal of fats, oils and grease into the municipal sewer system.",
        requirements: ["Grease interceptor installed", "Site plan"],
        confidence: "verify",
        url: "https://www.epa.gov/npdes",
      },
    ],
    notes: [
      "Costs and timelines are representative ranges — confirm exact fees with each jurisdiction.",
      "Zoning must permit your use at the specific address before a Certificate of Occupancy is issued.",
      "If you plan to serve alcohol, a separate state license applies and typically adds 8–12 weeks.",
    ],
  };
}

export async function POST(req: Request) {
  let body: {
    businessType?: string;
    location?: string;
    sells?: string;
    clarifications?: { question: string; answer: string }[];
  };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const businessType = (body.businessType ?? "").trim();
  const location = (body.location ?? "").trim();
  const sells = (body.sells ?? "").trim();
  const clar = Array.isArray(body.clarifications) ? body.clarifications : [];

  if (!businessType || !location) {
    return Response.json(
      { error: "Business type and location are required." },
      { status: 400 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  // No key configured → serve the curated sample so the demo still works.
  if (!apiKey) {
    console.warn(
      "[aiivo] ANTHROPIC_API_KEY not set — returning sample permit data."
    );
    return Response.json(buildSample(businessType, location, sells), {
      headers: { "x-aiivo-source": "sample" },
    });
  }

  try {
    const client = new Anthropic({ apiKey });
    const clarBlock = clar.length
      ? `\nThe owner answered these clarifying questions — use them to refine the set and raise confidence (for example, drop employee-related filings if there are no employees, or mark a Certificate of Occupancy as not required for an existing same-use space):\n${clar
          .map((c) => `- ${c.question} → ${c.answer}`)
          .join("\n")}\n`
      : "";

    const userPrompt = `Business type: ${businessType}
Location: ${location}
Sells / serves: ${sells || "Not specified"}
${clarBlock}
Return the full compliance permit map for this business.`;

    // Stream so a long, high-effort generation can never hit an HTTP timeout.
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: 32000,
      system: SYSTEM,
      messages: [{ role: "user", content: userPrompt }],
      thinking: { type: "adaptive" },
      output_config: {
        effort: "high",
        format: { type: "json_schema", schema: SCHEMA },
      },
    });
    const message = await stream.finalMessage();

    if (message.stop_reason === "refusal") {
      throw new Error("Model declined the request.");
    }

    const text = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    const result = coerceResult(extractJson(text));
    if (!result) throw new Error("Could not parse a valid permit map.");

    return Response.json(result, { headers: { "x-aiivo-source": "live" } });
  } catch (err) {
    console.error("[aiivo] permit lookup failed:", err);
    // Never break the demo — fall back to the curated sample.
    return Response.json(buildSample(businessType, location, sells), {
      headers: { "x-aiivo-source": "fallback" },
    });
  }
}
