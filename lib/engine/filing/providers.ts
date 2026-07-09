/* =============================================================================
   [E] FILING ENGINE — provider registry (MVP scaffolding).
   Two real providers:
   - irs-ein: guided federal EIN filing (IRS has no public API — we prefill the
     application payload and hand the user/ops a tracked, guided submission).
   - manual: fallback for every other permit — opens a tracked ops task with the
     prefilled payload and the portal URL.
   Portal-automation (RPA/computer-use) providers slot in behind the same
   interface later without touching callers.
   ========================================================================== */

import type { Business, Filing, FilingProvider, FilingStatus, RecordItem } from "../types";

const now = () => new Date().toISOString();

function baseFiling(
  item: RecordItem,
  business: Business,
  status: FilingStatus,
  portal: string | null,
  payload: Record<string, unknown>,
  event: string
): Filing {
  return {
    id: "",
    recordItemId: item.id,
    businessId: business.id,
    status,
    portal,
    externalRef: null,
    submittedAt: null,
    lastStatusAt: now(),
    payload,
    audit: [{ at: now(), actor: "engine", event }],
  };
}

/** Shared prefill: everything we already know about the business. */
export function prefillCommon(item: RecordItem, business: Business) {
  return {
    permit: item.name,
    authority: item.authority,
    business_type: business.businessType,
    business_name: business.name ?? null,
    address: business.address,
    sells: business.sells ?? null,
    filing_url: item.filingUrl,
  };
}

class IrsEinProvider implements FilingProvider {
  readonly key = "irs-ein";

  handles(item: RecordItem): boolean {
    return /employer identification|(^|\W)ein(\W|$)/i.test(item.name);
  }

  async prefill(item: RecordItem, business: Business) {
    return {
      ...prefillCommon(item, business),
      form: "SS-4",
      responsible_party: null, // collected at filing time — PII stays out of discovery
      entity_type: null,
      reason_for_applying: "Started new business",
    };
  }

  async submit(item: RecordItem, business: Business): Promise<Filing> {
    const payload = await this.prefill(item, business);
    return baseFiling(
      item,
      business,
      "prefilled",
      "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      payload,
      "SS-4 payload prefilled; awaiting responsible-party details (guided filing)"
    );
  }

  async status(filing: Filing): Promise<FilingStatus> {
    return filing.status; // guided — status advances via ops/user confirmation
  }
}

class ManualFilingProvider implements FilingProvider {
  readonly key = "manual";

  handles(): boolean {
    return true; // universal fallback
  }

  async prefill(item: RecordItem, business: Business) {
    return prefillCommon(item, business);
  }

  async submit(item: RecordItem, business: Business): Promise<Filing> {
    const payload = await this.prefill(item, business);
    return baseFiling(
      item,
      business,
      "queued",
      item.filingUrl,
      payload,
      "Queued for filing — tracked ops task created (manual portal submission)"
    );
  }

  async status(filing: Filing): Promise<FilingStatus> {
    return filing.status;
  }
}

/** Ordered registry — first provider whose handles() matches wins. */
export const PROVIDERS: FilingProvider[] = [
  new IrsEinProvider(),
  new ManualFilingProvider(),
];

export function providerFor(item: RecordItem): FilingProvider {
  return PROVIDERS.find((p) => p.handles(item)) ?? PROVIDERS[PROVIDERS.length - 1];
}
