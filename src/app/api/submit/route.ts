import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const {
    occasion,
    duration,
    q3,
    familiarity,
    q5,
    email,
    colour_filter,
    dietary_pref,
    is_rose_signal,
    is_premium_bias,
  } = await request.json();

  await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      occasion,
      duration,
      q3,
      familiarity,
      q5,
      email,
      colour_filter,
      dietary_pref,
      is_rose_signal,
      is_premium_bias,
    }),
  });

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "nathantsimon@gmail.com",
    subject: "New GBD submission",
    html: `
      <p><strong>New Guided Wine Discovery submission</strong></p>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Occasion:</strong> ${occasion}</li>
        <li><strong>Duration:</strong> ${duration}</li>
        <li><strong>Feel (Q3):</strong> ${q3}</li>
        <li><strong>Familiarity:</strong> ${familiarity}</li>
        <li><strong>Budget (Q5):</strong> ${q5}</li>
        <li><strong>Colour filter:</strong> ${colour_filter}</li>
        <li><strong>Dietary:</strong> ${dietary_pref}</li>
        <li><strong>Rosé signal:</strong> ${is_rose_signal}</li>
        <li><strong>Premium bias:</strong> ${is_premium_bias}</li>
      </ul>
    `,
  });

  return Response.json({ success: true });
}
