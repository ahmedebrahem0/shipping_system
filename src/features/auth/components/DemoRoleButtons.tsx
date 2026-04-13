// DemoRoleButtons.tsx
// Quick login buttons for demo purposes - fills in credentials automatically

"use client";

import { UseFormSetValue } from "react-hook-form";
import { Shield, User, ShoppingBag, Truck } from "lucide-react";
import { LoginFormValues } from "@/features/auth/schema/login.schema";

const DEMO_ROLES = [
  { label: "Admin", icon: Shield, email: "admin26@gmail.com", password: "Admin010;" },
  { label: "Employee", icon: User, email: "newemploye@gmail.com", password: "Ahmed@123" },
  { label: "Merchant", icon: ShoppingBag, email: "merchant@gmail.com", password: "Ahmed@123" },
  { label: "Delivery", icon: Truck, email: "delivery@gmail.com", password: "Ahmed@123" },
];

interface DemoRoleButtonsProps {
  setValue: UseFormSetValue<LoginFormValues>;
}

export default function DemoRoleButtons({ setValue }: DemoRoleButtonsProps) {
const handleSelect = (email: string, password: string) => {
  setValue("email", email);
  setValue("password", password);
};

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 text-center">Quick login</p>
      <div className="grid grid-cols-2 gap-2">
        {DEMO_ROLES.map((role) => (
          <button
            key={role.label}
            type="button"
            onClick={() => handleSelect(role.email, role.password)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:border-primary hover:bg-primary  transition-all"
          >
            <role.icon className="w-4 h-4 " />
            <span className="text-gray-600 font-medium ">{role.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}