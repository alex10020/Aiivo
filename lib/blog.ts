/* ---------------------------------------------------------------------------
   The Aiivo Bulletin — blog content.
   Hardcoded + deterministic (no Date.now), matching the "official record" voice
   used by the legal pages. Posts are ordered newest-first. Add new entries at
   the top and bump the record number (AIV-BUL-0NN).
--------------------------------------------------------------------------- */

export type BlogSection = { heading?: string; paras: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // display
  iso: string; // machine-readable for <time dateTime>
  readMins: number;
  recordNo: string;
  body: BlogSection[];
};

export const BYLINE = "Aiivo compliance desk";

export const POSTS: BlogPost[] = [
  {
    slug: "coffee-shop-permits-austin",
    title: "What permits do you need to open a coffee shop in Austin?",
    excerpt:
      "Seven permits, four agencies, about $1,340. Here is the full list a new café in Austin actually has to file — and the order to do it in.",
    category: "Guides",
    date: "June 24, 2026",
    iso: "2026-06-24",
    readMins: 6,
    recordNo: "AIV-BUL-014",
    body: [
      {
        paras: [
          "Opening a café in Austin is mostly paperwork you can't see until you're already signing a lease. A coffee shop touches food safety, sales tax, signage, wastewater and building occupancy — five different desks across three levels of government. Here's the full list, in the order that actually makes sense to file them.",
        ],
      },
      {
        heading: "Start with the state",
        paras: [
          "Texas doesn't issue a general \"business license,\" which trips up a lot of first-time owners. What you do need first is a Sales and Use Tax Permit from the Texas Comptroller. It's free, it's required the moment you sell a taxable item, and most other filings assume you already have it.",
          "If you're trading under anything other than your exact legal name, file an Assumed Name (DBA) with the Travis County Clerk — about $24 and a few days.",
        ],
      },
      {
        heading: "Then the kitchen",
        paras: [
          "Serving food and espresso brings in Austin Public Health. You'll need a Retail Food Establishment permit (around $450, renewed annually) and at least one Certified Food Manager on staff.",
          "If your build-out includes a commercial kitchen, the city will also want a Grease Trap Discharge permit through Austin Water. This one is jurisdiction-specific, so verify whether your particular space actually triggers it.",
        ],
      },
      {
        heading: "Then the building and the sign",
        paras: [
          "Before you can open the doors, the space needs a Certificate of Occupancy from Austin Development Services confirming it's approved for your use. Any exterior signage typically needs its own Sign Permit from the City of Austin. Both depend on your exact address and build-out, which is why generic checklists tend to get them wrong.",
        ],
      },
      {
        heading: "The damage",
        paras: [
          "All in, a typical Austin coffee shop files about seven permits, spends roughly $1,340 in government fees, and waits four to six weeks — with the Certificate of Occupancy usually the long pole.",
          "None of it is hard. The hard part is knowing the list exists before an inspector hands it to you.",
        ],
      },
    ],
  },
  {
    slug: "cost-of-operating-without-a-license",
    title: "The real cost of operating without a license",
    excerpt:
      "Fines are the headline. The quieter costs — forced closure, denied insurance claims, personal liability — are what actually sink a business.",
    category: "Deep dive",
    date: "June 17, 2026",
    iso: "2026-06-17",
    readMins: 5,
    recordNo: "AIV-BUL-013",
    body: [
      {
        paras: [
          "Most businesses that operate without the right permits aren't cutting corners on purpose. They just never found out a permit existed. The penalty system doesn't care about intent.",
        ],
      },
      {
        heading: "The fines are the cheap part",
        paras: [
          "Operating without a required license commonly runs $1,000 to $10,000 in fines, and many jurisdictions assess them per day. But the fine is usually the smallest number on the bill.",
        ],
      },
      {
        heading: "Forced closure",
        paras: [
          "A code officer can issue a stop-work or cease-operations order on the spot. For a business with payroll, a lease and perishable inventory, even a two-week shutdown can be fatal — and reopening often means going to the back of the permitting queue.",
        ],
      },
      {
        heading: "The claim that doesn't pay",
        paras: [
          "Here's the quiet one: many commercial insurance policies exclude losses incurred while you were operating illegally. A fire or an injury during an unlicensed period can mean the claim is denied entirely, turning a covered event into a personal liability.",
        ],
      },
      {
        heading: "Compliance as insurance",
        paras: [
          "Set against all of that, the cost of getting licensed — often a few hundred dollars and a few weeks — is one of the cheapest forms of insurance a new business can buy. The expensive mistake is assuming that silence from the government means approval.",
        ],
      },
    ],
  },
  {
    slug: "how-often-business-licenses-change",
    title: "How often do business licenses actually change?",
    excerpt:
      "More than you'd think, and rarely with a notice in the mail. Why \"set it and forget it\" is the most expensive way to stay licensed.",
    category: "Policy watch",
    date: "June 9, 2026",
    iso: "2026-06-09",
    readMins: 4,
    recordNo: "AIV-BUL-012",
    body: [
      {
        paras: [
          "Getting licensed once feels like crossing a finish line. It's closer to the starting line. Licenses expire, rules shift, and nobody mails you a reminder.",
        ],
      },
      {
        heading: "Renewal cadences are all over the map",
        paras: [
          "A single business can hold permits that renew annually, every two years, every five years, and one-time-only — each with its own deadline and its own agency. There is no unified renewal date, which is exactly why owners miss them.",
        ],
      },
      {
        heading: "The rules themselves move",
        paras: [
          "Fee schedules get updated, thresholds change, and new requirements appear — often through a city council vote or an agency rule change that never reaches your inbox. A permit that was optional last year can be mandatory this year.",
        ],
      },
      {
        heading: "No one is watching for you",
        paras: [
          "Agencies are not in the business of reminding you. The burden sits entirely on the owner to track every deadline and every rule change across every jurisdiction they operate in. \"Set it and forget it\" is how a compliant business quietly becomes a non-compliant one.",
        ],
      },
      {
        heading: "Why we re-verify on a clock",
        paras: [
          "This is the whole reason Aiivo timestamps every requirement and re-verifies anything older than 90 days against its source. Monitoring isn't an upsell — it's the only way a license stays true after the day you earned it.",
        ],
      },
    ],
  },
  {
    slug: "permit-checklist-new-business",
    title: "A 7-step permit checklist for any new business",
    excerpt:
      "Industry and city change the details, but the sequence is always the same. Work it top to bottom and you won't miss a filing.",
    category: "Playbook",
    date: "May 28, 2026",
    iso: "2026-05-28",
    readMins: 7,
    recordNo: "AIV-BUL-011",
    body: [
      {
        paras: [
          "The specific permits change with your industry and your city. The sequence almost never does. Work this list top to bottom and you'll catch the filings that owners most often miss.",
        ],
      },
      {
        heading: "01 · Form the legal entity",
        paras: [
          "Register your LLC or corporation with the state and get your federal EIN from the IRS. Almost everything downstream — bank accounts, tax permits, licenses — asks for these first.",
        ],
      },
      {
        heading: "02 · File your assumed name (DBA)",
        paras: [
          "If you'll operate under any name other than your exact legal entity name, register it with the appropriate county or state office before you put it on a sign or a receipt.",
        ],
      },
      {
        heading: "03 · Register for state taxes",
        paras: [
          "Most states require a sales-and-use tax permit the moment you sell taxable goods or services. Some also require employer or franchise tax registration.",
        ],
      },
      {
        heading: "04 · Get your industry license",
        paras: [
          "This is the big one and the most variable: the license specific to what you do — food service, contracting, childcare, salon, retail alcohol, and hundreds more. Each has its own agency and its own prerequisites.",
        ],
      },
      {
        heading: "05 · Clear local zoning and occupancy",
        paras: [
          "Your city or county confirms your location is approved for your use, usually through zoning sign-off and a Certificate of Occupancy. Skipping this is the most common reason an opening date slips.",
        ],
      },
      {
        heading: "06 · Handle the specialty permits",
        paras: [
          "Signage, health inspections, fire, wastewater, home-occupation, special-event — the long tail of small permits that depend on your exact build-out and address. Easy to overlook, expensive to ignore.",
        ],
      },
      {
        heading: "07 · Set up renewals and monitoring",
        paras: [
          "Record every expiration date and watch for rule changes. The work of staying licensed never fully ends, so build the reminder system before you need it.",
          "Run a real business through this and the list gets specific fast — which permit, which agency, what it costs. That's exactly the part Aiivo automates.",
        ],
      },
    ],
  },
];
