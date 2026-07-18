import { Resend } from "resend";

// General enquiries are delivered here, same inbox as the booking form.
const TO_ADDRESS = "info@oppr.ai";
// Must be a domain verified in your Resend account. oppr.ai is used in production.
const FROM_ADDRESS = "Oppr Website <noreply@oppr.ai>";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
};

export async function POST(request: Request) {
  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = payload.name?.trim() ?? "";
  const email = payload.email?.trim() ?? "";
  const company = payload.company?.trim() ?? "";
  const message = payload.message?.trim() ?? "";

  if (!name) {
    return Response.json({ error: "Please add your name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return Response.json(
      { error: "Please add a valid email address." },
      { status: 400 }
    );
  }
  if (!message) {
    return Response.json(
      { error: "Please add a short message." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // The form is wired end-to-end; delivery just needs the key in the environment.
    return Response.json(
      {
        error:
          "Contact email isn't configured yet. Set RESEND_API_KEY and try again.",
      },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);

  const lines = [
    `Name: ${name}`,
    company ? `Company: ${company}` : "Company: (not given)",
    `Email: ${email}`,
    "",
    "Message:",
    message,
  ];

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      replyTo: email,
      subject: `Website enquiry — ${company || name}`,
      text: lines.join("\n"),
    });

    if (error) {
      return Response.json(
        { error: "Could not send your message. Please try again." },
        { status: 502 }
      );
    }

    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json(
      { error: "Could not send your message. Please try again." },
      { status: 502 }
    );
  }
}
