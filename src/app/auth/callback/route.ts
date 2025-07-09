import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { ROUTES } from "@/config/routes";
import { defaultOnboardingStatus } from "@/config/onboarding-statuses";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const userType = searchParams.get("userType");

  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get("next") ?? ROUTES.DASHBOARD.ROOT;
  if (!next.startsWith("/")) {
    // if "next" is not a relative URL, use the default
    next = ROUTES.DASHBOARD.ROOT;
  }

  if (error) {
    return NextResponse.redirect(
      `${origin}${ROUTES.AUTH.LOGIN}?error=${encodeURIComponent(error)}`
    );
  }

  if (code) {
    const supabase = await createClient();

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      code
    );

    if (!exchangeError) {
      // Get the user after successful authentication
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && userType) {
        try {
          // Check if user already exists in our users table
          const { data: existingUser, error: fetchError } = await supabase
            .from("users")
            .select("*")
            .eq("email", user.email!)
            .single();

          if (fetchError && fetchError.code === "PGRST116") {
            // User doesn't exist, create new user with the correct role
            const role = userType.toLowerCase() as "viber" | "coder";

            await supabase.from("users").insert({
              id: user.id,
              email: user.email!,
              name:
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                null,
              avatar_url: user.user_metadata?.avatar_url || null,
              bio: null,
              role,
              stripe_account_id: null,
              onboarding_status: defaultOnboardingStatus,
            });
          }
        } catch (error) {
          console.error("Error creating user:", error);
          // Continue with redirect even if user creation fails
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(
    `${origin}${ROUTES.AUTH.LOGIN}?error=Authentication failed`
  );
}
