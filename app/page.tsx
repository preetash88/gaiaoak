// app/page.tsx
import Hero from "@/components/Hero";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { StaggeredList, StaggerItem } from "@/components/motion/StaggeredList";
import PinGalleryClientWrapper from "@/components/PinGalleryClientWrapper";
import Link from "next/link";


export default function Home() {
  return (
    <>
      <AnimatedSection className="pt-6 pb-4">
        <Hero />
      </AnimatedSection>

      <AnimatedSection className="py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hakuna Matata</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Service • Spirituality • Welfare — serving people with compassion.
          </p>

          <div className="flex justify-center gap-3">
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-semibold bg-[#c41e1e] text-white shadow-lg hover:brightness-95 transition"
            >
              Donate
            </Link>

            <Link
              href="/about"
              className="px-4 py-2 rounded-md bg-white/90 hover:bg-white/95"
            >
              About
            </Link>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Our Activities</h2>

          <StaggeredList className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StaggerItem>
              <div className="p-4 bg-white/60 rounded-lg shadow-sm">
                Free Health Camps
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="p-4 bg-white/60 rounded-lg shadow-sm">
                Food Distribution
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="p-4 bg-white/60 rounded-lg shadow-sm">
                Community Events
              </div>
            </StaggerItem>
          </StaggeredList>
        </div>
      </AnimatedSection>
      {/* ====== Pinterest-style Discover section ====== */}
      <AnimatedSection className="py-10">
        <div className="max-w-7xl mx-auto">
          <PinGalleryClientWrapper />
        </div>
      </AnimatedSection>
    </>
  );
}
