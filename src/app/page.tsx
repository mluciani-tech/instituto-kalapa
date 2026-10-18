import Hero from "./components/Hero";
import QuatroCaminhosSection from "./components/QuatroCaminhosSection";
import VisualGallery from "./components/VisualGallery";
import GroupExperience from "./components/GroupExperience";
import AboutFacilitator from "./components/AboutFacilitator";
import ProductHighlights from "./components/ProductHighlights";
import OtherProductsSection from "./components/OtherProductsSection";
import Footer from "./components/Footer";
import { getPublicConfig } from "@/lib/config";

export const revalidate = 60;

export default async function Home() {
  const config = await getPublicConfig();

  return (
    <>
      <Hero />
      <QuatroCaminhosSection />
      <VisualGallery />
      <GroupExperience />
      <AboutFacilitator initialConfig={config} />
      <ProductHighlights />
      <OtherProductsSection />
      <Footer />
    </>
  );
}

