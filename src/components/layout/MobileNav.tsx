// MobileNav.tsx
// Mobile navigation drawer - shows sidebar as a slide-in menu on small screens

"use client";

import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeSidebar } from "@/store/slices/ui/uiSlice";
import Sidebar from "@/components/layout/Sidebar";

export default function MobileNav() {
  const dispatch = useAppDispatch();
  const isSidebarOpen = useAppSelector((state) => state.ui.isSidebarOpen);

  if (!isSidebarOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        onClick={() => dispatch(closeSidebar())}
      />

      {/* Drawer */}
      <div className="fixed top-0 left-0 h-full z-40 lg:hidden">
        <div className="relative">
          <button
            onClick={() => dispatch(closeSidebar())}
            className="absolute top-4 right-[-40px] p-2 bg-white rounded-full shadow"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
          <Sidebar />
        </div>
      </div>
    </>
  );
}