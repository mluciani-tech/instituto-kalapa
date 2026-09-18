import Hero from "./components/Hero";
import VisualGallery from "./components/VisualGallery";
import GroupExperience from "./components/GroupExperience";
import AboutFacilitator from "./components/AboutFacilitator";
import ProductHighlights from "./components/ProductHighlights";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <VisualGallery />
      <GroupExperience />
      <AboutFacilitator />
      <ProductHighlights />
      <Footer />
    </>
  );
}
