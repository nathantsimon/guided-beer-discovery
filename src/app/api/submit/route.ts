import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { occasion, duration, mood, familiarity, budget, email } =
    await request.json();

  await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ occasion, duration, mood, familiarity, budget, email }),
  });

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "nathantsimon@gmail.com",
    subject: "New GBD submission",
    html: `
      <p><strong>New Guided Beer Discovery submission</strong></p>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Occasion:</strong> ${occasion}</li>
        <li><strong>Duration:</strong> ${duration}</li>
        <li><strong>Mood:</strong> ${mood}</li>
        <li><strong>Familiarity:</strong> ${familiarity}</li>
        <li><strong>Budget:</strong> ${budget}</li>
      </ul>
    `,
  });

  return Response.json({ success: true });
}
