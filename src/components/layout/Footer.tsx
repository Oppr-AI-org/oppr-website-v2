import Link from "next/link";
import { Wordmark } from "@/components/home/primitives";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Oude+Middenweg+17+2491+AC+Den+Haag+Netherlands";

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0z"
      />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.08 0 12 0 12s0 3.92.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14c.5-1.88.5-5.8.5-5.8s0-3.92-.5-5.8zM9.6 15.57V8.43L15.82 12 9.6 15.57z"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 6.5h18v11H3zM3.5 7l8.5 6 8.5-6"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z"
      />
      <circle
        cx="12"
        cy="10"
        r="2.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="footer-brand">
        <Wordmark />
        <p className="footer-tagline">
          Operational Intelligence Software for Manufacturing.
        </p>
        <span>Oppr B.V. · Oude Middenweg 17, 2491 AC Den Haag, NL</span>
        <div className="footer-social">
          <a
            href="https://www.linkedin.com/company/opprai"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Oppr on LinkedIn"
          >
            <LinkedInIcon />
          </a>
          <a
            href="https://www.youtube.com/@opprai"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Oppr on YouTube"
          >
            <YouTubeIcon />
          </a>
          <Link href="/contact" aria-label="Contact Oppr">
            <MailIcon />
          </Link>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Find Oppr on the map"
          >
            <PinIcon />
          </a>
        </div>
      </div>
      <div className="footer-cols">
        <nav aria-label="Product">
          <p className="footer-label">Product</p>
          <a href="/#platform">Platform</a>
          <a href="/#how">How it works</a>
          <a href="/#proof">10-Week Proof</a>
          <Link href="/book">Book a call</Link>
        </nav>
        <nav aria-label="Company">
          <p className="footer-label">Company</p>
          <Link href="/about">About</Link>
          <Link href="/press">Press</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}
