import Hero from "./components/Hero";
import VisualGallery from "./components/VisualGallery";
import GroupExperience from "./components/GroupExperience";
import AboutFacilitator from "./components/AboutFacilitator";
import ProductHighlights from "./components/ProductHighlights";
import Footer from "./components/Footer";
import { getPublicConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function Home() {
  const config = await getPublicConfig();

  return (
    <>
      <Hero />
      <VisualGallery />
      <GroupExperience />
      <AboutFacilitator initialConfig={config} />
      <ProductHighlights />
      <Footer />
    </>
  );
}

