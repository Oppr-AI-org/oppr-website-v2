import { Resend } from "resend";

// Where review requests are delivered. Matches the address in the project README.
const TO_ADDRESS = "info@oppr.ai";
// Must be a domain verified in your Resend account. oppr.ai is used in production.
const FROM_ADDRESS = "Oppr Website <noreply@oppr.ai>";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type BookPayload = {
  name?: string;
  company?: string;
  email?: string;
  blindSpot?: string;
};

export async function POST(request: Request) {
  let payload: BookPayload;
  try {
    payload = (await request.json()) as BookPayload;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = payload.name?.trim() ?? "";
  const company = payload.company?.trim() ?? "";
  const email = payload.email?.trim() ?? "";
  const blindSpot = payload.blindSpot?.trim() ?? "";

  if (!name) {
    return Response.json({ error: "Please add your name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return Response.json(
      { error: "Please add a valid email address." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // The form is wired end-to-end; delivery just needs the key in the environment.
    return Response.json(
      {
        error:
          "Booking email isn't configured yet. Set RESEND_API_KEY and try again.",
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
    "Operational blind spot to discuss:",
    blindSpot || "(not given)",
  ];

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      replyTo: email,
      subject: `Operational review request — ${company || name}`,
      text: lines.join("\n"),
    });

    if (error) {
      return Response.json(
        { error: "Could not send your request. Please try again." },
        { status: 502 }
      );
    }

    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json(
      { error: "Could not send your request. Please try again." },
      { status: 502 }
    );
  }
}
