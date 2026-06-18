import Hero from "./components/Hero";
import GroupExperience from "./components/GroupExperience";
import VisualGallery from "./components/VisualGallery";
import RegistrationForm from "./components/RegistrationForm";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <GroupExperience />
      <VisualGallery />
      <RegistrationForm />
      <Footer />
    </>
  );
}
