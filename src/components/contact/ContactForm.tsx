"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  // Move focus onto the confirmation when the form is replaced, so keyboard
  // focus isn't stranded on a now-removed button.
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
      email: String(data.get("email") ?? ""),
      company: String(data.get("company") ?? ""),
      message: String(data.get("message") ?? ""),
    };

    try {
      const res = await fetch("/api/contact", {
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
        <p className="book-success-mark">MESSAGE SENT</p>
        <h2 ref={successHeadingRef} tabIndex={-1}>
          Thanks, we&rsquo;ll be in touch.
        </h2>
        <p>
          We read every message and reply within one working day. If it is
          urgent, you can also email us directly at info@oppr.ai.
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
        <label htmlFor="company">
          Company <span className="book-optional">optional</span>
        </label>
        <input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
        />
      </div>

      <div className="book-field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="What can we help you with?"
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
        {status === "submitting" ? "Sending…" : "Send message"}
        <span>↗</span>
      </button>

      <p className="book-reassure">
        Prefer to talk through a specific operational problem? Book a
        30-minute review instead.
      </p>
    </form>
  );
}
