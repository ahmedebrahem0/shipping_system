"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useAppSelector } from "@/store/hooks";
import { ROUTES } from "@/constants/routes";
import { Plus } from "lucide-react";
import Link from "next/link";

const MerchantDashboard = dynamic(
  () => import("./_components/merchant/MerchantDashboard").then((mod) => mod.MerchantDashboard),
  { loading: () => <div className="animate-pulse h-96 bg-slate-100 rounded-2xl" /> }
);

const DeliveryDashboard = dynamic(
  () => import("./_components/delivery/DeliveryDashboard").then((mod) => mod.DeliveryDashboard),
  { loading: () => <div className="animate-pulse h-96 bg-slate-100 rounded-2xl" /> }
);

const AdminDashboard = dynamic(
  () => import("./_components/admin/AdminDashboard").then((mod) => mod.AdminDashboard),
  { loading: () => <div className="animate-pulse h-96 bg-slate-100 rounded-2xl" /> }
);

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-black text-slate-900  tracking-tight">
        {title} <span className="text-sky-400 text-4xl">.</span>
      </h1>
      <p className="text-slate-400 font-medium">{subtitle}</p>
    </div>
  );
}

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) return null;

  const firstName = user.name.split(" ")[0] || "User";
  const greeting = getGreeting();
  const normalizedRole = user.role.toLowerCase();

  const renderView = () => {
    switch (normalizedRole) {
      case "admin":
      case "employee":
        return <AdminDashboard />;
      case "merchant":
        return <MerchantDashboard />;
      case "delivery":
        return <DeliveryDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="themed-surface max-w-[1600px] mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <SectionHeader
          title={`Good ${greeting}, ${firstName}!`}
          subtitle="System overview and logistics real-time analytics."
        />
        <div className="flex items-center gap-3">
          <Link href={ROUTES.ORDER_CREATE} className="flex items-center gap-2 bg-sky-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-sky-500/20 hover:bg-sky-600 transition-all active:scale-95">
            <Plus className="w-5 h-5" /> New Shipment
          </Link>
        </div>
      </div>

      {renderView()}
    </div>
  );
}
