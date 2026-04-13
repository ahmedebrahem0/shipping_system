// login/page.tsx
// Login page - displays the login form with branding

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
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-1 bg-[#1a1f36] flex-col justify-center px-12">
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 rotate-3">
              <Package className="w-6 h-6 text-white -rotate-3" />
            </div>

            <h1 className="text-3xl font-bold text-white">
              Shipping System
            </h1>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            Manage your orders, merchants, and deliveries all in one place.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-5">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div key={feature.title} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
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

      {/* Right Side - Form */}
      <div className="flex-1 lg:max-w-md flex flex-col justify-center px-8 bg-white">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Sign in to your account
          </p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-gray-500 mt-4">
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
  );
}