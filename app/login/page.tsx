import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">GradeX Admin</h1>
          <p className="text-muted-foreground">Sign in to manage your educational platform</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
