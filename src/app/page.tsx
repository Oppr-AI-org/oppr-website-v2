import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Capture,
  Connect,
  Execute,
  FloorProof,
  Hero,
  Opportunity,
  Platform,
  Proof,
  Review,
} from "@/components/home/sections";

export default function Home() {
  return (
    <main className="oppr-site theme-v4">
      <Header />
      <Hero />
      <Opportunity />
      <Capture />
      <Connect />
      <Execute />
      <Platform />
      <FloorProof />
      <Proof />
      <Review />
      <Footer />
    </main>
  );
}
