import VerifyOTPForm from "@/features/auth/components/VerifyOTPForm";

export default function VerifyOTPPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 bg-[#1a1f36] flex-col justify-center px-12">
        <div className="mb-8">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white text-2xl mb-6">
            📦
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Shipping System</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Secure password reset with OTP verification.
          </p>
        </div>
        <div className="space-y-4">
          {[
            { icon: "🔐", title: "Secure Verification", desc: "OTP sent to your email" },
            { icon: "⏱️", title: "Quick Process", desc: "Reset password in seconds" },
            { icon: "📧", title: "Email Notification", desc: "Check your inbox for the code" },
          ].map((feature) => (
            <div key={feature.title} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-lg">
                {feature.icon}
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{feature.title}</p>
                <p className="text-slate-400 text-xs">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 lg:max-w-md flex flex-col justify-center px-8 bg-white">
        <VerifyOTPForm />
      </div>
    </div>
  );
}
