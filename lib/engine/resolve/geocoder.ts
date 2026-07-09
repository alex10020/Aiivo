/* [B] Geocoder — resolves an address to the federal→state→county→city stack.
   - Full street addresses → US Census Geocoder (free, keyless) → FIPS.
   - Bare "City, ST" (the Census geocoder can't match those) → seed name lookup.
   Matches the seeded jurisdictions where covered; synthesises elsewhere so
   resolution degrades gracefully (federal/state) anywhere. */
import type { Geocoder, Jurisdiction, JurisdictionResolution } from "../types";
import {
  JURISDICTIONS,
  findCityByName,
  findCountyByName,
  findJurisdiction,
} from "../data/seed";

const FEDERAL = JURISDICTIONS.find((j) => j.id === "us")!;
const T = "2026-01-01T00:00:00Z";

function synth(
  level: Jurisdiction["level"],
  name: string,
  parentId: string | null,
  stateCode: string | null,
  countyFips: string | null,
  placeFips: string | null
): Jurisdiction {
  return {
    id: `geo-${level}-${(placeFips ?? countyFips ?? stateCode ?? name).toLowerCase()}`,
    level,
    name,
    parentId,
    stateCode,
    countyFips,
    placeFips,
    officialUrl: null,
    createdAt: T,
    updatedAt: T,
  };
}

interface CensusGeo {
  NAME?: string;
  BASENAME?: string;
  STUSAB?: string;
  GEOID?: string;
}

/** Resolve a bare "City, ST" / "City, State" string against the seed. */
function seedFromText(address: string): Jurisdiction[] {
  const stack: Jurisdiction[] = [FEDERAL];
  const parts = address.split(",").map((s) => s.trim()).filter(Boolean);
  if (!parts.length) return stack;
  const last = parts[parts.length - 1];
  const stTok = last.split(/\s+/)[0]?.toUpperCase() ?? "";

  const state = JURISDICTIONS.find(
    (j) =>
      j.level === "state" &&
      (j.stateCode === stTok || last.toLowerCase().includes(j.name.toLowerCase()))
  );
  if (!state) return stack;
  stack.push(state);

  const cityName = parts.length >= 2 ? parts[parts.length - 2] : "";
  if (cityName && state.stateCode) {
    const city = findCityByName(state.stateCode, cityName);
    if (city) {
      const county = JURISDICTIONS.find((j) => j.id === city.parentId);
      if (county) stack.push(county);
      stack.push(city);
    }
  }
  return stack;
}

export class CensusGeocoder implements Geocoder {
  async resolve(address: string): Promise<JurisdictionResolution> {
    // 1. Census geocoder — works for full street addresses.
    try {
      const url =
        "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress" +
        `?address=${encodeURIComponent(address)}` +
        "&benchmark=Public_AR_Current&vintage=Current_Current&format=json";
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      const data = await res.json();
      const match = data?.result?.addressMatches?.[0];
      const g = match?.geographies ?? {};
      const stateG: CensusGeo | undefined = g["States"]?.[0];

      if (stateG?.STUSAB) {
        const stateCode = stateG.STUSAB;
        const countyG: CensusGeo | undefined = g["Counties"]?.[0];
        const placeG: CensusGeo | undefined =
          g["Incorporated Places"]?.[0] ?? g["Census Designated Places"]?.[0];

        const stack: Jurisdiction[] = [FEDERAL];
        const state =
          findJurisdiction({ level: "state", stateCode }) ??
          synth("state", stateG.NAME ?? stateCode, "us", stateCode, null, null);
        stack.push(state);

        if (countyG) {
          stack.push(
            findJurisdiction({ level: "county", stateCode, countyFips: countyG.GEOID }) ??
              findCountyByName(stateCode, countyG.NAME ?? "") ??
              synth("county", countyG.NAME ?? "County", state.id, stateCode, countyG.GEOID ?? null, null)
          );
        }
        if (placeG) {
          stack.push(
            findJurisdiction({ level: "city", stateCode, placeFips: placeG.GEOID }) ??
              findCityByName(stateCode, placeG.BASENAME ?? placeG.NAME ?? "") ??
              synth("city", placeG.BASENAME ?? placeG.NAME ?? "City", state.id, stateCode, countyG?.GEOID ?? null, placeG.GEOID ?? null)
          );
        }

        return {
          input: address,
          formatted: match?.matchedAddress,
          lat: match?.coordinates?.y,
          lng: match?.coordinates?.x,
          jurisdictions: stack,
        };
      }
    } catch {
      /* fall through to text resolution */
    }

    // 2. "City, ST" text fallback against the seed.
    return { input: address, jurisdictions: seedFromText(address) };
  }
}

export const geocoder = new CensusGeocoder();
