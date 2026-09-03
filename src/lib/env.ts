/** Typed environment variables for Supabase */

function read(name: string): string | undefined {
  if (typeof process !== "undefined" && process.env[name]) return process.env[name];
  const meta = import.meta.env as Record<string, string | undefined>;
  return meta[name];
}

function required(name: string, value: string | undefined): string {
  if (!value || value.startsWith("your-")) {
    throw new Error(
      `Missing environment variable: ${name}. Copy .env.example to .env and add your Supabase credentials.`,
    );
  }
  return value;
}

export const env = {
  get supabaseUrl() {
    return required("VITE_SUPABASE_URL", read("VITE_SUPABASE_URL"));
  },
  get supabaseAnonKey() {
    return required("VITE_SUPABASE_ANON_KEY", read("VITE_SUPABASE_ANON_KEY"));
  },
  get supabaseServiceRoleKey() {
    return required("SUPABASE_SERVICE_ROLE_KEY", read("SUPABASE_SERVICE_ROLE_KEY"));
  },
  get adminEmail() {
    return read("ADMIN_EMAIL") ?? "admin@gpw.edu.in";
  },
  get isConfigured() {
    const url = read("VITE_SUPABASE_URL");
    const key = read("VITE_SUPABASE_ANON_KEY");
    return Boolean(url && key && !url.startsWith("your-") && !key.startsWith("your-"));
  },
};

export function isSupabaseConfigured(): boolean {
  try {
    return env.isConfigured;
  } catch {
    return false;
  }
}
