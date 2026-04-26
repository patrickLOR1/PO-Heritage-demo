import { supabase } from "./supabase";

export async function checkRateLimit(ip: string, limit: number = 5, windowMinutes: number = 1) {
  // Use a simplified rate limit logic for v1 using the rate_limits table
  try {
    const { data, error } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('ip', ip)
      .single();

    const now = new Date();

    if (!data) {
      // First request from this IP
      await supabase.from('rate_limits').insert([{ ip, request_count: 1, last_request: now.toISOString() }]);
      return { allowed: true };
    }

    const lastRequest = new Date(data.last_request);
    const diffMinutes = (now.getTime() - lastRequest.getTime()) / (1000 * 60);

    if (diffMinutes > windowMinutes) {
      // Window expired, reset counter
      await supabase
        .from('rate_limits')
        .update({ request_count: 1, last_request: now.toISOString() })
        .eq('ip', ip);
      return { allowed: true };
    }

    if (data.request_count >= limit) {
      // Limit exceeded
      return { allowed: false };
    }

    // Increment counter
    await supabase
      .from('rate_limits')
      .update({ request_count: data.request_count + 1 })
      .eq('ip', ip);
    
    return { allowed: true };
  } catch (error) {
    console.error("Rate limit check failed:", error);
    return { allowed: true }; // Fail open to not block users if DB is down
  }
}

export function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, ""); // Basic XSS prevention
}
