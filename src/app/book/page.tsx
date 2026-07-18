import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/home/primitives";
import { BookForm } from "@/components/book/BookForm";

export const metadata: Metadata = {
  title: "Book an operational review — Oppr",
  description:
    "Book a 30-minute introductory call. Bring one blind spot; together we see whether it's a fit for the 10-Week Proof, whether or not we work together.",
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
          <h1>Book a 30-minute operational review.</h1>
          <p className="book-lede">
            Bring one blind spot: a process you cannot fully explain, a recurring
            loss, a dependence on one experienced operator. In 30 minutes we look
            at the data you have, the context you&rsquo;re missing, and whether
            it&rsquo;s a fit for the 10-Week Proof. It&rsquo;s an introductory
            conversation to see if you&rsquo;re a good candidate, not a
            commitment.
          </p>
          <div className="book-facts">
            <span>No new hardware</span>
            <span>No preparation needed</span>
            <span>You leave with an identified blind spot</span>
          </div>
        </div>

        <div className="book-panel">
          <BookForm />
        </div>
      </section>
    </main>
  );
}
