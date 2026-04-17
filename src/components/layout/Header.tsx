// Header.tsx
// Top navigation bar - shows page title, sidebar toggle and logout button

"use client";

import { Menu, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeSidebar, toggleSidebar } from "@/store/slices/ui/uiSlice";
import { logout } from "@/store/slices/auth/authSlice";
import { ROUTES } from "@/constants/routes";
import { ThemeToggle } from "@/components/common/ThemeToggle";

export default function Header() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
const baseToastStyle = {
  borderRadius: "18px",
  padding: "16px 18px",
  background: "rgba(255,255,255,0.92)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: "1px solid rgba(226, 232, 240, 0.9)",
  boxShadow: "0 20px 60px rgba(15, 23, 42, 0.18)",
  minWidth: "320px",
  maxWidth: "420px",
  width: "100%",
  };
  const handleLogout = () => {
    dispatch(closeSidebar());
    dispatch(logout());
    Cookies.remove("token");
    router.push(ROUTES.LOGIN);
    toast.success("Logged out successfully", {
  description: "Your session has been securely terminated.",
  duration: 3000,
  style: {
    ...baseToastStyle,
    border: "1px solid rgba(16, 185, 129, 0.25)",
  },
});
  };

  return (
    <header className="h-14 bg-white/80 dark:bg-slate-950/50 backdrop-blur-md border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-4 sticky top-0 z-30 transition-all">

      {/* Left - Sidebar Toggle */}
      <button
  onClick={() => dispatch(toggleSidebar())}
  aria-label="Toggle sidebar"
  className="p-2 rounded-lg transition-colors bg-primary"
>
  <Menu className="w-5 h-5 text-white" />
</button>

      {/* Right - Theme Toggle + User Info + Logout */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        
        <button
          onClick={() => router.push(ROUTES.PROFILE)}
          aria-label="Go to profile"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
        >
          <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-slate-200">{user?.name}</span>
        </button>

       <button
  onClick={handleLogout}
  aria-label="Logout"
  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950 bg-red-50 dark:bg-red-950/50 rounded-lg transition-all"
>
  <LogOut className="w-4 h-4" />
</button>
      </div>

    </header>
  );
}
