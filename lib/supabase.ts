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
      const noopClient = createNoopClient();
      (noopClient as any).isNoop = true;
      return noopClient;
    }
    _client = createClient(url, key);
    (_client as any).isNoop = false;
  }
  return _client;
}

export function createServerClient(): SupabaseClient {
  if (!_serverClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      const noop = createNoopClient();
      (noop as any).isNoop = true;
      return noop;
    }
    _serverClient = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    (_serverClient as any).isNoop = false;
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
    order: () => noop(),
    single: () => Promise.resolve({ data: null, error: null }),
    then: (resolve: (v: any) => any) => Promise.resolve({ data: null, error: null }).then(resolve),
  });
  
  return new Proxy({} as SupabaseClient, {
    get: (target, prop) => {
      if (prop === 'auth') return {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: { session: null }, error: new Error("Supabase no configurado") }),
        signUp: () => Promise.resolve({ data: { user: null }, error: new Error("Supabase no configurado") }),
        signOut: () => Promise.resolve({ error: null }),
      };
      if (prop === 'from') return () => noop();
      return (target as any)[prop];
    },
  });
}

// Proxy export — looks like a normal supabase client but initializes lazily
export const supabase: SupabaseClient & { isNoop?: boolean } = new Proxy({} as any, {
  get(_target, prop) {
    const client = getClient();
    if (prop === 'isNoop') return (client as any).isNoop;
    return (client as any)[prop];
  },
});
