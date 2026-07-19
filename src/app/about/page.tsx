import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "About — Oppr",
  description:
    "Oppr was built on the shop floor by people who ran it. We keep the knowledge your operation already has, and turn it into repeatable action.",
};

type Voice = "human" | "machine" | "verified";

const pillars: { no: string; voice: Voice; name: string; text: string }[] = [
  {
    no: "01",
    voice: "human",
    name: "Empower your people",
    text: "Operators get real-time context and a fast way to record what they see. The knowledge that used to live in one person's head becomes something the whole team can use.",
  },
  {
    no: "02",
    voice: "machine",
    name: "Make your assets last",
    text: "Oppr layers modern analysis onto the equipment you already run. You extend uptime and asset life instead of paying to replace machines that still have years in them.",
  },
  {
    no: "03",
    voice: "verified",
    name: "Hold your performance",
    text: "Findings return to the floor as repeatable actions. Waste comes down, targets hold, and every verified result becomes the starting point for the next one.",
  },
];

const journey = [
  {
    year: "2023",
    name: "The vision",
    text: "Oppr is founded to bring a digital operator to manufacturing: software that captures the context around the machine, not only the readings from it.",
  },
  {
    year: "2024",
    name: "Validation",
    text: "LOGS, DOCS and IDA are built and tested in real production, alongside pilot customers who shaped what the platform had to prove.",
  },
  {
    year: "2025",
    name: "Launch",
    text: "Commercial launch across Europe, with the modules brought together into one platform for manufacturers.",
  },
  {
    year: "2026",
    name: "Scale",
    text: "With product fit in hand, we are scaling the operation and its infrastructure to reach manufacturers more widely.",
  },
];

const team = [
  { name: "Floris Wyers", role: "Founder & CEO", photo: "/team/floris.jpg" },
  { name: "Derek Gobel", role: "CTO", photo: "/team/derek.jpg" },
  { name: "Sanchay Roy", role: "Chief Industry Officer", photo: "/team/sanchay.jpg" },
  { name: "Anamaria Panda", role: "Product Manager", photo: "/team/anamaria.jpg" },
  { name: "Bogdan-Mihai Gligor", role: "Tech Team Lead", photo: "/team/bogdan.jpg" },
  { name: "Duco Lindhout", role: "Business Developer", photo: "/team/duco.jpg" },
  { name: "Cezar Suciu", role: "AI Engineer", photo: "/team/cezar.jpg" },
  { name: "Anca Giurgiu", role: "Full-Stack Developer", photo: "/team/anca.jpg" },
  { name: "Mara Irina Mesesan", role: "Full-Stack Developer", photo: "/team/mara.jpg" },
];

const specs = [
  { label: "Founded", value: "2023" },
  { label: "Headquarters", value: "The Hague, NL" },
  { label: "Team", value: "Growing" },
  { label: "Funding", value: "VC-funded" },
];

const values = [
  {
    no: "01",
    name: "Operators first",
    text: "Technology adapts to how people work, not the other way around. If operators will not use it by choice, it has failed.",
  },
  {
    no: "02",
    name: "Zero friction",
    text: "Capturing knowledge has to be faster than forgetting it. If it takes effort, it will not happen.",
  },
  {
    no: "03",
    name: "Practical over theoretical",
    text: "We build for real floors, not conference-room demos. Everything we ship has to work in noisy, busy conditions.",
  },
  {
    no: "04",
    name: "Knowledge compounds",
    text: "Single observations become organisational intelligence. The system gets more useful the longer it runs.",
  },
  {
    no: "05",
    name: "Honest technology",
    text: "AI should support human judgement, not stand in for it. We are clear about what it does, and what it does not.",
  },
  {
    no: "06",
    name: "Measured impact",
    text: "If we cannot measure the value, we have not delivered it. Every deployment has to show verifiable results.",
  },
  {
    no: "07",
    name: "Humans are sensors",
    text: "The people on the floor are the most capable sensors in any factory. They sense what no instrument records. Our job is to turn that into a datasource.",
  },
];

function PillarIcon({ voice }: { voice: Voice }) {
  const common = {
    className: "pillar-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (voice === "human") {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="3.4" />
        <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" />
      </svg>
    );
  }
  if (voice === "machine") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="2.3" />
        <path d="M12 5V3.2M12 20.8V19M5 12H3.2M20.8 12H19M6.7 6.7 5.4 5.4M18.6 18.6l-1.3-1.3M17.3 6.7l1.3-1.3M5.4 18.6l1.3-1.3" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M4 16.5 9.5 11l3.5 3.5L20 7" />
      <path d="M15 7h5v5" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <main className="oppr-site theme-v4">
      <Header />

      <section className="about-hero section">
        <p className="eyebrow">About Oppr</p>
        <h1>Built on the floor, by people who ran it.</h1>
        <p className="about-lede">
          Oppr started in 2023, out of years spent on the shop floor as an
          operator, an engineer and a manager. One lesson kept returning: the
          data and the knowledge already exist on the floor. What is missing is
          a way to keep them.
        </p>
      </section>

      <section className="section">
        <div className="section-grid">
          <div className="section-heading">
            <p className="section-no">Why we exist</p>
            <h2>Keep the knowledge the floor already has.</h2>
          </div>
          <div className="section-copy">
            <p>
              Our work is to help manufacturers stay competitive without
              replacing what already works. We connect the machine data you
              record to the context your people carry, so a shift&rsquo;s worth
              of judgement does not leave with the shift.
            </p>
            <p>
              The result is not another system to feed. It is a way to hold on
              to what your operation already knows, and to act on it before it
              disappears.
            </p>
          </div>
        </div>
        <blockquote className="pull-quote about-quote">
          <p>
            We created Oppr so you never have to guess what is happening on your
            own floor again. Imagine a colleague who never sleeps, and always
            knows.
          </p>
          <cite>Floris Wyers · Founder &amp; CEO</cite>
        </blockquote>
      </section>

      <section className="section">
        <div className="about-block-head">
          <p className="section-no">What Oppr does</p>
          <h2>Three moves, one operation.</h2>
        </div>
        <div className="about-pillars">
          {pillars.map((pillar) => (
            <article key={pillar.no} className="pillar" data-voice={pillar.voice}>
              <div className="pillar-head">
                <PillarIcon voice={pillar.voice} />
                <span className="pillar-idx">{pillar.no}</span>
              </div>
              <h3>{pillar.name}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="about-block-head">
          <p className="section-no">Our journey</p>
          <h2>Built step by step.</h2>
        </div>
        <ol className="about-journey">
          {journey.map((step) => (
            <li key={step.year} className="journey-step">
              <span className="journey-year">{step.year}</span>
              <strong>{step.name}</strong>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section">
        <blockquote className="pull-quote about-quote">
          <p>
            When I ran production, I slept with my phone next to the bed. A
            certain crew on nights, rain in the forecast, and I knew a call was
            coming. Every plant has its own version of that feeling. Oppr exists
            so the reasons behind it stop living in one person&rsquo;s gut.
          </p>
          <cite>Floris Wyers · Founder &amp; CEO</cite>
        </blockquote>
      </section>

      <section className="section about-company">
        <div className="section-grid">
          <div className="section-heading">
            <p className="section-no">The company</p>
            <h2>Where we work, and what we hold to.</h2>
          </div>
          <div className="section-copy">
            <p>
              We focus only on manufacturing, both discrete and process. Our
              expertise is in the reality of the floor, not the theory of it,
              and it shapes every decision we make about the product.
            </p>
            <dl className="about-specs">
              {specs.map((spec) => (
                <div key={spec.label}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="about-beliefs">
          <h3>The principles we build by.</h3>
          <ul className="about-values">
            {values.map((value) => (
              <li key={value.no} className="value">
                <strong>{value.name}</strong>
                <p>{value.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="about-block-head">
          <p className="section-no">The team</p>
          <h2>The people behind Oppr.</h2>
        </div>
        <ul className="about-team">
          {team.map((member) => (
            <li key={member.name}>
              <div className="team-photo">
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  sizes="(max-width: 760px) 50vw, (max-width: 980px) 33vw, 25vw"
                />
              </div>
              <strong>{member.name}</strong>
              <span>{member.role}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="review section">
        <div>
          <p className="section-no">Get in touch</p>
          <h2>See what your own floor already knows.</h2>
        </div>
        <div>
          <p>
            Bring one operational blind spot: a recurring loss, a process that
            behaves differently between shifts, a result you cannot fully
            explain. In 30 minutes we scope it with you.
          </p>
          <Link className="primary-cta" href="/book">
            Book a call <span>↗</span>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
