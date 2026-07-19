import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "FAQ · Oppr",
  description:
    "Answers before you book: how Oppr captures operator context, connects it with machine data, what it costs, how it fits your systems, and how your data is handled.",
};

type QA = { q: string; a: string };
type Group = { label: string; heading: string; items: QA[] };

// Answers rewritten for website_v2: no LOGS/IDA/DOCS/Insights module naming,
// spoken in the site's capture → connect → execute language, and held to the
// understated voice (no hard ROI or time claims beyond what the site states).
const groups: Group[] = [
  {
    label: "Getting started",
    heading: "The basics, before you book.",
    items: [
      {
        q: "What is Oppr?",
        a: "Oppr is an Operational Intelligence Platform for manufacturing. Your machines record what happened; your operators see what changed, decide what to do, and learn from it. Oppr captures that human context in the field, places it beside your existing machine data on one timeline, and turns what works into repeatable, verified action. We call that Operator Intelligence. Three moves, capture, connect and execute, running together on the floor.",
      },
      {
        q: "Who is Oppr for?",
        a: "Manufacturers where human judgement matters as much as machine data, whether discrete or process, from a single line to a multi-plant operation. It is written for the people accountable for scrap, downtime and output: plant managers, operations directors and the continuous-improvement teams around them. Where you start depends on your biggest loss. Some teams begin with a recurring fault they cannot place, others with knowledge that is about to walk out the door at retirement.",
      },
      {
        q: "What operational problems does it solve?",
        a: "The gap between what your dashboards show and what actually happens on the floor. Machine data tells you a reading moved; it rarely tells you why. Oppr addresses the losses that live in that gap: recurring faults no one can fully explain, knowledge that leaves with an experienced operator, slow root-cause work, and improvements that do not hold from one shift to the next.",
      },
      {
        q: "Do we need new hardware or sensors to start?",
        a: "No. You can start with no new hardware and no machine integration. Operators use the phone or tablet already in their hand. Oppr is built to fill the gap where sensors are not present; in effect, your operators are the sensors. When it is useful, you can connect existing machine data later to enrich the picture.",
      },
      {
        q: "Do we need SCADA or existing digital systems to use Oppr?",
        a: "No. Oppr meets you at whatever level of digitalisation you already have. Fully instrumented with SCADA and historians, a handful of machines online, or nothing digital at all, it works the same way: your operators capture context on the phone or tablet already in their hand. Where systems are already in place, Oppr adds the human layer of context around them. Where they are not, it is often the first step into digitalisation, creating a human data layer on the floor before a single sensor is installed.",
      },
      {
        q: "Is this a whole new system and methodology to learn?",
        a: "No. Oppr is built on the established thinking your teams already use, lean and Six Sigma, rather than a new methodology to adopt. We are not reinventing the wheel; we are bringing that proven approach into the age of AI, so the analysis that used to take days of manual digging happens continuously, in the flow of work on the floor.",
      },
      {
        q: "How quickly can we be up and running?",
        a: "Capturing context starts within days. There is no lengthy IT project, and operators are on board in days rather than a training programme. From there, most engagements run as a 10-Week Proof, our proof of value: one line, one blind spot, starting from an analysis of your historic data, with a verified improvement by the end. Implementation follows, so first value typically lands within ninety days of kickoff. The system gets more useful the longer it runs.",
      },
      {
        q: "What does it cost?",
        a: "Oppr is a SaaS subscription, scaled to the size and scope of your operation rather than sold per seat. It works as one connected system, so it is priced as one. Most operations start with the 10-Week Proof: a fixed scope and a fixed fee on a single line, starting from your historic data, so you see a verified result before committing more widely. We will talk through what it looks like in your environment on the call.",
      },
    ],
  },
  {
    label: "How Oppr works",
    heading: "Capture, connect, execute, on the floor.",
    items: [
      {
        q: "How do operators capture what they notice?",
        a: "In the moment it happens, in seconds. They can speak an observation, take a picture, or complete a short field check, on the phone or tablet they already carry. No long forms, no desktop, no reconstructing the shift afterwards. Everything lands in the right place on its own; that part is our job.",
      },
      {
        q: "Will operators actually use it?",
        a: "This is the question that decides everything, and it is why capture is built for the person on the floor first. Recording something takes seconds by voice or photo: no forms, no login screens, no desktop. The reason adoption holds is that operators see their observations lead to real changes on the line. People contribute more when their input visibly counts, and less knowledge disappears between shifts.",
      },
      {
        q: "How do I convince my operators this is not just another tool that eats their time?",
        a: "Lead with what it is for. Oppr is built with operators in mind, to support their work, not to replace them or look over their shoulder. Capturing an observation takes seconds on the phone or tablet already in their hand, which is where more of the working day already happens, so it reads as the next logical step rather than another system to log into. And because the AI handles the structuring, the barrier to contributing stays low: they speak or take a photo, and it becomes something useful. The honest pitch is that it gives time back rather than taking it.",
      },
      {
        q: "How does Oppr use AI?",
        a: "AI does the structuring, not the deciding. Operators speak or take a photo, and Oppr turns it into something the whole operation can use, in the background, with nothing to configure. You can ask a plain-language question, like “when did we last see this on Line 4?”, and get an answer drawn from both human observations and machine data. The judgement stays with your people; the AI removes the busywork around it. How it does that is the part we would rather show you than describe: it is the heart of the product, and a 20-minute demo makes it obvious.",
      },
      {
        q: "How do you actually find the correlations?",
        a: "It builds on established lean and Six Sigma thinking, with AI doing the heavy lifting: the digging that used to take an improvement team days happens continuously, in the background. A useful way to picture it: a real-time Six Sigma black belt in your pocket, working through the data while your team stays on the floor. The specifics of how it gets there are the part we keep to ourselves, and the part we are happiest to demonstrate live.",
      },
      {
        q: "How does it help with shift handovers?",
        a: "Handovers are one of the clearest wins. Because observations are captured through the shift as they happen, the incoming team can see an automatic summary of what was flagged, what is still open, and the context that would otherwise be lost in a verbal handoff or a paper log.",
      },
      {
        q: "What languages does it support?",
        a: "Over 50. Operators respond in their own language and Oppr handles transcription, translation and analysis. That matters most on multilingual lines, where language has often kept frontline people from contributing on equal footing.",
      },
      {
        q: "How do you keep the logged data trustworthy?",
        a: "Two things keep it honest. Low-quality or off-topic entries are flagged automatically. More importantly, there is nothing to game: with no long form to shortcut, operators simply say what they see. And as they watch their observations turn into real fixes and updated standards, quality rises on its own, because people put more in when they can see it counts.",
      },
      {
        q: "Can we use it for business cases, or only for the production line?",
        a: "Both. Alongside floor observations, Oppr lets you bring in other external sources, so the same connected picture can support broader questions: building the business case behind a capex decision, or weighing an operational change. It is not limited to fixing one line. Wherever a decision benefits from human context sitting next to the data, Oppr can support it.",
      },
    ],
  },
  {
    label: "How it compares",
    heading: "Where Oppr fits alongside what you run.",
    items: [
      {
        q: "How is Oppr different from a connected-worker platform?",
        a: "Connected-worker tools digitise workflows you already have: forms, checklists, work orders. Oppr does that, then goes further, capturing the context no form anticipates: the material that looks different, the adjustment that only works on humid days, the sound that means a bearing is going. And it closes the loop: observations feed analysis, analysis updates the standard, and the standard goes back to the floor. That loop is what connected-worker platforms leave out.",
      },
      {
        q: "How is it different from a knowledge-management system?",
        a: "A knowledge base asks people to stop working and write down what they know, and usually becomes a library nobody opens. Oppr captures knowledge in the flow of work, by voice or photo, without operators changing how they work, and keeps the resulting documentation current from real observations instead of letting it go stale. The knowledge reflects what actually happens, not what was written down two years ago.",
      },
      {
        q: "How is it different from an MES?",
        a: "Oppr is not an MES and does not replace one. An MES runs production execution: scheduling, work orders, batch tracking. Oppr captures the human context an MES does not: why a line ran better today, what the operator changed, what the material felt like. If you have an MES, Oppr sits alongside it and adds that layer. If you do not, Oppr is a practical first step toward digitising the floor, without the cost and weight of a full MES rollout.",
      },
      {
        q: "Which industries do you work with?",
        a: "Discrete and process manufacturing across food and beverage, chemicals, plastics, metals, packaging, water treatment and equipment manufacturing. The common thread is not the sector; it is whether your operators know things your systems do not record, and whether that knowledge matters for quality, uptime or safety.",
      },
    ],
  },
  {
    label: "Security, data & integration",
    heading: "How it connects, and how your data is held.",
    items: [
      {
        q: "Does Oppr integrate with our existing systems?",
        a: "Yes, and it is optional. Oppr delivers value on human observations alone, so you do not need an integration to start. When you are ready, it connects to the historians, MES and SCADA systems most plants already run, over standard protocols. It also works both ways: push Oppr data out to your ERP, BI or data lake for reporting, or pull machine data in to enrich the shared timeline.",
      },
      {
        q: "How do you handle data privacy, security and ownership?",
        a: "Your data stays yours. Oppr is fully GDPR compliant, encrypted, and hosted in sovereign regions (EU-only where required). Your operational data is kept in private environments and is never used to train public AI models. If you ever decide to leave, we provide a full export, and your observations and the knowledge in them go with you.",
      },
      {
        q: "Can it help with compliance and auditing?",
        a: "Yes. Every entry is timestamped, tagged and traceable, so you get an audit trail as a by-product of normal work, and procedures stay current and version-controlled. For regulated operations, that means compliance documentation that reflects what actually happens on the floor rather than what was written years ago.",
      },
    ],
  },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: groups.flatMap((group) =>
    group.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    }))
  ),
};

export default function FaqPage() {
  return (
    <main className="oppr-site theme-v4">
      <Header />

      <div className="faq-shell">
        <header className="faq-hero">
          <p className="eyebrow">Frequently asked</p>
          <h1>Questions from the floor.</h1>
          <p className="faq-lede">
            What an operations leader tends to ask before booking a review: how
            Oppr captures context, how it fits what you already run, what it
            costs, and how your data is handled. If yours is not here, ask us
            directly.
          </p>
        </header>

        {groups.map((group) => (
          <section key={group.label} className="faq-group">
            <div className="faq-group-head">
              <p className="section-no">{group.label}</p>
              <h2>{group.heading}</h2>
            </div>
            <div className="faq-list">
              {group.items.map((item) => (
                <details key={item.q} className="faq-item">
                  <summary>
                    <span className="faq-q">{item.q}</span>
                    <span className="faq-mark" aria-hidden="true" />
                  </summary>
                  <div className="faq-a">
                    <p>{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}

        <section className="faq-cta">
          <p className="section-no">Still have questions?</p>
          <h2>Ask us directly.</h2>
          <p>
            If your question isn&rsquo;t answered here, get in touch. Book a short
            call or send a message, whichever suits you, and we&rsquo;ll help you
            work out whether Oppr fits your operation.
          </p>
          <Link className="primary-cta" href="/book">
            Book a call <span>↗</span>
          </Link>
          <p className="faq-cta-alt">
            Prefer to write first? <Link href="/contact">Contact us</Link>.
          </p>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <Footer />
    </main>
  );
}
