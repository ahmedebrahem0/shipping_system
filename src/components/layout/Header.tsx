// Header.tsx
// Top navigation bar - shows page title, sidebar toggle and logout button

"use client";

import { Menu, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar } from "@/store/slices/ui/uiSlice";
import { logout } from "@/store/slices/auth/authSlice";
import { ROUTES } from "@/constants/routes";

export default function Header() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove("token");
    router.push(ROUTES.LOGIN);
    toast.success("Logged out successfully");
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-30">

      {/* Left - Sidebar Toggle */}
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      {/* Right - User Info + Logout */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 hover:bg-gray-100   transition-colors rounded-xl bg-[#efefef]">
          <button
          onClick={() => router.push(ROUTES.PROFILE)}
          className="flex items-center gap-2 hover:bg-gray-100  px-2 py-1 transition-colors rounded-xl g-[#efefef]"
        >
          <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-700">{user?.name}</span>
        </button>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 bg-red-100 rounded transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

    </header>
  );
}