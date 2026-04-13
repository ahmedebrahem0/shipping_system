import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";
import { Package, Truck, Users } from "lucide-react";

export default function ForgotPasswordPage() {
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
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#1a1f36] to-[#2a3050] flex-col justify-center px-12">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/40 ">
                          <Package className="w-6 h-6 text-white " />
                        </div>
          
                        <h1 className="text-3xl font-bold text-white">
                          Shipping System
                        </h1>
                        </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Manage your orders, merchants, and deliveries all in one place.
          </p>
        </div>
        <div className="space-y-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="flex items-center gap-4 opacity-0 animate-fadeIn"
                style={{ animationDelay: `${i * 0.2}s`, animationFillMode: "forwards" }}
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

      <div className="flex-1 lg:max-w-md flex flex-col justify-center px-8 bg-white">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
