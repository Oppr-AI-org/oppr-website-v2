import Link from "next/link";

export function Wordmark() {
  // Links home from anywhere — on the homepage this scrolls to top; off it (e.g.
  // /book) it returns to the landing page instead of a dead #top anchor.
  return (
    <Link href="/" className="wordmark" aria-label="Oppr home">
      oppr<span>.</span>
    </Link>
  );
}

export function ProductTimeline() {
  return (
    <div
      className="product-timeline"
      aria-label="Unified operational timeline example"
    >
      <div className="product-head">
        <span>LINE 04 / EXTRUSION</span>
        <span className="live-dot">LIVE</span>
      </div>
      <div className="tl-row machine-row">
        <i />
        <time>14:02:18</time>
        <div>
          <small>MACHINE CONDITION</small>
          <strong>Zone 3 · 184°C</strong>
        </div>
      </div>
      <div className="tl-row operator-row">
        <i />
        <time>14:04:11</time>
        <div>
          <small>OPERATOR OBSERVATION</small>
          <strong>Material feels different at the die.</strong>
          <p>Shift B · spoken note</p>
        </div>
      </div>
      <div className="tl-row action-row">
        <i />
        <time>14:06:03</time>
        <div>
          <small>INTERVENTION + REASON</small>
          <strong>Temperature reduced by 3°C</strong>
          <p>Stabilise surface finish</p>
        </div>
      </div>
      <div className="tl-row result-row">
        <i />
        <time>14:18:42</time>
        <div>
          <small>VERIFIED RESULT</small>
          <strong>Surface finish stable</strong>
          <p>Action retained for next run</p>
        </div>
      </div>
    </div>
  );
}

export function LoopVisual() {
  return (
    <div className="loop-visual" aria-label="Operational learning loop: observe, adjust, learn — then improve and repeat">
      {/* the improve step is the return arc: Learn loops back over the top into
          Observe, with the IMPROVE pill sitting on the line */}
      <svg className="loop-arc" viewBox="0 0 1000 50" aria-hidden="true">
        <path className="loop-arc-line" d="M905 46 C 905 8, 815 8, 500 8 C 185 8, 95 8, 95 46" />
        <path className="loop-arc-head" d="M88 37 L95 46 L102 37" />
      </svg>
      <span className="loop-arc-pill">Improve</span>
      <div className="loop-row">
        <div>
          <strong>Observe</strong>
          <small>What changed?</small>
        </div>
        <div>
          <strong>Adjust</strong>
          <small>What was done, and why?</small>
        </div>
        <div>
          <strong>Learn</strong>
          <small>What happened next?</small>
        </div>
      </div>
    </div>
  );
}
