/* =============================================================================
   [A] DATA / MOAT — in-repo seed (MVP), generated from compact state/city config.
   Coverage: US federal + TX/Austin, IL/Chicago, CO/Denver, TN/Nashville,
   OR/Portland, NY/New York, CA/Los Angeles — food & retail. Sourced + dated.
   The Data workstream swaps this for Postgres tables + scrapers; shapes match
   lib/engine/types.ts so it's a drop-in.
   ========================================================================== */

import type {
  Jurisdiction,
  PermitType,
  Requirement,
  Source,
} from "../types";

const T = "2026-01-01T00:00:00Z";
const V = "2026-06-01T00:00:00Z"; // last_verified — fresh (<90d)
const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const FOOD = ["722"];
const RETAIL = ["44", "45"];

const pt = (
  id: string,
  s: string,
  name: string,
  level: PermitType["defaultLevel"],
  naics: string[],
  tags: string[]
): PermitType => ({ id, slug: s, name, description: "", defaultLevel: level, naics, tags, createdAt: T, updatedAt: T });

export const PERMIT_TYPES: PermitType[] = [
  pt("ein", "ein", "Employer Identification Number (EIN)", "federal", [], ["tax"]),
  pt("sales-tax", "sales-use-tax", "Sales & Use Tax Permit", "state", [...FOOD, ...RETAIL], ["tax"]),
  pt("withholding", "employer-withholding", "Employer Withholding Registration", "state", [], ["employees"]),
  pt("ui", "unemployment-insurance", "Unemployment Insurance Registration", "state", [], ["employees"]),
  pt("workers-comp", "workers-comp", "Workers' Compensation Insurance", "state", [], ["employees"]),
  pt("food-manager", "certified-food-manager", "Certified Food Protection Manager", "state", FOOD, ["food"]),
  pt("food-handler", "food-handler", "Food Handler Training", "city", FOOD, ["food"]),
  pt("retail-food", "retail-food-establishment", "Retail Food Establishment License", "city", FOOD, ["food"]),
  pt("dba", "assumed-name-dba", "Assumed Name (DBA)", "county", [], ["name"]),
  pt("cert-occ", "certificate-of-occupancy", "Certificate of Occupancy", "city", [...FOOD, ...RETAIL], ["premises"]),
  pt("sign", "sign-permit", "Sign Permit", "city", [...FOOD, ...RETAIL], ["signage"]),
  pt("biz-license", "business-license", "Limited Business License", "city", RETAIL, ["operating"]),
];

/* ----------------------------- config ------------------------------------- */
type Agency = [name: string, url: string];
interface CityCfg {
  name: string;
  placeFips: string;
  countyName: string;
  countyFips: string;
  health: Agency;
  buildings: Agency;
  business: Agency;
  clerk: Agency;
  fees: { food: string; co: string; sign: string; dba: string; bizLicense?: string; foodHandler?: string };
  extras?: { bizLicense?: boolean; foodHandler?: boolean };
  /* Where retail-food licensing actually sits for this city:
     "city" (default — city health dept), "county" (county health district,
     e.g. Seattle/King Co., Phoenix/Maricopa), or "state" (state agency
     licenses restaurants directly, e.g. Florida DBPR). */
  foodLevel?: "city" | "county" | "state";
}
interface StateCfg {
  code: string;
  name: string;
  url: string;
  noSalesTax?: boolean;
  revenue: Agency;
  labor: Agency;
  wc: Agency;
  health: Agency;
  foodMgrFee: string;
  /* State-level restaurant licensing agency + fee (used when a city sets
     foodLevel: "state" — e.g. Florida DBPR). */
  stateFood?: { agency: Agency; fee: string };
  /* States with a general STATE business license (e.g. Nevada, Washington). */
  stateBizLicense?: { agency: Agency; fee: string };
  cities: CityCfg[];
}

const STATES: StateCfg[] = [
  {
    code: "TX", name: "Texas", url: "https://www.texas.gov",
    revenue: ["Texas Comptroller of Public Accounts", "https://comptroller.texas.gov/taxes/permit/"],
    labor: ["Texas Workforce Commission", "https://www.twc.texas.gov/businesses/unemployment-tax"],
    wc: ["Texas Dept. of Insurance (Workers' Comp)", "https://www.tdi.texas.gov/wc/employer/index.html"],
    health: ["Texas DSHS", "https://www.dshs.texas.gov/food-handlers"], foodMgrFee: "$115",
    cities: [{
      name: "Austin", placeFips: "4805000", countyName: "Travis County", countyFips: "48453",
      health: ["Austin Public Health", "https://www.austintexas.gov/department/food-establishments"],
      buildings: ["Austin Development Services", "https://www.austintexas.gov/department/development-services"],
      business: ["City of Austin", "https://www.austintexas.gov"],
      clerk: ["Travis County Clerk", "https://countyclerk.traviscountytx.gov/"],
      fees: { food: "$450", co: "$462", sign: "$189", dba: "$24" },
    }],
  },
  {
    code: "IL", name: "Illinois", url: "https://www.illinois.gov",
    revenue: ["Illinois Dept. of Revenue", "https://tax.illinois.gov/businesses/register-a-business.html"],
    labor: ["Illinois Dept. of Employment Security", "https://ides.illinois.gov/employer-resources.html"],
    wc: ["Illinois Workers' Compensation Commission", "https://iwcc.illinois.gov/"],
    health: ["Illinois Dept. of Public Health", "https://dph.illinois.gov/"], foodMgrFee: "$100–$200",
    cities: [{
      name: "Chicago", placeFips: "1714000", countyName: "Cook County", countyFips: "17031",
      health: ["Chicago Dept. of Public Health", "https://www.chicago.gov/city/en/depts/cdph.html"],
      buildings: ["Chicago Dept. of Buildings", "https://www.chicago.gov/city/en/depts/bldgs.html"],
      business: ["Chicago Dept. of Business Affairs & Consumer Protection", "https://www.chicago.gov/city/en/depts/bacp.html"],
      clerk: ["Cook County Clerk", "https://www.cookcountyclerkil.gov/"],
      fees: { food: "$660", co: "$150–$600", sign: "$150–$500", dba: "$50", bizLicense: "$250–$330", foodHandler: "$0–$15" },
      extras: { bizLicense: true, foodHandler: true },
    }],
  },
  {
    code: "CO", name: "Colorado", url: "https://www.colorado.gov",
    revenue: ["Colorado Dept. of Revenue", "https://tax.colorado.gov/sales-tax-account-license"],
    labor: ["Colorado Dept. of Labor & Employment", "https://cdle.colorado.gov/"],
    wc: ["Colorado Div. of Workers' Compensation", "https://cdle.colorado.gov/dwc"],
    health: ["Colorado Dept. of Public Health & Environment", "https://cdphe.colorado.gov/"], foodMgrFee: "$100–$150",
    cities: [{
      name: "Denver", placeFips: "0820000", countyName: "Denver County", countyFips: "08031",
      health: ["Denver Dept. of Public Health & Environment", "https://www.denvergov.org/Government/Agencies-Departments-Offices/Agencies-Departments-Offices-Directory/Public-Health-Environment"],
      buildings: ["Denver Community Planning & Development", "https://www.denvergov.org/Government/Agencies-Departments-Offices/Agencies-Departments-Offices-Directory/Community-Planning-and-Development"],
      business: ["Denver Business Licensing Center", "https://www.denvergov.org/Government/Agencies-Departments-Offices/Business-Licensing"],
      clerk: ["Denver Clerk & Recorder", "https://www.denvergov.org/Government/Agencies-Departments-Offices/Clerk-and-Recorder"],
      fees: { food: "$415", co: "$200–$500", sign: "$150–$400", dba: "$20", bizLicense: "$50–$100" },
      extras: { bizLicense: true },
    }],
  },
  {
    code: "TN", name: "Tennessee", url: "https://www.tn.gov",
    revenue: ["Tennessee Dept. of Revenue", "https://www.tn.gov/revenue/taxes/sales-and-use-tax.html"],
    labor: ["Tennessee Dept. of Labor & Workforce Development", "https://www.tn.gov/workforce.html"],
    wc: ["Tennessee Bureau of Workers' Compensation", "https://www.tn.gov/workforce/injuries-at-work.html"],
    health: ["Tennessee Dept. of Health", "https://www.tn.gov/health.html"], foodMgrFee: "$100–$150",
    cities: [{
      name: "Nashville", placeFips: "4752006", countyName: "Davidson County", countyFips: "47037",
      health: ["Metro Public Health Dept. of Nashville/Davidson", "https://www.nashville.gov/departments/health"],
      buildings: ["Metro Codes Dept.", "https://www.nashville.gov/departments/codes-and-building-safety"],
      business: ["Metro Clerk (Business Tax)", "https://www.nashville.gov/departments/clerk"],
      clerk: ["Davidson County Clerk", "https://www.nashville.gov/departments/county-clerk"],
      fees: { food: "$300–$500", co: "$150–$400", sign: "$100–$300", dba: "$15" },
    }],
  },
  {
    code: "OR", name: "Oregon", url: "https://www.oregon.gov", noSalesTax: true,
    revenue: ["Oregon Dept. of Revenue", "https://www.oregon.gov/dor/"],
    labor: ["Oregon Employment Dept.", "https://www.oregon.gov/employ/"],
    wc: ["Oregon Workers' Compensation Division", "https://www.oregon.gov/dcbs/wcd/"],
    health: ["Oregon Health Authority", "https://www.oregon.gov/oha/"], foodMgrFee: "$10–$50",
    cities: [{
      name: "Portland", placeFips: "4159000", countyName: "Multnomah County", countyFips: "41051",
      health: ["Multnomah County Environmental Health", "https://www.multco.us/health/environmental-health"],
      buildings: ["Portland Bureau of Development Services", "https://www.portland.gov/bds"],
      business: ["City of Portland Revenue Division", "https://www.portland.gov/revenue"],
      clerk: ["Multnomah County", "https://www.multco.us/"],
      fees: { food: "$525", co: "$200–$500", sign: "$150–$400", dba: "$50", bizLicense: "Revenue-based" },
      extras: { bizLicense: true },
    }],
  },
  {
    code: "NY", name: "New York", url: "https://www.ny.gov",
    revenue: ["NY State Dept. of Taxation & Finance", "https://www.tax.ny.gov/"],
    labor: ["NY State Dept. of Labor", "https://dol.ny.gov/"],
    wc: ["NY Workers' Compensation Board", "https://www.wcb.ny.gov/"],
    health: ["NY State Dept. of Health", "https://www.health.ny.gov/"], foodMgrFee: "$0–$160",
    cities: [{
      name: "New York", placeFips: "3651000", countyName: "New York County", countyFips: "36061",
      health: ["NYC Dept. of Health & Mental Hygiene", "https://www.nyc.gov/site/doh/index.page"],
      buildings: ["NYC Dept. of Buildings", "https://www.nyc.gov/site/buildings/index.page"],
      business: ["NYC Dept. of Consumer & Worker Protection", "https://www.nyc.gov/site/dca/index.page"],
      clerk: ["NYC County Clerk", "https://www.nycourts.gov/courts/1jd/newyork/CountyClerk.shtml"],
      fees: { food: "$280", co: "$130–$600", sign: "$200–$600", dba: "$33", bizLicense: "$50–$340" },
      extras: { bizLicense: true },
    }],
  },
  {
    code: "CA", name: "California", url: "https://www.ca.gov",
    revenue: ["California Dept. of Tax & Fee Administration", "https://www.cdtfa.ca.gov/"],
    labor: ["California Employment Development Dept.", "https://edd.ca.gov/"],
    wc: ["California Div. of Workers' Compensation", "https://www.dir.ca.gov/dwc/"],
    health: ["California Dept. of Public Health", "https://www.cdph.ca.gov/"], foodMgrFee: "$100–$160",
    cities: [{
      name: "Los Angeles", placeFips: "0644000", countyName: "Los Angeles County", countyFips: "06037",
      health: ["LA County Dept. of Public Health", "http://publichealth.lacounty.gov/eh/"],
      buildings: ["LA Dept. of Building & Safety", "https://www.ladbs.org/"],
      business: ["LA Office of Finance", "https://finance.lacity.gov/"],
      clerk: ["LA County Registrar-Recorder/County Clerk", "https://www.lavote.gov/"],
      fees: { food: "$400–$1,000", co: "$200–$600", sign: "$300–$700", dba: "$26", bizLicense: "$150+" },
      extras: { bizLicense: true },
    }],
  },
  {
    code: "FL", name: "Florida", url: "https://www.myflorida.com",
    revenue: ["Florida Dept. of Revenue", "https://floridarevenue.com/taxes/registration/"],
    labor: ["Florida Dept. of Commerce (Reemployment Tax)", "https://floridarevenue.com/taxes/taxesfees/Pages/reemployment.aspx"],
    wc: ["Florida Div. of Workers' Compensation", "https://myfloridacfo.com/division/wc/"],
    health: ["Florida DBPR", "https://www2.myfloridalicense.com/hotels-restaurants/"], foodMgrFee: "$100–$160",
    stateFood: { agency: ["Florida DBPR, Div. of Hotels & Restaurants", "https://www2.myfloridalicense.com/hotels-restaurants/"], fee: "$347–$457" },
    cities: [{
      name: "Miami", placeFips: "1245000", countyName: "Miami-Dade County", countyFips: "12086",
      health: ["Florida DBPR (state-licensed)", "https://www2.myfloridalicense.com/hotels-restaurants/"],
      buildings: ["Miami Building Dept.", "https://www.miami.gov/Services/Building-Permitting"],
      business: ["City of Miami (Business Tax Receipt)", "https://www.miami.gov/Services/Business-Licensing"],
      clerk: ["Miami-Dade County Clerk", "https://www.miamidadeclerk.gov/"],
      fees: { food: "$347–$457", co: "$150–$500", sign: "$150–$500", dba: "$50", bizLicense: "$45–$500" },
      extras: { bizLicense: true },
      foodLevel: "state",
    }],
  },
  {
    code: "WA", name: "Washington", url: "https://www.wa.gov", noSalesTax: false,
    revenue: ["Washington Dept. of Revenue", "https://dor.wa.gov/open-business"],
    labor: ["Washington Employment Security Dept.", "https://esd.wa.gov/employer-taxes"],
    wc: ["Washington Dept. of Labor & Industries", "https://lni.wa.gov/insurance/"],
    health: ["Washington State Dept. of Health", "https://doh.wa.gov/"], foodMgrFee: "$10–$40",
    stateBizLicense: { agency: ["Washington Dept. of Revenue (Business Licensing Service)", "https://dor.wa.gov/open-business/apply-business-license"], fee: "$90" },
    cities: [{
      name: "Seattle", placeFips: "5363000", countyName: "King County", countyFips: "53033",
      health: ["Public Health — Seattle & King County", "https://kingcounty.gov/en/dept/dph/health-safety/food-safety"],
      buildings: ["Seattle Dept. of Construction & Inspections", "https://www.seattle.gov/sdci"],
      business: ["City of Seattle (Business License Tax Certificate)", "https://www.seattle.gov/license-and-tax-administration"],
      clerk: ["King County Recorder", "https://kingcounty.gov/en/dept/executive-services/certificates-permits-licenses/recorders-office"],
      fees: { food: "$400–$1,100", co: "$200–$500", sign: "$150–$500", dba: "$5", bizLicense: "$61+ (revenue-based)" },
      extras: { bizLicense: true },
      foodLevel: "county",
    }],
  },
  {
    code: "GA", name: "Georgia", url: "https://georgia.gov",
    revenue: ["Georgia Dept. of Revenue", "https://dor.georgia.gov/register-new-business"],
    labor: ["Georgia Dept. of Labor", "https://dol.georgia.gov/"],
    wc: ["Georgia State Board of Workers' Compensation", "https://sbwc.georgia.gov/"],
    health: ["Georgia Dept. of Public Health", "https://dph.georgia.gov/environmental-health/food-service"], foodMgrFee: "$100–$160",
    cities: [{
      name: "Atlanta", placeFips: "1304000", countyName: "Fulton County", countyFips: "13121",
      health: ["Fulton County Board of Health", "https://fultoncountyga.gov/services/health-services/environmental-health"],
      buildings: ["Atlanta Office of Buildings", "https://www.atlantaga.gov/government/departments/city-planning/office-of-buildings"],
      business: ["City of Atlanta (Occupation Tax / Business License)", "https://www.atlantaga.gov/government/departments/finance/business-licensing"],
      clerk: ["Fulton County Clerk of Superior Court", "https://fultonclerk.org/"],
      fees: { food: "$300–$700", co: "$150–$500", sign: "$150–$500", dba: "$171", bizLicense: "$75+ (revenue-based)" },
      extras: { bizLicense: true },
      foodLevel: "county",
    }],
  },
  {
    code: "AZ", name: "Arizona", url: "https://az.gov",
    revenue: ["Arizona Dept. of Revenue (TPT)", "https://azdor.gov/transaction-privilege-tax/tpt-license"],
    labor: ["Arizona Dept. of Economic Security", "https://des.az.gov/services/employment/unemployment-employer"],
    wc: ["Industrial Commission of Arizona", "https://www.azica.gov/divisions/workers-compensation"],
    health: ["Arizona Dept. of Health Services", "https://www.azdhs.gov/"], foodMgrFee: "$50–$150",
    cities: [{
      name: "Phoenix", placeFips: "0455000", countyName: "Maricopa County", countyFips: "04013",
      health: ["Maricopa County Environmental Services", "https://www.maricopa.gov/1911/Environmental-Services"],
      buildings: ["Phoenix Planning & Development", "https://www.phoenix.gov/pdd"],
      business: ["City of Phoenix", "https://www.phoenix.gov/"],
      clerk: ["Maricopa County Recorder", "https://recorder.maricopa.gov/"],
      fees: { food: "$300–$1,000", co: "$150–$500", sign: "$150–$400", dba: "$10", bizLicense: "$12+ (TPT per location)" },
      foodLevel: "county",
    }],
  },
  {
    code: "MA", name: "Massachusetts", url: "https://www.mass.gov",
    revenue: ["Massachusetts Dept. of Revenue (MassTaxConnect)", "https://www.mass.gov/how-to/register-your-business-with-masstaxconnect"],
    labor: ["Massachusetts Dept. of Unemployment Assistance", "https://www.mass.gov/orgs/department-of-unemployment-assistance"],
    wc: ["Massachusetts Dept. of Industrial Accidents", "https://www.mass.gov/orgs/department-of-industrial-accidents"],
    health: ["Massachusetts Dept. of Public Health", "https://www.mass.gov/orgs/department-of-public-health"], foodMgrFee: "$100–$160",
    cities: [{
      name: "Boston", placeFips: "2507000", countyName: "Suffolk County", countyFips: "25025",
      health: ["Boston Inspectional Services (Health Division)", "https://www.boston.gov/departments/inspectional-services"],
      buildings: ["Boston Inspectional Services", "https://www.boston.gov/departments/inspectional-services"],
      business: ["City of Boston", "https://www.boston.gov/"],
      clerk: ["Boston City Clerk", "https://www.boston.gov/departments/city-clerk"],
      fees: { food: "$100–$500", co: "$50–$300", sign: "$100–$400", dba: "$65" },
    }],
  },
  {
    code: "PA", name: "Pennsylvania", url: "https://www.pa.gov",
    revenue: ["Pennsylvania Dept. of Revenue", "https://www.pa.gov/agencies/revenue/"],
    labor: ["Pennsylvania Dept. of Labor & Industry", "https://www.pa.gov/agencies/dli/"],
    wc: ["Pennsylvania Bureau of Workers' Compensation", "https://www.pa.gov/agencies/dli/programs-services/workers-compensation.html"],
    health: ["Pennsylvania Dept. of Agriculture (Food Safety)", "https://www.pa.gov/agencies/pda/"], foodMgrFee: "$100–$180",
    cities: [{
      name: "Philadelphia", placeFips: "4260000", countyName: "Philadelphia County", countyFips: "42101",
      health: ["Philadelphia Dept. of Public Health", "https://www.phila.gov/departments/department-of-public-health/"],
      buildings: ["Philadelphia Dept. of Licenses & Inspections", "https://www.phila.gov/departments/department-of-licenses-and-inspections/"],
      business: ["Philadelphia Dept. of Licenses & Inspections (Commercial Activity License)", "https://www.phila.gov/services/permits-violations-licenses/get-a-license/business-licenses/"],
      clerk: ["Philadelphia Dept. of Records", "https://www.phila.gov/departments/department-of-records/"],
      fees: { food: "$150–$300", co: "$100–$400", sign: "$100–$400", dba: "$70", bizLicense: "$0" },
      extras: { bizLicense: true },
    }],
  },
  {
    code: "MI", name: "Michigan", url: "https://www.michigan.gov",
    revenue: ["Michigan Dept. of Treasury", "https://www.michigan.gov/taxes/business-taxes/sales-use-tax"],
    labor: ["Michigan Unemployment Insurance Agency", "https://www.michigan.gov/leo/bureaus-agencies/uia"],
    wc: ["Michigan Workers' Disability Compensation Agency", "https://www.michigan.gov/leo/bureaus-agencies/wdca"],
    health: ["Michigan Dept. of Agriculture & Rural Development", "https://www.michigan.gov/mdard/food-dairy"], foodMgrFee: "$100–$180",
    cities: [{
      name: "Detroit", placeFips: "2622000", countyName: "Wayne County", countyFips: "26163",
      health: ["Detroit Health Dept.", "https://detroitmi.gov/departments/detroit-health-department"],
      buildings: ["Detroit Buildings, Safety Engineering & Environmental Dept.", "https://detroitmi.gov/departments/buildings-safety-engineering-and-environmental-department"],
      business: ["City of Detroit (Business Licensing)", "https://detroitmi.gov/how-do-i/get-business-license"],
      clerk: ["Wayne County Clerk", "https://www.waynecounty.com/elected/clerk/"],
      fees: { food: "$400–$600", co: "$150–$500", sign: "$100–$400", dba: "$10–$25", bizLicense: "$75–$300" },
      extras: { bizLicense: true },
    }],
  },
  {
    code: "NC", name: "North Carolina", url: "https://www.nc.gov",
    revenue: ["North Carolina Dept. of Revenue", "https://www.ncdor.gov/taxes-forms/sales-and-use-tax"],
    labor: ["North Carolina Div. of Employment Security", "https://des.nc.gov/"],
    wc: ["North Carolina Industrial Commission", "https://www.ic.nc.gov/"],
    health: ["North Carolina DHHS (Food Protection)", "https://www.ncdhhs.gov/divisions/public-health"], foodMgrFee: "$100–$160",
    cities: [{
      name: "Charlotte", placeFips: "3712000", countyName: "Mecklenburg County", countyFips: "37119",
      health: ["Mecklenburg County Public Health", "https://www.mecknc.gov/HealthDepartment"],
      buildings: ["Charlotte-Mecklenburg Code Enforcement", "https://www.mecknc.gov/CodeEnforcement"],
      business: ["City of Charlotte", "https://www.charlottenc.gov/"],
      clerk: ["Mecklenburg County Register of Deeds", "https://www.mecknc.gov/ROD"],
      fees: { food: "$0 (no state fee)", co: "$100–$400", sign: "$100–$400", dba: "$26" },
      foodLevel: "county",
    }],
  },
  {
    code: "NV", name: "Nevada", url: "https://nv.gov",
    revenue: ["Nevada Dept. of Taxation", "https://tax.nv.gov/"],
    labor: ["Nevada Dept. of Employment, Training & Rehabilitation", "https://detr.nv.gov/"],
    wc: ["Nevada Div. of Industrial Relations", "https://dir.nv.gov/WCS/Home/"],
    health: ["Nevada Div. of Public & Behavioral Health", "https://dpbh.nv.gov/"], foodMgrFee: "$0–$100",
    stateBizLicense: { agency: ["Nevada Secretary of State (State Business License)", "https://www.nvsos.gov/sos/businesses/start-a-business/state-business-license"], fee: "$200" },
    cities: [{
      name: "Las Vegas", placeFips: "3240000", countyName: "Clark County", countyFips: "32003",
      health: ["Southern Nevada Health District", "https://www.southernnevadahealthdistrict.org/permits-and-regulations/"],
      buildings: ["Las Vegas Building & Safety", "https://www.lasvegasnevada.gov/Business/Building-Safety"],
      business: ["City of Las Vegas (Business Licensing)", "https://www.lasvegasnevada.gov/Business/Business-Licenses"],
      clerk: ["Clark County Clerk", "https://www.clarkcountynv.gov/government/elected_officials/county_clerk/"],
      fees: { food: "$300–$1,000", co: "$150–$500", sign: "$150–$500", dba: "$25", bizLicense: "$150–$500" },
      extras: { bizLicense: true },
      foodLevel: "county",
    }],
  },
  {
    code: "OH", name: "Ohio", url: "https://ohio.gov",
    revenue: ["Ohio Dept. of Taxation (Vendor's License)", "https://tax.ohio.gov/business/ohio-business-taxes/sales-and-use/registration"],
    labor: ["Ohio Dept. of Job & Family Services", "https://jfs.ohio.gov/"],
    wc: ["Ohio Bureau of Workers' Compensation", "https://www.bwc.ohio.gov/"],
    health: ["Ohio Dept. of Health", "https://odh.ohio.gov/"], foodMgrFee: "$100–$160",
    cities: [{
      name: "Columbus", placeFips: "3918000", countyName: "Franklin County", countyFips: "39049",
      health: ["Columbus Public Health", "https://www.columbus.gov/publichealth/"],
      buildings: ["Columbus Dept. of Building & Zoning Services", "https://www.columbus.gov/bzs/"],
      business: ["City of Columbus", "https://www.columbus.gov/"],
      clerk: ["Franklin County Clerk of Courts", "https://clerk.franklincountyohio.gov/"],
      fees: { food: "$100–$500", co: "$100–$400", sign: "$100–$400", dba: "$39" },
    }],
  },
];

/* ----------------------------- generation --------------------------------- */
const jur = (
  id: string, level: Jurisdiction["level"], name: string, parentId: string | null,
  stateCode: string | null, countyFips: string | null, placeFips: string | null, officialUrl: string | null
): Jurisdiction => ({ id, level, name, parentId, stateCode, countyFips, placeFips, officialUrl, createdAt: T, updatedAt: T });

const src = (id: string, jurisdictionId: string, a: Agency): Source => ({
  id, jurisdictionId, url: a[1], title: a[0], kind: "agency_page", hash: "", fetchedAt: T, verifiedAt: V, contentRef: null,
});

const req = (
  id: string, permitTypeId: string, jurisdictionId: string, appliesTo: Requirement["appliesTo"],
  cost: string, time: string, renewal: string, url: string, conf: Requirement["baseConfidence"], sourceId: string
): Requirement => ({
  id, permitTypeId, jurisdictionId, appliesTo, typicalCost: cost, typicalTime: time, renewal,
  filingUrl: url, baseConfidence: conf, sourceId, lastVerifiedAt: V, active: true,
});

const JUR: Jurisdiction[] = [jur("us", "federal", "United States", null, null, null, null, "https://www.usa.gov")];
const SRC: Source[] = [src("src-irs", "us", ["Internal Revenue Service", "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online"])];
const REQ: Requirement[] = [req("req-ein", "ein", "us", {}, "$0", "Immediate (online)", "One-time", "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online", "confirmed", "src-irs")];

const countySeen = new Set<string>();
for (const st of STATES) {
  const sid = st.code.toLowerCase();
  JUR.push(jur(sid, "state", st.name, "us", st.code, null, null, st.url));
  SRC.push(src(`src-${sid}-rev`, sid, st.revenue), src(`src-${sid}-lab`, sid, st.labor), src(`src-${sid}-wc`, sid, st.wc), src(`src-${sid}-hlth`, sid, st.health));

  if (!st.noSalesTax)
    REQ.push(req(`req-${sid}-salestax`, "sales-tax", sid, { naics: [...FOOD, ...RETAIL], triggers: ["food", "retail"] }, "$0", "1–3 weeks", "Ongoing", st.revenue[1], "confirmed", `src-${sid}-rev`));
  REQ.push(
    req(`req-${sid}-withholding`, "withholding", sid, { triggers: ["employees"] }, "$0", "1–2 weeks", "Ongoing", st.revenue[1], "likely_required", `src-${sid}-rev`),
    req(`req-${sid}-ui`, "ui", sid, { triggers: ["employees"] }, "$0 to register", "2–3 weeks", "Quarterly", st.labor[1], "likely_required", `src-${sid}-lab`),
    req(`req-${sid}-wc`, "workers-comp", sid, { triggers: ["employees"] }, "Varies (private policy)", "1–2 weeks", "Annual", st.wc[1], "likely_required", `src-${sid}-wc`),
    req(`req-${sid}-foodmgr`, "food-manager", sid, { triggers: ["food"] }, st.foodMgrFee, "1–2 weeks", "5 years", st.health[1], "confirmed", `src-${sid}-hlth`)
  );

  // State-level restaurant licensing (e.g. Florida DBPR)
  if (st.stateFood) {
    SRC.push(src(`src-${sid}-food`, sid, st.stateFood.agency));
    REQ.push(
      req(`req-${sid}-food`, "retail-food", sid, { triggers: ["food"] }, st.stateFood.fee, "2–6 weeks", "Annual", st.stateFood.agency[1], "confirmed", `src-${sid}-food`)
    );
  }
  // General state business license (e.g. Nevada, Washington)
  if (st.stateBizLicense) {
    SRC.push(src(`src-${sid}-biz`, sid, st.stateBizLicense.agency));
    REQ.push(
      req(`req-${sid}-biz`, "biz-license", sid, {}, st.stateBizLicense.fee, "1–2 weeks", "Annual", st.stateBizLicense.agency[1], "confirmed", `src-${sid}-biz`)
    );
  }

  for (const c of st.cities) {
    const cid = `${sid}-${slug(c.name)}`;
    const coid = `${sid}-${c.countyFips}`;
    if (!countySeen.has(coid)) {
      countySeen.add(coid);
      JUR.push(jur(coid, "county", c.countyName, sid, st.code, c.countyFips, null, c.clerk[1]));
      SRC.push(src(`src-${coid}-clerk`, coid, c.clerk));
      REQ.push(req(`req-${coid}-dba`, "dba", coid, {}, c.fees.dba, "3–7 days", "Varies", c.clerk[1], "likely_required", `src-${coid}-clerk`));
    }
    JUR.push(jur(cid, "city", c.name, coid, st.code, c.countyFips, c.placeFips, c.business[1]));
    SRC.push(src(`src-${cid}-hlth`, cid, c.health), src(`src-${cid}-bld`, cid, c.buildings), src(`src-${cid}-biz`, cid, c.business));

    // Retail-food licensing sits at the level that actually issues it here.
    const foodLevel = c.foodLevel ?? "city";
    if (foodLevel === "city") {
      REQ.push(
        req(`req-${cid}-food`, "retail-food", cid, { triggers: ["food"] }, c.fees.food, "2–8 weeks", "Annual", c.health[1], "confirmed", `src-${cid}-hlth`)
      );
    } else if (foodLevel === "county") {
      // county health district licenses food for this city (health agency IS the county's)
      REQ.push(
        req(`req-${cid}-food`, "retail-food", coid, { triggers: ["food"] }, c.fees.food, "2–8 weeks", "Annual", c.health[1], "confirmed", `src-${cid}-hlth`)
      );
    } // "state": handled once by st.stateFood above — no city/county duplicate

    REQ.push(
      req(`req-${cid}-co`, "cert-occ", cid, {}, c.fees.co, "2–6 weeks", "One-time", c.buildings[1], "likely_required", `src-${cid}-bld`),
      req(`req-${cid}-sign`, "sign", cid, { triggers: ["signage"] }, c.fees.sign, "2–4 weeks", "One-time", c.buildings[1], "likely_required", `src-${cid}-bld`)
    );
    if (c.extras?.bizLicense)
      REQ.push(req(`req-${cid}-biz`, "biz-license", cid, {}, c.fees.bizLicense ?? "Varies", "2–4 weeks", "Annual", c.business[1], "confirmed", `src-${cid}-biz`));
    if (c.extras?.foodHandler)
      REQ.push(req(`req-${cid}-handler`, "food-handler", cid, { triggers: ["food"] }, c.fees.foodHandler ?? "$0–$15", "1 day", "3 years", c.health[1], "confirmed", `src-${cid}-hlth`));
  }
}

export const JURISDICTIONS = JUR;
export const SOURCES = SRC;
export const REQUIREMENTS = REQ;

/* lookup maps + finders (used by retriever, geocoder, interpretation) */
export const permitTypeById = new Map(PERMIT_TYPES.map((p) => [p.id, p]));
export const sourceById = new Map(SOURCES.map((s) => [s.id, s]));
export const jurisdictionById = new Map(JURISDICTIONS.map((j) => [j.id, j]));

export function findJurisdiction(m: {
  level: Jurisdiction["level"];
  stateCode?: string | null;
  countyFips?: string | null;
  placeFips?: string | null;
}): Jurisdiction | undefined {
  return JURISDICTIONS.find(
    (j) =>
      j.level === m.level &&
      (m.stateCode ? j.stateCode === m.stateCode : true) &&
      (m.level === "county" && m.countyFips ? j.countyFips === m.countyFips : true) &&
      (m.level === "city" && m.placeFips ? j.placeFips === m.placeFips : true)
  );
}

function nameMatch(a: string, b: string): boolean {
  const x = a.toLowerCase();
  const y = b.toLowerCase();
  return x.includes(y) || y.includes(x);
}

export function findCityByName(stateCode: string, censusName: string): Jurisdiction | undefined {
  return JURISDICTIONS.find((j) => j.level === "city" && j.stateCode === stateCode && nameMatch(censusName, j.name));
}
export function findCountyByName(stateCode: string, censusName: string): Jurisdiction | undefined {
  return JURISDICTIONS.find((j) => j.level === "county" && j.stateCode === stateCode && nameMatch(censusName, j.name));
}
