import AuthHeader from "@/components/feature/auth/auth-header";
import LoginForm from "./_components/login-form";

export default function LoginPage() {
  return (
    <section className="w-full max-w-md">
      {/* header */}
      <AuthHeader
        title="Welcome back"
        description="Sign in to your pharmacy account"
      />
      {/* form */}
      <LoginForm />
    </section>
  );
}
