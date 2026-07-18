"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function BookForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  // When the form is replaced by the confirmation, move keyboard focus onto it
  // so it isn't stranded on a now-removed button.
  useEffect(() => {
    if (status === "success") {
      successHeadingRef.current?.focus();
    }
  }, [status]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const body = {
      name: String(data.get("name") ?? ""),
      company: String(data.get("company") ?? ""),
      email: String(data.get("email") ?? ""),
      blindSpot: String(data.get("blindSpot") ?? ""),
    };

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      form.reset();
      setStatus("success");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="book-success" role="status">
        <p className="book-success-mark">REQUEST RECEIVED</p>
        <h2 ref={successHeadingRef} tabIndex={-1}>
          Thanks, we&rsquo;ll be in touch.
        </h2>
        <p>
          We&rsquo;ll reply within one working day to arrange your 30-minute
          operational review. Nothing to prepare: just bring the blind spot.
        </p>
      </div>
    );
  }

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      <div className="book-field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" autoComplete="name" required />
      </div>

      <div className="book-field">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          required
        />
      </div>

      <div className="book-field">
        <label htmlFor="email">Work email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
        />
      </div>

      <div className="book-field">
        <label htmlFor="blindSpot">
          The blind spot you want to discuss{" "}
          <span className="book-optional">optional</span>
        </label>
        <textarea
          id="blindSpot"
          name="blindSpot"
          rows={4}
          placeholder="A recurring loss you keep resetting, a process that behaves differently between shifts, a result you can't fully explain…"
        />
      </div>

      {status === "error" && (
        <p className="book-error" role="alert">
          {error}
        </p>
      )}

      <button
        className="primary-cta book-submit"
        type="submit"
        disabled={status === "submitting"}
      >
        {status === "submitting"
          ? "Sending…"
          : "Request my operational review"}
        <span>↗</span>
      </button>

      <p className="book-reassure">
        A 30-minute introductory call to see if there&rsquo;s a fit. You leave
        with the blind spot identified, whether or not we work together.
      </p>
    </form>
  );
}
