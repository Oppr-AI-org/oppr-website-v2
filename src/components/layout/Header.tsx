import Link from "next/link";
import { Wordmark } from "@/components/home/primitives";

export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Wordmark />
        <div className="header-right">
          <nav aria-label="Main navigation">
            <a href="/#platform">Platform</a>
            <a href="/#how">How it works</a>
            <a href="/#proof">10-Week Proof</a>
            <Link href="/about">About</Link>
          </nav>
          <Link className="top-cta" href="/book">
            Book a call <span>↗</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
