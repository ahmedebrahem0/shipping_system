// (dashboard)/layout.tsx
// Layout for dashboard pages - includes sidebar, header and breadcrumbs

"use client";

import { useAppSelector } from "@/store/hooks";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import MobileNav from "@/components/layout/MobileNav";
import { cn } from "@/lib/utils/cn";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSidebarOpen = useAppSelector((state) => state.ui.isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sidebar - desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Sidebar - mobile */}
      <MobileNav />

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300 lg:pl-60",
          !isSidebarOpen && "lg:pl-0"
        )}
      >
        {/* Header */}
        <Header />

        {/* Breadcrumbs */}
        <div className="px-4 md:px-6 py-3 bg-white border-b border-gray-200">
          <Breadcrumbs />
        </div>

        {/* Page Content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>

    </div>
  );
}