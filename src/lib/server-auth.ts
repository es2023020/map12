import { getSupabaseAdminClient } from "./supabase";

export async function verifyAdminRequest(request: Request): Promise<{ authorized: boolean; error?: string }> {
  // 1. Check for server secret key header (for server-to-server or CI scripts)
  const secretHeader = request.headers.get("x-admin-secret") || request.headers.get("x-service-key");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (secretHeader && serviceKey && secretHeader === serviceKey) {
    return { authorized: true };
  }

  // 2. Check for Bearer JWT token in Authorization header
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { authorized: false, error: "Missing or malformed Authorization header" };
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    // If Supabase is not configured, deny unauthenticated writes in production
    if (process.env.NODE_ENV === "production") {
      return { authorized: false, error: "Authentication service unavailable" };
    }
    return { authorized: true };
  }

  try {
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) {
      return { authorized: false, error: "Invalid or expired authorization token" };
    }

    // Check if user has admin privileges
    if (user.email?.toLowerCase() === "elsayedshoeip70@gmail.com") {
      return { authorized: true };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") {
      return { authorized: true };
    }

    return { authorized: false, error: "Forbidden: Administrator role required" };
  } catch (err: any) {
    return { authorized: false, error: err?.message || "Authentication verification failed" };
  }
}
