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

