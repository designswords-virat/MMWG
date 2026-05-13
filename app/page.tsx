import BackgroundFX from "@/components/BackgroundFX";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import StylesShowcase from "@/components/StylesShowcase";
import Form from "@/components/Form";
import Footer from "@/components/Footer";
import StickyForm from "@/components/StickyForm";

export default function Page() {
  return (
    <main className="relative min-h-screen">
      <BackgroundFX />
      <Nav />
      <Hero />
      <HowItWorks />
      <StylesShowcase />
      <Form />
      <Footer />
      <StickyForm />
    </main>
  );
}
