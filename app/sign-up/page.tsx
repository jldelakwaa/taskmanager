import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Create account | Coliconstruct",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <AuthForm
      key="sign-up"
      mode="sign-up"
      googleEnabled={Boolean(
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
      )}
    />
  );
}
