import type { Metadata } from "next";
import { BackgroundFX } from "@/components/ui/BackgroundFX";
import { Nav } from "@/components/sections/Nav";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Pipeline } from "@/components/sections/Pipeline";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "From your business and address to a filed, monitored compliance record — how Aiivo's permit engine works, layer by layer.",
};

export default function HowItWorksPage() {
  return (
    <>
      <BackgroundFX />
      <Nav />
      <main className="relative pt-16">
        <HowItWorks />
        <Pipeline />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
