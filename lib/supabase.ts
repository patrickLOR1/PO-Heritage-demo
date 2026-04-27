import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy singleton — never calls createClient at module load time
// This prevents Vercel build errors when env vars are not present at build
let _client: SupabaseClient | null = null;
let _serverClient: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      // Return a no-op proxy so nothing crashes at build time
      return createNoopClient();
    }
    _client = createClient(url, key);
  }
  return _client;
}

export function createServerClient(): SupabaseClient {
  if (!_serverClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return createNoopClient();
    _serverClient = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _serverClient;
}

// Proxy that silently no-ops all Supabase calls during build
function createNoopClient(): SupabaseClient {
  const noop = () => ({
    select: () => noop(),
    insert: () => noop(),
    update: () => noop(),
    delete: () => noop(),
    eq: () => noop(),
    single: () => Promise.resolve({ data: null, error: null }),
    then: (resolve: (v: any) => any) => Promise.resolve({ data: null, error: null }).then(resolve),
  });
  return new Proxy({} as SupabaseClient, {
    get: () => noop,
  });
}

// Proxy export — looks like a normal supabase client but initializes lazily
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getClient() as any)[prop];
  },
});
