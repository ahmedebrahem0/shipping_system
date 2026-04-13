// login/page.tsx

import LoginForm from "@/features/auth/components/LoginForm";
import { Package, Truck, Users } from "lucide-react";

export default function LoginPage() {
  const features = [
    {
      icon: Package,
      title: "Order Management",
      desc: "Track and manage all orders",
    },
    {
      icon: Truck,
      title: "Delivery Tracking",
      desc: "Real-time delivery updates",
    },
    {
      icon: Users,
      title: "Multi-role Access",
      desc: "Admin, Employee, Merchant, Delivery",
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* 🔵 Left Side */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#1a1f36] to-[#2a3050] flex-col justify-center px-12 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute w-72 h-72 bg-primary/20 blur-3xl rounded-full top-10 left-10" />

        {/* Curved divider */}
        <div className="absolute top-0 right-0 h-full w-24 pointer-events-none z-0">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="h-full w-full"
          >
            <path
              d="M0,0 C85,0 15,100 100,100 L100,0 Z"
              fill="#f9fafb"
            />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/40">
                <Package className="w-6 h-6 text-white" />
              </div>

              <h1 className="text-3xl font-bold text-white">
                Shipping System
              </h1>
            </div>

            <p className="text-slate-300 text-sm max-w-sm leading-relaxed">
              Manage your orders, merchants, and deliveries all in one place
              with a modern and efficient system.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="flex items-center gap-4 opacity-0 animate-fadeIn"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="w-11 h-11 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>

                  <div>
                    <p className="text-white text-sm font-semibold">
                      {feature.title}
                    </p>
                    <p className="text-slate-400 text-xs">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ⚪ Right Side */}
      <div className="flex-1 lg:max-w-md flex items-center justify-center bg-gray-50 px-6">
        {/* Glass Card */}
        <div className="w-full max-w-sm bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-gray-100">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 text-sm mt-1">
              Sign in to your account
            </p>
          </div>

          <LoginForm />

          <p className="text-center text-sm text-gray-500 mt-6">
            Forgot your password?{" "}
            <a
              href="/forgot-password"
              className="text-primary font-semibold hover:underline"
            >
              Reset it here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}