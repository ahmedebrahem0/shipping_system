"use client";

import { UseFormSetValue } from "react-hook-form";
import { Shield, User, ShoppingBag, Truck } from "lucide-react";
import { LoginFormValues } from "@/features/auth/schema/login.schema";
import { useState } from "react"; // ✅ 1. ضفنا useState

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
  // ✅ 2. state لتحديد الزرار المختار
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // ✅ 3. عدّلنا الفانكشن عشان تخزن الـ role
  const handleSelect = (role: string, email: string, password: string) => {
    setSelectedRole(role);
    setValue("email", email);
    setValue("password", password);
  };

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 text-center">Quick login</p>

      <div className="grid grid-cols-2 gap-2">
        {DEMO_ROLES.map((role) => {
          // ✅ 4. نعرف هل الزرار ده هو المختار
          const isActive = selectedRole === role.label;
          const Icon = role.icon;

          return (
            <button
              key={role.label}
              type="button"
              onClick={() =>
                handleSelect(role.label, role.email, role.password)
              }
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all
                ${
                  isActive
                    ? "bg-primary text-white border-primary shadow-md"
                    : "border-gray-200 text-gray-600 hover:border-primary hover:bg-primary/10"
                }
              `}
            >
              {/* ✅ 5. الأيقونة بتتغير حسب الحالة */}
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : ""}`} />

              <span className="font-medium">{role.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}