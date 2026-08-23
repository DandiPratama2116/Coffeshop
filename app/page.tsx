import Navigation from "../components/layout/Navigation";
import HeroSection from "../components/sections/HeroSection";
import AboutSection from "../components/sections/AboutSection";
import MenuSection from "../components/sections/MenuSection";
import FacilitiesSection from "../components/sections/FacilitiesSection";
import GallerySection from "../components/sections/GallerySection";
import ReservationSection from "../components/sections/ReservationSection";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <HeroSection />
      <AboutSection />
      <FacilitiesSection />
      <MenuSection />
      <GallerySection />
      <ReservationSection />
      <Footer />
    </>
  );
}
