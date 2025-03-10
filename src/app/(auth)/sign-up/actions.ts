"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function signUpWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.APP_URL}/api/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect(data.url);
}

export async function signUpWithEmail(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }
}

export async function verifyOtp(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const token = formData.get("token") as string;

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect("/dashboard");
}
