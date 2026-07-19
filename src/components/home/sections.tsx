import Link from "next/link";
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

// Illustrative target ranges, NOT a specific client result. These are the
// kinds of outcomes the loop is built to produce. Per IMPLEMENTATION.md §4.7,
// the three directional entries below are placeholders: replace each with a
// real, verified figure and a redacted attribution (e.g. "-31% scrap · CPG
// packaging line") once the first case study is confirmed, and drop the
// "illustrative" framing. "90 days" is kickoff to implemented value: the
// 10-Week Proof (proof of value) plus implementation, distinct from the
// week-ten verified result.
const caseStats = [
  { figure: "Less scrap", label: "on the line under investigation", Icon: IconLessScrap },
  { figure: "Fewer stoppages", label: "from the recurring fault you can't place", Icon: IconFewerStoppages },
  { figure: "Less reporting", label: "time lost reconstructing the shift", Icon: IconLessReporting },
  { figure: "90 days", label: "from kickoff to implemented value", Icon: IconDaysToLive },
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
          <p className="eyebrow">Operator Intelligence for manufacturing</p>
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
            <span>Operators on board in days</span>
            <span>Results in 10 weeks</span>
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
            Your <strong className="k-m">Machines</strong> record conditions
            and results. Your <strong className="k-h">Operators</strong> see
            what changed, decide what to do, and learn from it. Together they
            hold the complete picture, but it is rarely captured as{" "}
            <em>one connected sequence</em>. Readings sit in one system;
            observations and reasoning stay with individuals or vanish between
            shifts.
          </p>
          <p>
            The answer usually exists. Part of it is in the ERP and the
            historians, your common record of how the process is run. The rest
            is spread across dozens of Excel files and the memory of whoever
            was on shift that night. Oppr brings that missing half of the
            picture together with your machine data, so you finally see{" "}
            <em className="u-line">how the process actually runs</em>, and where
            value is being lost.
          </p>
        </div>
      </div>
      <p className="closing-copy">
        We call it Operator Intelligence: your best people&rsquo;s judgement,
        made usable by the whole operation.
      </p>
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
            Where it happens, when it happens. Not at the end of the shift.
          </p>
        </div>
        <div className="section-copy">
          <p>
            The scrap bin fills a little faster than it used to. The energy bill
            drifts up a few percent. Nothing on the dashboard explains either
            one. But operators are out on the floor every day, and they notice
            more than any sensor can. Oppr lets them capture it the moment it
            happens:{" "}
            <span className="k-h">speak</span>,{" "}
            <span className="k-h">take a picture</span>, or{" "}
            <span className="k-h">complete a short field check</span> on the
            phone or tablet already in their hand.
          </p>
          <p>
            No long forms, no desktop, no reconstructing the shift afterward.
          </p>
        </div>
      </div>
      <figure className="capture-figure">
        <FilmVideo
          src="/films/capture.mp4"
          poster="/films/capture.jpg"
          label="One operator captures what the sensors miss in three ways: a spoken note, a photo of the machine, and a short field check, each landing as context on the line's timeline."
        />
        <figcaption className="film-caption">
          <strong>Speak, photograph, check</strong>
          <small>
            Each captured in seconds, on the phone or tablet already in their
            hand.
          </small>
        </figcaption>
      </figure>
      <p className="closing-copy">
        Now everyone close to the process can contribute context, no matter
        their background, experience or language. Shift-to-shift differences
        become visible, and what your best people know is actually captured.
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
          <p className="section-sub">
            Machines show <strong>what</strong> happened.
            <br />
            Operators add <strong>why</strong>, and{" "}
            <strong>what they did next</strong>.
          </p>
        </div>
        <div className="section-copy">
          <p>
            The office sees the numbers. The floor sees the reasons. Most days
            they meet for fifteen minutes, in a morning meeting, from memory.
            Oppr puts both on <strong>one unified timeline</strong> instead.
          </p>
          <p>
            Your team sees the whole story in the order it happened, and
            recurring problems finally get explained.
          </p>
          <p>
            The discussion moves from whose memory is right to what the timeline
            shows.
          </p>
        </div>
      </div>
      <figure className="connect-figure">
        <FilmVideo
          src="/films/connect-timeline.mp4"
          poster="/films/connect-timeline.jpg"
          label="Human context and machine data come together on one timeline, and the picture becomes clear."
        />
        <figcaption className="film-caption">
          <strong>One unified timeline</strong>
          <small>Operator context above the line. Machine data below it.</small>
        </figcaption>
      </figure>
      <p className="closing-copy">
        Differences between operators, shifts and production runs can finally be
        examined. Experience becomes operational evidence.
      </p>
    </section>
  );
}

export function Execute() {
  return (
    <section className="execute section">
      <div className="section-grid flipped">
        <div className="section-heading">
          <StepEyebrow active="Execute" />
          <h2>Turn what works into the way you work.</h2>
          <p className="section-sub">
            From validated finding to standard action, verified in the field.
          </p>
        </div>
        <div className="section-copy">
          <p>
            An insight only becomes an improvement when it is executed
            consistently.
          </p>
          <p>
            Oppr turns a validated finding into a standard action for the floor.
            It returns to the field, the operator carries it out, and the result
            lands on the same timeline.
          </p>
          <p>This closes the loop.</p>
        </div>
      </div>
      <figure className="execute-figure">
        <FilmVideo
          src="/films/execute-loop.mp4"
          poster="/films/execute-loop.jpg"
          label="A validated finding becomes an instruction, sent to the operator's phone and executed in the field."
        />
        <figcaption className="film-caption">
          <strong>Back to the floor</strong>
          <small>
            A validated finding becomes a standard action, and its result is
            recorded.
          </small>
        </figcaption>
      </figure>
      <p className="closing-copy">
        Evidence becomes action, and every executed action creates new
        evidence. The improvement is confirmed where it counts: on the floor.
      </p>
    </section>
  );
}

export function Platform() {
  return (
    <section className="platform section" id="platform">
      <div className="platform-grid">
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
          <p className="platform-lead">
            This is Operator Intelligence as a system, not a stack of tools.
          </p>
          <p className="support-line">
            <em>
              No additional hardware required. Oppr works with your current
              systems and the mobile devices already in your operation.
            </em>
          </p>
        </div>
        <div className="platform-loop">
          <PlatformCircle stages={stages} />
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
          <p>
            It began as a 10-Week Proof of value. Ninety days after kickoff, the
            new action was standard practice on the line.
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
          The 10-Week Proof is our proof of value. It takes one operational
          blind spot within your production process: something you can{" "}
          <em>feel</em>, but cannot quite put your finger on.
        </p>
        <p>
          Maybe you reset the same setting every few weeks and hope it holds.
          Maybe the day shift hits rate and the night shift, on the same
          machines, does not, and everyone has a theory but no one can say for
          sure.
        </p>
        <p>
          The work follows a fixed path. We start with an analysis of your
          historic data; that analysis surfaces the issues and sets the scope.
          Ten weeks on the line then confirm the hypothesis: together we find
          the pattern, execute one improvement, and verify it on the floor. From
          there we implement, and first value typically lands within ninety days
          of kickoff.
        </p>
      </div>
      <div className="fact-strip lg proof-reassure">
        <span>One line, one blind spot</span>
        <span>Starts with your historic data</span>
        <span>A verified improvement by week ten</span>
      </div>
    </section>
  );
}

export function Review() {
  return (
    <section className="review section flipped" id="review">
      <div>
        <p className="section-no">Get in touch</p>
        <h2>Is the same issue coming back, and no one can say why?</h2>
      </div>
      <div>
        <p>
          If you have ever slept with your phone next to the bed because of a
          night shift, you know the feeling.
        </p>
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
