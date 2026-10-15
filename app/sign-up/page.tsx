import { AuthForm } from "@/components/auth-form";

export default function SignUpPage() {
  return <AuthForm mode="sign-up" googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)} />;
}
