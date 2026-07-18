import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark, ProductTimeline } from "@/components/home/primitives";
import { BookForm } from "@/components/book/BookForm";

export const metadata: Metadata = {
  title: "Book an operational review — Oppr",
  description:
    "Book a 30-minute operational review. Bring one blind spot; you leave with it scoped, whether or not we work together.",
};

export default function BookPage() {
  return (
    <main className="oppr-site theme-v4 book-page">
      <header className="site-header">
        <div className="header-inner book-header-inner">
          <Wordmark />
          <Link className="book-back" href="/">
            <span>←</span> Back
          </Link>
        </div>
      </header>

      <section className="book-shell">
        <div className="book-intro">
          <p className="section-no">THE NEXT CONVERSATION</p>
          <h1>Book a 30-minute operational review.</h1>
          <p className="book-lede">
            Bring one blind spot: a process you cannot fully explain, a recurring
            loss, a dependence on one experienced operator. In 30 minutes we map
            the data you have, the context you&rsquo;re missing, and whether it
            fits the 10-Week Proof.
          </p>
          <div className="book-facts">
            <span>No new hardware</span>
            <span>No preparation needed</span>
            <span>You leave with a scoped blind spot</span>
          </div>
          <div className="book-timeline">
            <ProductTimeline />
          </div>
        </div>

        <div className="book-panel">
          <BookForm />
        </div>
      </section>
    </main>
  );
}
