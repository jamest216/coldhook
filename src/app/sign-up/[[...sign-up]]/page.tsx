import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#010102]">
      <SignUp forceRedirectUrl="/dashboard" />
    </div>
  )
}
