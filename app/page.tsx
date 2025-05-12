import { HeroSection } from "@/components/hero-section"
import { FeatureSection } from "@/components/feature-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeatureSection />
      <CTASection />
      <Footer />
    </div>
  )
}
