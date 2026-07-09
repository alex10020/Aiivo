export type Confidence = "Confirmed" | "Likely Required" | "Verify";

export const STATS = [
  { value: "8,300", label: "U.S. filing jurisdictions" },
  { value: "300+", label: "license types" },
  { value: "110+", label: "industries covered" },
  { value: "100%", label: "published-benchmark accuracy" },
];

export const DEMO = {
  query: "Coffee shop · Austin, TX",
  permits: 7,
  cost: "$1,340",
  timeline: "4–6 weeks",
  items: [
    {
      name: "Sales & Use Tax Permit",
      authority: "Texas Comptroller",
      cost: "$0",
      time: "2–3 wks",
      confidence: "Confirmed" as Confidence,
      renews: "Ongoing",
    },
    {
      name: "Retail Food Establishment Permit",
      authority: "Austin Public Health",
      cost: "$450",
      time: "2–3 wks",
      confidence: "Confirmed" as Confidence,
      renews: "Annual",
    },
    {
      name: "Certified Food Manager",
      authority: "Texas DSHS",
      cost: "$115",
      time: "5 days",
      confidence: "Confirmed" as Confidence,
      renews: "5 years",
    },
    {
      name: "Certificate of Occupancy",
      authority: "Austin Dev. Services",
      cost: "$462",
      time: "3–6 wks",
      confidence: "Likely Required" as Confidence,
      renews: "One-time",
    },
    {
      name: "Sign Permit",
      authority: "City of Austin",
      cost: "$189",
      time: "2 wks",
      confidence: "Likely Required" as Confidence,
      renews: "One-time",
    },
    {
      name: "Assumed Name (DBA)",
      authority: "Travis County Clerk",
      cost: "$24",
      time: "3 days",
      confidence: "Confirmed" as Confidence,
      renews: "10 years",
    },
    {
      name: "Grease Trap Discharge Permit",
      authority: "Austin Water",
      cost: "$100",
      time: "2 wks",
      confidence: "Verify" as Confidence,
      renews: "Annual",
    },
  ],
};

export const STEPS = [
  {
    n: "01",
    title: "Tell us your business",
    body: "Enter your business type, address, and what you sell or serve. Thirty seconds, no account needed.",
    chip: "30 seconds",
  },
  {
    n: "02",
    title: "Get your permit map",
    body: "Our AI scans a structured database of federal, state, county and city requirements and returns every permit you need — with costs, timelines and filing links.",
    chip: "Instant",
  },
  {
    n: "03",
    title: "We file & renew",
    body: "The agent pre-fills applications, a compliance reviewer verifies them, and we file on your behalf — then monitor for changes and handle renewals automatically.",
    chip: "On autopilot",
  },
];

export const ADVANTAGES = [
  {
    title: "The data moat nobody wants to build",
    body: "8,300 jurisdictions × 300+ license types = millions of requirement combinations. Grinding, thankless data engineering. Big companies skip it; startups find it boring. Whoever finishes first wins permanently.",
    tag: "Defensibility",
    span: "lg",
  },
  {
    title: "A vertical agent in a horizontal graveyard",
    body: "3,800+ horizontal AI agents shut down in 2025. The survivors own one workflow, one buyer, one data source. We own permit discovery, new business owners, and government databases.",
    tag: "Focus",
    span: "sm",
  },
  {
    title: "Customers find us",
    body: "77% of owners Google their compliance questions. We're the answer to “what permits do I need for a food truck in Austin.” Low CAC, high intent.",
    tag: "Distribution",
    span: "sm",
  },
  {
    title: "Recurring revenue, near-zero churn",
    body: "Permits expire. Licenses renew. Regulations change. $49/month on autopilot — because the cost of not renewing is fines and forced closure.",
    tag: "Economics",
    span: "sm",
  },
  {
    title: "The API play is massive",
    body: "Stripe Atlas, LegalZoom, Gusto and Deel each create customers who immediately need permits — and have no structured data to serve them. Aiivo becomes the API they all embed, at $2–5 per lookup with zero marginal cost.",
    tag: "Leverage",
    span: "sm",
  },
];

export const PIPELINE = [
  {
    layer: "Layer 1",
    title: "Structured government data",
    body: "Real data scraped, validated and timestamped from official government sources — not AI-generated content. Every jurisdiction indexed.",
  },
  {
    layer: "Layer 2",
    title: "AI interpretation",
    body: "The model reads your business description and matches it against the structured dataset. It selects applicable permits — it never invents them.",
  },
  {
    layer: "Layer 3",
    title: "Confidence scoring",
    body: "Every permit is tagged Confirmed, Likely Required, or Verify with jurisdiction. You see exactly how certain we are about each item.",
  },
  {
    layer: "Layer 4",
    title: "Human review queue",
    body: "Anything scored below 90% confidence is flagged for human review before delivery. For File-For-Me, every report is verified before a filing is submitted.",
  },
];

export const PRICING = [
  {
    name: "Discover",
    price: "Free",
    cadence: "",
    desc: "See how many permits you need and what they'll cost.",
    features: [
      "Permit count & cost estimate",
      "Jurisdiction breakdown",
      "No account required",
    ],
    cta: "Check my business",
    featured: false,
  },
  {
    name: "Report",
    price: "$99",
    cadence: "one-time",
    desc: "Your full compliance report, every permit detailed.",
    features: [
      "Every permit, cost & timeline",
      "Filing instructions & portal links",
      "Renewal schedules",
      "Source attribution + “last verified”",
    ],
    cta: "Get my report",
    featured: true,
  },
  {
    name: "File For Me",
    price: "$299",
    cadence: "per filing",
    desc: "We file across every jurisdiction on your behalf.",
    features: [
      "Agent-assisted filing",
      "Human compliance review",
      "Submitted & tracked end-to-end",
    ],
    cta: "Have us file",
    featured: false,
  },
  {
    name: "Monitor",
    price: "$49",
    cadence: "per month",
    desc: "Ongoing monitoring and automatic renewals.",
    features: [
      "Requirement-change tracking",
      "Renewal reminders & auto-filing",
      "Multi-jurisdiction coverage",
    ],
    cta: "Stay compliant",
    featured: false,
  },
];

export const COMPETITORS = [
  {
    cat: "Enterprise license mgmt",
    names: "Avalara · CSC · Compliancy",
    note: "Manage existing licenses for 100+ location enterprises. Never touch a first-time owner.",
  },
  {
    cat: "Construction permitting",
    names: "Clad · infra startups",
    note: "Building permits for data centres & factories. Different permit, buyer and data source.",
  },
  {
    cat: "Company formation",
    names: "LegalZoom · Stripe Atlas · Doola",
    note: "Form your LLC, get your EIN — then stop. We pick up exactly where they leave off.",
  },
  {
    cat: "Software compliance",
    names: "Vanta · Drata · Secureframe",
    note: "SOC 2, HIPAA, GDPR for tech companies. Different regulators, requirements and buyers.",
  },
];

export const NAV_LINKS = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Demo", href: "/demo" },
  { label: "Why Aiivo", href: "/why" },
  { label: "Pricing", href: "/pricing" },
];
