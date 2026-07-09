import type { Metadata } from "next";
import { BackgroundFX } from "@/components/ui/BackgroundFX";
import { Nav } from "@/components/sections/Nav";
import { Pricing } from "@/components/sections/Pricing";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Discover free, a full report for $99, File-For-Me at $299, and monitoring at $49/mo — plus the Aiivo API at $2–5 per lookup for platforms.",
};

export default function PricingPage() {
  return (
    <>
      <BackgroundFX />
      <Nav />
      <main className="relative pt-16">
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
