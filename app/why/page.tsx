import type { Metadata } from "next";
import { BackgroundFX } from "@/components/ui/BackgroundFX";
import { Nav } from "@/components/sections/Nav";
import { Advantages } from "@/components/sections/Advantages";
import { Competitive } from "@/components/sections/Competitive";
import { Trust } from "@/components/sections/Trust";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Why Aiivo",
  description:
    "Why Aiivo wins: a data moat nobody wants to build, a vertical AI agent, low-CAC distribution, and a credibility stack you can trust.",
};

export default function WhyPage() {
  return (
    <>
      <BackgroundFX />
      <Nav />
      <main className="relative pt-16">
        <Advantages />
        <Competitive />
        <Trust />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
