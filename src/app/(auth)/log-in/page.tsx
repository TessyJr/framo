"use client";

import { useState } from "react";
import { logInWithEmail, logInWithGoogle, verifyOtp } from "./actions";
import Link from "next/link";

export default function LogInPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [email, setEmail] = useState("");

  async function handleLogIn(formData: FormData) {
    setEmail(formData.get("email") as string);
    setIsVerifying(true);
    await logInWithEmail(formData);
  }

  async function handleLogInWithGoogle() {
    await logInWithGoogle();
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <h1>Log In</h1>
      {!isVerifying ? (
        // LogIn Form
        <div className="flex flex-col">
          <form className="flex flex-col" action={handleLogIn}>
            <label htmlFor="email">Email:</label>
            <input id="email" name="email" type="email" required />
            <button type="submit">Send OTP</button>
          </form>

          <form action={handleLogInWithGoogle}>
            <button className="" type="submit">
              Continue With Google
            </button>
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

      <Link href="/sign-up">Sign up</Link>
    </div>
  );
}
