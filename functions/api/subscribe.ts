/// <reference types="@cloudflare/workers-types" />

interface Env {
  BEEHIIV_API_KEY: string;
  PUBLICATION_ID: string;
  TURNSTILE_SECRET_KEY?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Cloudflare public test secret — always passes; replace with real secret in Pages env vars.
const TURNSTILE_TEST_SECRET = '1x0000000000000000000000000000000AA';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { email?: unknown; name?: unknown; turnstileToken?: unknown; website?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  // Honeypot: real users never fill this field.
  if (typeof body.website === 'string' && body.website.length > 0) {
    return Response.json({ success: true }, { status: 200 });
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  if (!email || !EMAIL_RE.test(email)) {
    return Response.json({ error: 'A valid email address is required.' }, { status: 400 });
  }

  const token = typeof body.turnstileToken === 'string' ? body.turnstileToken : '';
  const secret = env.TURNSTILE_SECRET_KEY ?? TURNSTILE_TEST_SECRET;
  const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret, response: token }),
  });
  const verifyData = await verify.json() as { success: boolean };
  if (!verifyData.success) {
    return Response.json({ error: 'Bot verification failed. Please try again.' }, { status: 403 });
  }

  const res = await fetch(
    `https://api.beehiiv.com/v2/publications/${env.PUBLICATION_ID}/subscriptions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.BEEHIIV_API_KEY}`,
      },
      body: JSON.stringify({
        email,
        reactivate_existing: false,
        send_welcome_email: true,
      }),
    }
  );

  if (!res.ok) {
    return Response.json({ error: 'Subscription failed. Please try again.' }, { status: 502 });
  }

  return Response.json({ success: true }, { status: 200 });
};
