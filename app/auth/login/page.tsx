import { Metadata } from "next";
import { LoginForm } from "@/components/forms/login-form";

export const metadata: Metadata = {
  title: "Login - GradeX Admin",
  description: "Login to GradeX Admin Dashboard",
};

export default function LoginPage() {
  return <LoginForm />;
}
