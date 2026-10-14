import Features from "@/marketing/Features";
import Footer from "@/marketing/Footer";
import Hero from "@/marketing/Hero";
import Navbar from "@/marketing/Navbar";

export default function Page() {
  return (
    <Navbar>
      <main className="flex min-h-full w-full flex-col">
        <Hero />
        <Features />
        <Footer />
      </main>
    </Navbar>
  );
}
