import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Oppr",
  description:
    "Reach the people who build Oppr. General questions, partnerships and press. We reply within one working day.",
};

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Oude+Middenweg+17+2491+AC+Den+Haag+Netherlands";

export default function ContactPage() {
  return (
    <main className="oppr-site theme-v4">
      <Header />

      <section className="book-shell contact-shell">
        <div className="book-intro">
          <p className="section-no">Contact</p>
          <h1>Talk to the people who build Oppr.</h1>
          <p className="book-lede">
            General questions, partnerships or press. Send a message and we
            will reply within one working day.
          </p>

          <dl className="contact-details">
            <div>
              <dt>Email</dt>
              <dd>
                <a href="mailto:info@oppr.ai">info@oppr.ai</a>
              </dd>
            </div>
            <div>
              <dt>Office</dt>
              <dd>
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                  Oude Middenweg 17, 2491 AC Den Haag, Netherlands
                </a>
              </dd>
            </div>
            <div>
              <dt>Follow</dt>
              <dd className="contact-follow">
                <a
                  href="https://www.linkedin.com/company/opprai"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
                <a
                  href="https://www.youtube.com/@opprai"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube
                </a>
              </dd>
            </div>
          </dl>

          <p className="contact-book">
            Want to walk through a specific operational blind spot?{" "}
            <Link href="/book">Book a call ↗</Link>
          </p>
        </div>

        <div className="book-panel">
          <ContactForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
