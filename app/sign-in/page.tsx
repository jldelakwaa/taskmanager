import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Sign In | Coliconstruct",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <AuthForm
      key="sign-in"
      mode="sign-in"
      googleEnabled={Boolean(
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
      )}
    />
  );
}
