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
  const user = useAppSelector((state) => state.auth.user);
  const shouldShowDesktopSidebar = isSidebarOpen && Boolean(user);

  return (
    // 1. أضفت overflow-x-hidden هنا كخط دفاع أول للموقع كله
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden relative">

      {/* Sidebar - Desktop (fixed, w-72 when open) */}
      <div
        className={cn(
          "hidden lg:block fixed top-0 left-0 h-screen z-40 transition-all duration-300 ease-in-out bg-[#0F172A]",
          shouldShowDesktopSidebar ? "w-72" : "w-0 overflow-hidden"
        )}
      >
        <Sidebar />
      </div>

      {/* Sidebar - Mobile (overlay) */}
      <MobileNav />

      {/* Main Content Wrapper */}
      <div
        className={cn(
          // 2. أهم تعديل: min-w-0 تمنع الـ Flexbox من التمدد خارج حدود الأب
          // 3. overflow-x-hidden تضمن عدم وجود سكرول يمين/شمال نهائياً
          "flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden transition-all duration-300 ease-in-out relative",
          shouldShowDesktopSidebar ? "lg:pl-72" : "lg:pl-0"
        )}
      >
        {/* Header */}
        <Header />

        {/* Breadcrumbs */}
        <div className="px-4 md:px-8 py-4 bg-white border-b border-gray-200 shadow-sm sticky top-16 z-10 w-full overflow-hidden">
          <Breadcrumbs />
        </div>

        {/* Page Content */}
        <main className="themed-surface flex-1 p-4 md:p-6 lg:p-8 w-full max-w-full overflow-x-hidden">
          {/* الـ container ده بيضمن إن الـ children ميهربوش برا المساحة المحددة */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 px-8 text-center text-xs text-gray-600 font-medium border-t border-gray-100 bg-white/50">
          &copy; {new Date().getFullYear()} SHIPPRO Logistics System. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
