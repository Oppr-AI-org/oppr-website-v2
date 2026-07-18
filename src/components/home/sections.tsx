import Link from "next/link";
import { LoopVisual } from "@/components/home/primitives";
import { HeroPhotoScene } from "@/components/home/hero-photo";
import {
  PlatformCircle,
  IconLessScrap,
  IconFewerStoppages,
  IconLessReporting,
  IconDaysToLive,
} from "@/components/home/illustrations";
import { FilmVideo } from "@/components/home/film-video";

const stages = [
  { no: "01", name: "Capture", text: "Record it the moment it happens." },
  { no: "02", name: "Connect", text: "Machine data and human context\non one timeline." },
  { no: "03", name: "Execute", text: "Repeatable action, verified." },
];

// Illustrative target ranges — NOT a specific client result. These are the
// kinds of outcomes the loop is built to produce; replace with real, verified
// figures (and drop the "illustrative" framing) once a case study is confirmed.
const caseStats = [
  { figure: "Less scrap", label: "on the line under investigation", Icon: IconLessScrap },
  { figure: "Fewer stoppages", label: "from the recurring fault you can't place", Icon: IconFewerStoppages },
  { figure: "Less reporting", label: "time lost reconstructing the shift", Icon: IconLessReporting },
  { figure: "90 days", label: "from kickoff to live on the floor", Icon: IconDaysToLive },
];

const proofNeeds = [
  "One production line or process",
  "One operational blind spot to investigate",
  "A small group of people close to the process",
  "Access to the relevant existing machine data",
];

const proofProvides = [
  "Live in 14 days",
  "A unified timeline of human and machine data",
  "Analysis of recurring relationships and interventions",
  "A verified improvement, with the action that delivered it",
];

// The three moves of the loop. Each of the Capture / Connect / Execute sections
// shows all three as its eyebrow, with the current move lit and the other two
// held back — so the reader always sees where this section sits in the loop.
const LOOP_STEPS = ["Capture", "Connect", "Execute"] as const;

function StepEyebrow({ active }: { active: (typeof LOOP_STEPS)[number] }) {
  return (
    <p className="step-eyebrow" aria-label={active}>
      {LOOP_STEPS.map((step, i) => (
        <span key={step}>
          {i > 0 && <span className="step-sep" aria-hidden="true">→</span>}
          <span className={step === active ? "on" : "off"}>{step}</span>
        </span>
      ))}
    </p>
  );
}

export function Hero() {
  return (
    <section className="hero hero-photo" id="top">
      <div className="hero-art" aria-hidden="true">
        <HeroPhotoScene />
        <div className="hero-tl-badge">
          <span className="dot" />
          UNIFIED TIMELINE · LIVE
          <span className="check">✓</span>
        </div>
      </div>
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">Operator intelligence for manufacturing</p>
          <h1>Your next improvement is already walking the floor.</h1>
          <p className="hero-lede">
            Your operators notice{" "}
            <em className="k-h k-quiet">the sound, the drift, the workaround</em>,
            long before it reaches a report. <strong>Oppr is the app</strong>{" "}
            that captures it in seconds, on the phone already in their hand.
          </p>
          <p className="hero-lede">
            It lands next to your <em className="k-m k-quiet">machine data</em> on
            one timeline, so recurring problems get explained and{" "}
            <span className="k-hero-plain">the fix becomes repeatable</span>.
          </p>
          <Link className="primary-cta" href="/book">
            Book a call <span>↗</span>
          </Link>
          <div className="fact-strip lg">
            <span>No new hardware</span>
            <span>Live in 14 days</span>
            <span>Operators onboard in minutes</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Opportunity() {
  return (
    <section className="opportunity section">
      <div className="section-grid">
        <div className="section-heading">
          <h2>Every operation observes, adjusts and learns.</h2>
        </div>
        <div className="section-copy">
          <p>
            Your <strong className="k-h">machines</strong> record conditions
            and results. Your <strong className="k-h">operators</strong> see
            what changed, decide what to do, and learn from it. Together they
            hold the complete picture, but it is rarely captured as{" "}
            <em>one connected sequence</em>. Readings sit in one system;
            observations and reasoning stay with individuals or vanish between
            shifts.
          </p>
          <p>
            Oppr captures the observation, the action, the reason and the
            result: a complete view of how your process <em>actually</em> runs,
            and where value is being lost.
          </p>
        </div>
      </div>
      <LoopVisual />
    </section>
  );
}

export function Capture() {
  return (
    <section className="capture section" id="how">
      <div className="section-grid flipped">
        <div className="section-heading">
          <StepEyebrow active="Capture" />
          <h2>Capture the context your machine data cannot record.</h2>
          <p className="section-sub">
            When and where it happens, in as little as 20 seconds.
          </p>
        </div>
        <div className="section-copy">
          <p>
            Operators are out on the floor every day, and they notice more than
            any sensor can. Oppr lets them capture it the moment it happens:{" "}
            <span className="k-h">speak</span>,{" "}
            <span className="k-h">take a picture</span>, or{" "}
            <span className="k-h">complete a short field check</span> on the
            phone or tablet already in their hand.
          </p>
          <p>
            Every entry is timestamped and linked to the relevant machine or
            moment. No long forms, no desktop, no reconstructing the shift
            afterward.
          </p>
        </div>
      </div>
      <div className="capture-anims">
        <figure>
          <FilmVideo
            src="/films/capture-speak.mp4"
            poster="/films/capture-speak.jpg"
            offset={0}
            label="A spoken observation is captured and extracted into structured, timestamped data points."
          />
          <figcaption>
            <strong>Speak</strong>
            <small>An observation becomes structured data points.</small>
          </figcaption>
        </figure>
        <figure>
          <FilmVideo
            src="/films/capture-photo.mp4"
            poster="/films/capture-photo.jpg"
            offset={3.5}
            label="A photo of a machine screen is captured and its readings extracted into a timestamped list."
          />
          <figcaption>
            <strong>Take a picture</strong>
            <small>A photo of a screen becomes readable values.</small>
          </figcaption>
        </figure>
        <figure>
          <FilmVideo
            src="/films/capture-check.mp4"
            poster="/films/capture-check.jpg"
            offset={7}
            label="A field check is completed one gate at a time and confirmed."
          />
          <figcaption>
            <strong>Complete a check</strong>
            <small>Gates passed one by one, in the field.</small>
          </figcaption>
        </figure>
      </div>
      <p className="closing-copy">
        Now everyone close to the process can contribute context, not only
        those with the time or confidence to write a report. More is retained,
        shift-to-shift differences become visible, and less knowledge
        disappears.
      </p>
    </section>
  );
}

export function Connect() {
  return (
    <section className="connect section">
      <div className="section-grid">
        <div className="section-heading">
          <StepEyebrow active="Connect" />
          <h2>See the complete operational story on one timeline.</h2>
          <p className="section-sub sub-ink">
            Machines show <strong>what</strong> happened.
            <br />
            Operators add <strong>why</strong>, and{" "}
            <strong>what they did next</strong>.
          </p>
        </div>
        <div className="section-copy">
          <p>
            Oppr places machine readings, operator observations, interventions
            and results on <strong>one unified timeline</strong>.
          </p>
          <p>
            Instead of investigating information across separate systems and
            shift conversations, your team can see the sequence in which it
            happened.
          </p>
          <ul>
            <li>The condition of the process</li>
            <li>What the operator noticed</li>
            <li>What action they took and why</li>
            <li>How the process responded</li>
            <li>Whether the result should be repeated</li>
          </ul>
          <p>
            A full view of the operation: machine data gives the measured
            process; operator input gives the decisions and context around it.
          </p>
        </div>
      </div>
      <figure className="connect-figure">
        <FilmVideo
          src="/films/connect-timeline.mp4"
          poster="/films/connect-timeline.jpg"
          label="Operator context and machine data land on one timeline; a correlation is detected and the result verified."
        />
      </figure>
      <p className="closing-copy">
        Recurring relationships become visible. Differences between operators,
        shifts and production runs can be examined. Experience becomes
        operational evidence.
      </p>
    </section>
  );
}

export function Execute() {
  return (
    <section className="execute section">
      <div className="section-grid">
        <div className="section-heading">
          <StepEyebrow active="Execute" />
          <h2>Turn what works into the way you work.</h2>
        </div>
        <div className="section-copy">
          <p>
            An insight only becomes an improvement when it is executed
            consistently.
          </p>
          <p>
            Oppr turns a validated finding into an instruction, check or
            standard action. It returns to the field, the operator carries it
            out, and the result lands on the same timeline.
          </p>
          <p>This closes the loop.</p>
          <p className="emphasis">
            Evidence becomes action, and every executed action creates new
            evidence.
          </p>
        </div>
      </div>
      <figure className="execute-figure">
        <FilmVideo
          src="/films/execute-loop.mp4"
          poster="/films/execute-loop.jpg"
          label="A validated finding becomes an instruction, sent to the operator's phone and executed in the field."
        />
      </figure>
    </section>
  );
}

export function Platform() {
  return (
    <section className="platform section" id="platform">
      <div className="platform-grid">
        <div className="platform-loop">
          <PlatformCircle stages={stages} />
        </div>
        <div className="platform-intro">
          <p className="section-no">THE PLATFORM</p>
          <h2>One platform for the complete operational loop.</h2>
          <p className="platform-lead">
            The same three moves, consolidated into one system:{" "}
            <strong className="k-h">capture</strong>,{" "}
            <strong className="k-h">connect</strong> and{" "}
            <strong className="k-h">execute</strong>, running together on the
            floor.
          </p>
          <p className="support-line">
            <em>
              No additional hardware required. Oppr works with your current
              systems and the mobile devices already in your operation.
            </em>
          </p>
        </div>
      </div>
      <p className="closing-copy">
        Make the improvement repeatable. Verify that it works. Continue learning
        from the result.
      </p>
    </section>
  );
}

export function FloorProof() {
  return (
    <section className="floor-proof section">
      <div className="section-grid flipped">
        <div className="section-heading">
          <p className="section-no">PROOF ON THE FLOOR</p>
          <h2>An improvement is proven when it works on the floor.</h2>
        </div>
        <div className="section-copy">
          <p>
            At a European plastics plant, an experienced operator could{" "}
            <em>sense</em> when the process needed adjusting.
          </p>
          <p>
            Oppr captured what he noticed, the change he made and why. Placed
            alongside the process data, the team could see how that intervention
            related to production conditions and scrap.
          </p>
          <p>
            The finding returned to the floor as a repeatable action, its result
            recorded on the same timeline. The experience stays{" "}
            <span className="k-h">human</span>; the improvement becomes{" "}
            <span className="emphasis">
              measurable, executable and repeatable
            </span>
            .
          </p>
        </div>
      </div>
      <blockquote className="pull-quote">
        <p>The material looks different at the die.</p>
        <cite>Line operator, extrusion · European plastics plant</cite>
      </blockquote>
      <div className="stat-strip" aria-label="Illustrative outcomes the loop targets">
        {caseStats.map(({ figure, label, Icon }) => (
          <div key={label}>
            <Icon />
            <strong>{figure}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Proof() {
  return (
    <section className="proof section" id="proof">
      <div className="proof-intro">
        <p className="section-no">THE 10-WEEK PROOF</p>
        <h2>Ready to investigate? Start with the 10-Week Proof.</h2>
        <p>
          The 10-Week Proof takes one operational blind spot within your
          production process: something you can <em>feel</em>, but cannot quite
          put your finger on.
        </p>
        <p>
          Maybe you reset the same setting every few weeks and hope it holds.
          Maybe one line runs differently on nights and no one can say why.
        </p>
        <p>
          Oppr adds the missing human context, connects it to your machine data,
          and builds one view of what happens before, during and after.
          Together we find the pattern, execute one improvement, and verify it
          on the floor.
        </p>
      </div>
      <div className="proof-columns">
        <div>
          <h3>What the Proof requires</h3>
          <ol>
            {proofNeeds.map((item, i) => (
              <li key={item}>
                <span>0{i + 1}</span>
                {item}
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h3>What Oppr provides</h3>
          <ol>
            {proofProvides.map((item, i) => (
              <li key={item}>
                <span>0{i + 1}</span>
                {item}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function Review() {
  return (
    <section className="review section" id="review">
      <div>
        <p className="section-no">Get in touch</p>
        <h2>Is the same issue coming back, and no one can say why?</h2>
      </div>
      <div>
        <p>
          Maybe there is a blind spot you cannot quite put your finger on: a
          recurring loss you keep resetting, a process that behaves differently
          between shifts, a result you cannot fully explain.
        </p>
        <p>
          <strong>In 30 minutes</strong>, we will explore the data you have, the
          human context you are missing, and whether it is a suitable scope for
          the <strong>10-Week Proof</strong>.
        </p>
        <Link className="primary-cta" href="/book">
          Book a call <span>↗</span>
        </Link>
      </div>
    </section>
  );
}
