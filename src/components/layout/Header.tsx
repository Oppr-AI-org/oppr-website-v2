"use client";

import { useState } from "react";
import Link from "next/link";
import { Wordmark } from "@/components/home/primitives";

const NAV = [
  { href: "/#platform", label: "Platform" },
  { href: "/#how", label: "How it works" },
  { href: "/#proof", label: "10-Week Proof" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Wordmark />
        <div className="header-right">
          <nav className="header-nav" aria-label="Main navigation">
            {NAV.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <Link className="top-cta" href="/book">
            Book a call <span>↗</span>
          </Link>
          <button
            type="button"
            className="nav-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div id="mobile-nav" className={`nav-drawer${open ? " open" : ""}`}>
        <nav aria-label="Mobile navigation">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} onClick={close}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
