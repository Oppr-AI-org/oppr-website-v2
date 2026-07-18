import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — Oppr",
  description:
    "The terms that govern your use of the Oppr B.V. service.",
};

export default function TermsPage() {
  return (
    <main className="oppr-site">
      <Header />

      <article className="legal-shell">
        <header className="legal-head">
          <p className="section-no">Legal</p>
          <h1>Terms of Service</h1>
          <p className="legal-updated">Last updated: March 5, 2024</p>
        </header>

        <div className="legal-body">
          <p className="legal-intro">
            These terms govern your use of the service provided by Oppr B.V. If
            you use Oppr on behalf of another entity, such as your employer, you
            confirm that you have the authority to accept these terms on their
            behalf.
          </p>

          <section>
            <h2>1. Use of the service</h2>
            <p>
              We grant you a non-exclusive right to use the Oppr Services. Access
              is specific to the user it is issued to and may not be shared, even
              within the same organisation.
            </p>
            <p>
              You will take reasonable steps to prevent unauthorised use of the
              service, and you will notify us promptly if you become aware of any
              material unauthorised use.
            </p>
          </section>

          <section>
            <h2>2. AI output disclaimer</h2>
            <p>
              Oppr is a manufacturing management tool, and its output is not legal
              or operational advice. Output is generated with the help of AI and
              may contain errors, be inaccurate or be incomplete. You must always
              verify AI-generated suggestions against your own factory safety
              protocols before acting on them.
            </p>
          </section>

          <section>
            <h2>3. Updates to these terms</h2>
            <p>
              Oppr may update these terms by posting an updated version on our
              website. Changes take effect when they are posted. Such changes are
              not retroactive, but your continued use of Oppr after they are
              posted constitutes your agreement to them.
            </p>
          </section>

          <section>
            <h2>4. Force majeure</h2>
            <p>
              Neither party will be liable to the other for any delay or failure
              in performance under these terms that arises from a cause outside
              its reasonable control, including acts of God, labour disputes,
              systemic electrical or telecommunications failures, or public
              health emergencies.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              For any questions about these terms, please contact us at{" "}
              <a href="mailto:info@oppr.ai">info@oppr.ai</a> or through the
              contact forms on oppr.ai.
            </p>
          </section>
        </div>
      </article>

      <Footer />
    </main>
  );
}
