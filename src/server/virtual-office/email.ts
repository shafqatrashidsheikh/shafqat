/**
 * Outbound student email adapter.
 * Configure RESEND_API_KEY (+ optional VO_EMAIL_FROM) to send real mail.
 * Without config, notifications stay recorded as queued/failed with a clear reason.
 */

function readEnv(name: string): string | undefined {
  if (typeof process !== "undefined" && process.env[name]) return process.env[name];
  return undefined;
}

export type EmailSendResult =
  | { ok: true; provider: "resend"; id?: string }
  | { ok: false; provider: "resend" | "none"; error: string };

export function isStudentEmailConfigured(): boolean {
  const key = readEnv("RESEND_API_KEY");
  return Boolean(key && !key.startsWith("your-"));
}

export async function sendStudentEmail(input: {
  to: string;
  subject: string;
  body: string;
}): Promise<EmailSendResult> {
  const apiKey = readEnv("RESEND_API_KEY");
  const from =
    readEnv("VO_EMAIL_FROM") ?? readEnv("RESEND_FROM_EMAIL") ?? "GPW Srinagar <onboarding@resend.dev>";

  if (!apiKey || apiKey.startsWith("your-")) {
    return {
      ok: false,
      provider: "none",
      error:
        "Email not configured. Set RESEND_API_KEY (and optionally VO_EMAIL_FROM) in the server environment.",
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.subject,
        text: input.body,
      }),
    });

    const json = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
    if (!res.ok) {
      return {
        ok: false,
        provider: "resend",
        error: json.message ?? `Resend HTTP ${res.status}`,
      };
    }

    return { ok: true, provider: "resend", ...(json.id ? { id: json.id } : {}) };
  } catch (err) {
    return {
      ok: false,
      provider: "resend",
      error: err instanceof Error ? err.message : "Email send failed",
    };
  }
}
