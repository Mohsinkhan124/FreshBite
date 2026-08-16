import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import LatestProductsSection from "@/components/home/LatestProductsSection";
import PromoBanner from "@/components/home/PromoBanner";
import FeaturesSection from "@/components/home/FeaturesSection";
import NewsletterSection from "@/components/home/NewsletterSection";

// Product/category data changes often (stock, featured flags), so the
// home page renders per-request rather than being statically cached.
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <LatestProductsSection />
      <PromoBanner />
      <FeaturesSection />
      <NewsletterSection />
    </>
  );
}
