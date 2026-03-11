// login/page.tsx
// Login page - displays the login form with branding

import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">

      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-1 bg-[#1a1f36] flex-col justify-center px-12">
        <div className="mb-8">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white text-2xl mb-6">
            📦
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Shipping System
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Manage your orders, merchants, and deliveries all in one place.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4">
          {[
            { icon: "📦", title: "Order Management", desc: "Track and manage all orders" },
            { icon: "🚚", title: "Delivery Tracking", desc: "Real-time delivery updates" },
            { icon: "👥", title: "Multi-role Access", desc: "Admin, Employee, Merchant, Delivery" },
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

      {/* Right Side - Form */}
      <div className="flex-1 lg:max-w-md flex flex-col justify-center px-8 bg-white">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-gray-500 mt-4">
          Forgot your password?{" "}
          <a href="/forgot-password" className="text-orange-500 font-semibold hover:underline">
            Reset it here
          </a>
        </p>
      </div>

    </div>
  );
}