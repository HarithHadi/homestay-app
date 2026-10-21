import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { safeRedirect } from "@/utils/utils";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();
  const next = safeRedirect(redirectTo);

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

    const {
      data: {user},

    } = await supabase.auth.getUser();

    if(user) {
      const { data:profile} = await supabase.from("profiles").select("id").eq("id", user.id).maybeSingle();

      if(!profile){
        return NextResponse.redirect(new URL(`/complete-profile?${new URLSearchParams({ redirect_to: next })}`, origin));
      }
    }

    return NextResponse.redirect(new URL(next, origin));
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/protected`);
}
