import { AuthForm } from "@/components/auth-form";

export default function SignInPage() {
  return <AuthForm mode="sign-in" googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)} />;
}
