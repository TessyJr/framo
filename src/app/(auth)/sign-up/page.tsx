"use client";

import { useState } from "react";
import { signUpWithEmail, signUpWithGoogle, verifyOtp } from "./actions";
import Link from "next/link";

export default function SignUpPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [email, setEmail] = useState("");

  async function handleSignUpWithEmail(formData: FormData) {
    setEmail(formData.get("email") as string);
    setIsVerifying(true);
    await signUpWithEmail(formData);
  }

  async function handleSignUpWithGoogle() {
    await signUpWithGoogle();
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <h1>Sign Up</h1>
      {!isVerifying ? (
        // signUp Form
        <div className="flex flex-col">
          <form className="flex flex-col" action={handleSignUpWithEmail}>
            <label htmlFor="email">Email:</label>
            <input id="email" name="email" type="email" required />
            <button type="submit">Send OTP</button>
          </form>

          <form action={handleSignUpWithGoogle}>
            <button type="submit">Continue With Google</button>
          </form>
        </div>
      ) : (
        // Verification Form
        <form className="flex flex-col" action={verifyOtp}>
          <input type="hidden" name="email" value={email} />
          <label htmlFor="token">Token:</label>
          <input id="token" name="token" required />
          <button type="submit">Verify OTP</button>
        </form>
      )}

      <Link href="/log-in">Log in</Link>
    </div>
  );
}
