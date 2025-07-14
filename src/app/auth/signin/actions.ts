"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  keepLoggedIn: z.boolean().optional(),
});

type SignInFormData = z.infer<typeof signInSchema>;

export async function signin(data: SignInFormData) {
  console.log("signin called action", data);
  const supabase = await createClient();
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    redirect("/error");
  }
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

// const onSubmit = async (data: SignInFormData) => {
//     console.log("onSubmit called with data:", data);
//     //setIsManualLoading(true);
//     setError(null);

//     try {
//       console.log("Attempting sign in...");

//       const { data: authData, error } = await supabase.auth.signInWithPassword({
//         email: data.email,
//         password: data.password,
//       });

//       console.log("Regular client response:", { data: authData, error });

//       if (error) {
//         throw error;
//       }

//       console.log("Sign in successful with regular client:", authData);

//       // Update this route to redirect to an authenticated route. The user already has an active session.
//       console.log("Redirecting to:", ROUTES.DASHBOARD.ROOT);
//       router.push(ROUTES.DASHBOARD.ROOT);
//       console.log("Redirect called");
//     } catch (error: unknown) {
//       setError(error instanceof Error ? error.message : "An error occurred");
//     } finally {
//       setIsManualLoading(false);
//     }

//     // try {
//     //   // Add timeout to the authentication call
//     //   const authPromise = supabase.auth.signInWithPassword({
//     //     email: data.email,
//     //     password: data.password,
//     //   });

//     //   const timeoutPromise = new Promise((_, reject) => {
//     //     setTimeout(
//     //       () => reject(new Error("Authentication timeout after 15 seconds")),
//     //       15000
//     //     );
//     //   });

//     //   const { data: authData, error: signInError } = (await Promise.race([
//     //     authPromise,
//     //     timeoutPromise,
//     //   ])) as any;

//     //   if (signInError) {
//     //     // Handle specific Supabase errors
//     //     if (signInError.message?.includes("Invalid login credentials")) {
//     //       setError("Invalid email or password. Please check your credentials.");
//     //     } else if (signInError.message?.includes("Email not confirmed")) {
//     //       setError(
//     //         "Please check your email and confirm your account before signing in."
//     //       );
//     //     } else if (signInError.message?.includes("Too many requests")) {
//     //       setError("Too many login attempts. Please try again later.");
//     //     } else {
//     //       setError(signInError.message || "An error occurred during sign in");
//     //     }
//     //     return;
//     //   }

//     //   if (authData.user) {
//     //     router.push(ROUTES.DASHBOARD.ROOT);
//     //   }
//     // } catch (error: any) {
//     //   if (error.message?.includes("timeout")) {
//     //     setError("Sign in is taking longer than expected. Please try again.");
//     //   } else {
//     //     setError(
//     //       error.message || "An error occurred during sign in. Please try again."
//     //     );
//     //   }
//     // } finally {
//     //   setIsManualLoading(false);
//     // }
//   };
