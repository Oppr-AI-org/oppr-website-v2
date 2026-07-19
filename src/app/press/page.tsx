import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Press — Oppr",
  description:
    "News and press resources for Oppr, the operator intelligence platform for manufacturing. Media contact: floris@oppr.ai.",
};

const release = {
  date: "20 July 2026",
  eyebrow: "Announcement",
  headline:
    "Oppr secures EUR 1.25 million seed investment led by FORWARD.one",
  standfirst:
    "With the new funding, the company will expand across European manufacturing and further develop its platform.",
  body: [
    "The Hague, the Netherlands. Oppr, the Dutch operator intelligence platform for manufacturing, has secured 1.25 million euro in seed investment. Oppr helps manufacturers capture what their most experienced operators know and turn it into verified data the whole plant can act on, with no new hardware. The round was led by Amsterdam-based investment firm FORWARD.one. With the new funding, the company will expand across European manufacturing and further develop its platform.",
    "In most factories the most valuable knowledge is not in a database. It is in the heads of the operators who run the machines every day: the sound a line makes before it fails, the small adjustment that saves a batch, the reason last week's run went wrong. That knowledge is rarely written down, and it leaves at every shift change and every retirement. Oppr gives it a place to live, and gives the plant a way to use it. Operators are on board in days, and plants see results within ten weeks.",
  ],
  quotes: [
    {
      text: "We could not be happier to have FORWARD.one alongside us, with their knowledge, network and background. They are exactly the forward-looking investor this industry needs: they understand that transforming traditional manufacturing does not happen with a quick-fix software solution, and they have backed our long-term, continuous-improvement approach. Operators are the experts on the floor. For too long their knowledge has had nowhere to live. We give it a place, and we give the plant a way to use it.",
      cite: "Floris Wyers · Founder & CEO, Oppr",
    },
    {
      text: "What Oppr is doing is interesting because they focus on the operators, using AI to translate operator knowledge into data. That is exactly the kind of industrial technology we back.",
      cite: "Arjan Gobel · Partner, FORWARD.one",
    },
    {
      text: "It is good to see software built by people who have actually lived the problem. Floris and the team carry years of combined experience on the floor, and it shows in what they are building.",
      cite: "Boy Jonge · Investment Manager, FORWARD.one",
    },
  ],
  closing:
    "Oppr was founded in 2023 by a team that ran production before it built software for it. That perspective shapes the product: if operators will not use it by choice, it has failed. The company will use the funding to deepen the platform, shorten the time it takes plants to see results, and grow its team, including three new roles in the Netherlands.",
};

const facts = [
  { label: "Announced", value: "2026" },
  { label: "Round", value: "EUR 1.25M seed" },
  { label: "Lead investor", value: "FORWARD.one" },
  { label: "Headquarters", value: "The Hague, NL" },
];

export default function PressPage() {
  return (
    <main className="oppr-site theme-v4">
      <Header />

      <section className="about-hero section">
        <p className="eyebrow">Press</p>
        <h1>News and press resources.</h1>
        <p className="about-lede">
          For interviews, quotes, logos or the full media kit, contact Floris
          Wyers directly at{" "}
          <a href="mailto:floris@oppr.ai">floris@oppr.ai</a>. Our latest
          announcement is below.
        </p>
      </section>

      <section className="section press-release">
        <article className="press-article">
          <header className="press-head">
            <p className="section-no">{release.eyebrow}</p>
            <time className="press-date">{release.date}</time>
            <h2>{release.headline}</h2>
            <p className="press-standfirst">{release.standfirst}</p>
          </header>

          <p>{release.body[0]}</p>
          <p>{release.body[1]}</p>

          <blockquote className="pull-quote press-quote">
            <p>{release.quotes[0].text}</p>
            <cite>{release.quotes[0].cite}</cite>
          </blockquote>

          <p>{release.closing}</p>

          <blockquote className="pull-quote press-quote">
            <p>{release.quotes[1].text}</p>
            <cite>{release.quotes[1].cite}</cite>
          </blockquote>
          <blockquote className="pull-quote press-quote">
            <p>{release.quotes[2].text}</p>
            <cite>{release.quotes[2].cite}</cite>
          </blockquote>

          <div className="press-logos">
            <a
              className="press-logo-oppr"
              href="https://oppr.ai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="oppr.ai"
            >
              oppr<span>.</span>
            </a>
            <a
              className="press-logo-forward"
              href="https://www.forward.one/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="FORWARD.one"
            >
              FORWARD<span>.one</span>
            </a>
          </div>

          <div className="press-about">
            <div>
              <h3>About Oppr</h3>
              <p>
                Oppr is a Netherlands-based company building operator
                intelligence for manufacturing. Its platform captures what
                experienced operators see, hear and do on the floor and turns it
                into verified data the whole plant can act on. No new hardware,
                operators on board in days, results in ten weeks.
              </p>
            </div>
            <div>
              <h3>About FORWARD.one</h3>
              <p>
                FORWARD.one is a venture capital firm dedicated to industrial
                technology, and a coveted partner for founders building
                Europe&rsquo;s next industrial champions.
              </p>
            </div>
          </div>

          <p className="press-note">
            Available in Dutch on request. For questions, contact{" "}
            <a href="mailto:floris@oppr.ai">floris@oppr.ai</a>.
          </p>
        </article>

        <aside className="press-aside">
          <dl className="about-specs">
            {facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="press-contact">
            <p className="section-no">Media contact</p>
            <p>
              <strong>Floris Wyers</strong>
              <br />
              Founder &amp; CEO
              <br />
              <a href="mailto:floris@oppr.ai">floris@oppr.ai</a>
            </p>
          </div>
        </aside>
      </section>

      <section className="review section">
        <div>
          <p className="section-no">Get in touch</p>
          <h2>Want to cover Oppr?</h2>
        </div>
        <div>
          <p>
            We are happy to talk through what operator intelligence means for
            European manufacturing, share the full media kit, or arrange an
            interview.
          </p>
          <a className="primary-cta" href="mailto:floris@oppr.ai">
            Email us <span>↗</span>
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
