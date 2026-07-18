import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Oppr",
  description:
    "How Oppr B.V. collects, stores, uses, and protects information in the course of providing its services.",
};

export default function PrivacyPage() {
  return (
    <main className="oppr-site">
      <Header />

      <article className="legal-shell">
        <header className="legal-head">
          <p className="section-no">Legal</p>
          <h1>Privacy Policy</h1>
          <p className="legal-updated">Last updated: May 10, 2025</p>
        </header>

        <div className="legal-body">
          <p className="legal-intro">
            This policy explains how Oppr B.V. and its affiliated companies
            collect, store, use, disclose and otherwise process information about
            you in the course of our business, including through our websites
            that link to this notice (such as oppr.ai), our software-as-a-service
            offering, and our marketing and sales activities (together, our
            &ldquo;Services&rdquo;). It also sets out your privacy rights.
          </p>

          <section>
            <h2>Personal information we collect</h2>
            <p>
              We collect information that can identify you on its own, or in
              combination with other information we hold (&ldquo;Personal
              Information&rdquo;), in the following ways:
            </p>
            <ul>
              <li>
                <strong>Information you provide.</strong> We may collect personal
                information when you create an account to use our Services or when
                you communicate with us.
              </li>
              <li>
                <strong>Communication information.</strong> When you communicate
                with us, we may collect your name, your contact details and the
                content of the messages you send.
              </li>
              <li>
                <strong>Payment information.</strong> When you purchase or
                subscribe to our Services, we may collect billing details such as
                your card number, expiry date and billing address, or use a
                third-party payment processor to handle your payment.
              </li>
              <li>
                <strong>Automatically received information.</strong> When you
                visit, use or interact with our Services, we may receive certain
                information about your visit, such as log data, usage data and
                device information.
              </li>
            </ul>
          </section>

          <section>
            <h2>Cookies</h2>
            <p>
              Cookies are small sets of information that websites send to your
              computer. They can be used to record activity, understand
              preferences and improve your experience. By using our Services you
              consent to our use of cookies as described in our cookie policy.
            </p>
          </section>

          <section>
            <h2>Data retention</h2>
            <p>
              We retain personal information for as long as necessary to fulfil
              the purposes for which we collected it, including to satisfy any
              legal, accounting or reporting obligations, to resolve disputes and
              to maintain our records. When we no longer need your personal
              information, we delete or anonymise it in line with our data
              retention policy.
            </p>
          </section>

          <section>
            <h2>No children</h2>
            <p>
              Our websites and Services are not aimed at individuals under 16
              years of age, and we do not knowingly collect personal information
              from them. If you believe a person under 16 has provided us with
              personal information through our Services, please contact us at{" "}
              <a href="mailto:info@oppr.ai">info@oppr.ai</a>.
            </p>
          </section>

          <section>
            <h2>Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we do, we
              will post the updated version on this page, unless another form of
              notice is required by law or agreed with you.
            </p>
          </section>

          <section>
            <h2>How to contact us</h2>
            <p>
              If you have any questions about this policy, please contact us at{" "}
              <a href="mailto:info@oppr.ai">info@oppr.ai</a>.
            </p>
          </section>
        </div>
      </article>

      <Footer />
    </main>
  );
}
