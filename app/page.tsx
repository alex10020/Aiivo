import { BackgroundFX } from "@/components/ui/BackgroundFX";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Demo } from "@/components/sections/Demo";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <BackgroundFX />
      <Nav />
      <main className="relative">
        <Hero />
        <Problem />
        <Demo />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
