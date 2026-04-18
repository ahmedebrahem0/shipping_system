// Sidebar.tsx
// Main navigation sidebar - shows menu items based on user role

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  GitBranch,
  BarChart2,
  Settings,
  ChevronDown,
  MapPin,
  Weight,
  PackageOpen,
  UserCog,
  Shield,
  Plus,
  Wallet,
  Map,
  LogOut,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { ROUTES } from "@/constants/routes";
import { logout } from "@/store/slices/auth/authSlice";
import { closeSidebar } from "@/store/slices/ui/uiSlice";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";

type MenuItem = {
  label: string;
  icon: React.ElementType;
  href: string | null;
  children?: { label: string; icon: React.ElementType; href: string }[];
};

type MenuSection = {
  key: string;
  section?: string;
  items: MenuItem[];
};

// ==================== Admin Menu ====================
const adminMenu: MenuSection[] = [
  {
    key: "main",
    section: "Main",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: ROUTES.DASHBOARD },
      { label: "Setup Wizard", icon: PackageOpen, href: ROUTES.SETUP },
    ],
  },
  {
    key: "orders",
    section: "Orders",
    items: [
      {
        label: "Orders",
        icon: Package,
        href: null,
        children: [
          { label: "All Orders", icon: Package, href: ROUTES.ORDERS },
          // { label: "New Orders", icon: Package, href: `${ROUTES.ORDERS}?status=New` },
          // { label: "In Delivery", icon: Truck, href: `${ROUTES.ORDERS}?status=DeliveredToDelivery` },
          // { label: "Delivered", icon: Package, href: `${ROUTES.ORDERS}?status=Delivered` },
          // { label: "Rejected", icon: Package, href: `${ROUTES.ORDERS}?status=Rejected` },
          // { label: "Add Orders" ,icon: Package, href: `${}?status=Delivered` },
          { label: "Add Orders" ,icon: Package, href: `${ROUTES.ORDER_CREATE}` },
          
        ],
      },
    ],
  },
  {
    key: "management",
    section: "Management",
    items: [
      {
        label: "Merchants",
        icon: Users,
        href: null,
        children: [
          { label: "All Merchants", icon: Users, href: ROUTES.MERCHANTS },
          { label: "Add Merchant", icon: Plus, href: ROUTES.MERCHANT_CREATE },
        ],
      },
      {
        label: "Deliveries",
        icon: Truck,
        href: null,
        children: [
          { label: "All Drivers", icon: Truck, href: ROUTES.DELIVERIES },
          { label: "Add Driver", icon: Plus, href: ROUTES.DELIVERY_CREATE },
        ],
      },
      {
        label: "Employees",
        icon: UserCog,
        href: null,
        children: [
          { label: "All Employees", icon: UserCog, href: ROUTES.EMPLOYEES },
          { label: "Add Employee", icon: Plus, href: ROUTES.EMPLOYEE_CREATE },
        ],
      },
    ],
  },
  {
    key: "reports",
    section: "Reports",
    items: [
      {
        label: "Reports",
        icon: BarChart2,
        href: null,
        children: [
          { label: "Orders Report", icon: BarChart2, href: ROUTES.REPORTS },
          // { label: "Revenue Report", icon: Wallet, href: ROUTES.REPORTS },
          // { label: "Merchants Report", icon: Users, href: ROUTES.REPORTS },
          // { label: "Drivers Report", icon: Truck, href: ROUTES.REPORTS },
        ],
      },
    ],
  },
  {
    key: "settings",
    section: "Settings",
    items: [
      {
        label: "Settings",
        icon: Settings,
        href: null,
        children: [
          { label: "Setup Wizard", icon: PackageOpen, href: ROUTES.SETUP },
          { label: "Governments & Cities", icon: MapPin, href: ROUTES.GOVERNMENTS },
          { label: "Branches", icon: GitBranch, href: ROUTES.BRANCHES },
          { label: "Shipping Types", icon: PackageOpen, href: ROUTES.SHIPPING_TYPES },
          { label: "Weight Pricing", icon: Weight, href: ROUTES.PRICING },
          { label: "General Settings", icon: Settings, href: ROUTES.SETTINGS },
        ],
      },
      {
        label: "Permissions",
        icon: Shield,
        href: null,
        children: [
          { label: "Roles", icon: Shield, href: ROUTES.ROLES },
          { label: "Permissions", icon: Shield, href: ROUTES.PERMISSIONS },
        ],
      },
    ],
  },
];

// ==================== Employee Menu ====================
const employeeMenu: MenuSection[] = [
  {
    key: "main",
    section: "Main",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: ROUTES.DASHBOARD },
    ],
  },
  {
    key: "orders",
    section: "Orders",
    items: [
      {
        label: "Orders",
        icon: Package,
        href: null,
        children: [
          { label: "All Orders", icon: Package, href: ROUTES.ORDERS },
                    { label: "Add Orders" ,icon: Package, href: `${ROUTES.ORDER_CREATE}` },

        ],
      },
    ],
  },
  {
    key: "management",
    section: "Management",
    items: [
      {
        label: "Drivers",
        icon: Truck,
        href: null,
        children: [
          { label: "Available Drivers", icon: Truck, href: ROUTES.DELIVERIES },
          { label: "Busy Drivers", icon: Truck, href: ROUTES.DELIVERIES },
        ],
      },
      { label: "Merchants", icon: Users, href: ROUTES.MERCHANTS },
    ],
  },
  {
    key: "account",
    section: "Account",
    items: [
      { label: "Profile", icon: User, href: ROUTES.PROFILE },
    ],
  },
];

// ==================== Merchant Menu ====================
const merchantMenu: MenuSection[] = [
  {
    key: "main",
    section: "Main",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: ROUTES.DASHBOARD },
      // { label: "Create Order", icon: Plus, href: ROUTES.ORDER_CREATE },
    ],
  },
  {
    key: "orders",
    section: "Orders",
    items: [
      {
        label: "My Orders",
        icon: Package,
        href: null,
        children: [
          { label: "All Orders", icon: Package, href: ROUTES.ORDERS },
          { label: "Add Orders" ,icon: Package, href: `${ROUTES.ORDER_CREATE}` },
          // { label: "New Orders", icon: Package, href: `${ROUTES.ORDERS}?status=New` },
          // { label: "In Delivery", icon: Truck, href: `${ROUTES.ORDERS}?status=DeliveredToDelivery` },
          // { label: "Delivered", icon: Package, href: `${ROUTES.ORDERS}?status=Delivered` },
          // { label: "Rejected", icon: Package, href: `${ROUTES.ORDERS}?status=Rejected` },
        ],
      },
    ],
  },
  {
    key: "reports",
    section: "Reports",
    items: [
      {
        label: "Reports",
        icon: BarChart2,
        href: null,
        children: [
          { label: "Orders Report", icon: BarChart2, href: ROUTES.REPORTS },
          // { label: "Revenue Report", icon: Wallet, href: ROUTES.REPORTS },
          // { label: "Rejected Orders", icon: Package, href: ROUTES.REPORTS },
        ],
      },
    ],
  },
  {
    key: "account",
    section: "Account",
    items: [
      { label: "Profile", icon: User, href: ROUTES.PROFILE },
    ],
  },
];

// ==================== Delivery Menu ====================
const deliveryMenu: MenuSection[] = [
  {
    key: "main",
    section: "Main",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: ROUTES.DASHBOARD },
    ],
  },
  {
    key: "orders",
    section: "Orders",
    items: [
      {
        label: "My Orders",
        icon: Package,
        href: null,
        children: [
          { label: "All Orders", icon: Package, href: ROUTES.ORDERS },
        ],
      },
    ],
  },
  {
    key: "earnings",
    section: "Earnings",
    items: [
      {
        label: "Earnings",
        icon: Wallet,
        href: null,
        children: [
          { label: "Today's Earnings", icon: Wallet, href: `${ROUTES.EARNINGS}?period=today` },
          { label: "Weekly Earnings", icon: Wallet, href: `${ROUTES.EARNINGS}?period=week` },
          { label: "Monthly Earnings", icon: Wallet, href: `${ROUTES.EARNINGS}?period=month` },
        ],
      },
      { label: "Assigned Areas", icon: Map, href: `${ROUTES.EARNINGS}?section=areas` },
    ],
  },
  {
    key: "account",
    section: "Account",
    items: [
      { label: "Profile", icon: User, href: ROUTES.PROFILE },
    ],
  },
];

// const getMenu = (role: string) => {
//   switch (role) {
//     case ROLES.ADMIN: return adminMenu;
//     case ROLES.EMPLOYEE: return employeeMenu;
//     case ROLES.MERCHANT: return merchantMenu;
//     case ROLES.DELIVERY: return deliveryMenu;
//     default: return [];
//   }
// };
const getMenu = (role: string): MenuSection[] => {
  switch (role.toLowerCase()) {
    case "admin": return adminMenu;
    case "employee": return employeeMenu;
    case "merchant": return merchantMenu;
    case "delivery": return deliveryMenu;
    default: return [];
  }
};
export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const isSidebarOpen = useAppSelector((state) => state.ui.isSidebarOpen);

  if (!user) return null;

  const menu = getMenu(user.role);
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
    toast.success("Logged out successfully");toast.success("Logged out successfully", {
  description: "Your session has been securely terminated.",
  duration: 3000,
  style: {
    ...baseToastStyle,
    border: "1px solid rgba(16, 185, 129, 0.25)",
  },
});
  };

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-full text-slate-300 dark:text-slate-300 transition-all duration-300 z-40 flex flex-col border-r border-gray-200 dark:border-white/5 shadow-xl dark:shadow-2xl themed-surface",
        isSidebarOpen ? "w-72" : "w-0 overflow-hidden shadow-none border-none",
        "bg-white dark:bg-[#0F172A]"
      )}
    >
      {/* 1. Brand Logo */}
      <div className="flex items-center gap-4 px-7 py-9 flex-shrink-0">
        <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 transform">
          <Package className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-2xl text-slate-800 dark:text-white tracking-tight leading-none italic">SHIPPRO</span>
          <span className="mt-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-sky-700 dark:text-sky-400">Logistics System</span>
        </div>
      </div>

      {/* 2. User Profile Card */}
      <div className="px-5 mb-6">
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-4 shadow-inner dark:border-slate-700/80 dark:from-slate-800 dark:to-slate-900 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] flex items-center gap-3">
          <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="mb-1 truncate text-sm font-bold leading-tight text-slate-700 dark:text-slate-50">
              {user.name}
            </p>
            <div className="flex items-center gap-1.5">
               <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)] animate-pulse" />
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">{user.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Navigation - Custom Scrollbar with Primary Color */}
      <nav 
        className="flex-1 overflow-y-auto px-4 py-2 space-y-7 custom-sidebar-scroll"
        style={{ 
            scrollbarWidth: 'thin', 
            scrollbarColor: '#0ea5e9 transparent' // 👈 استبدل #0ea5e9 بلون الـ primary بتاعك لو مختلف
        }}
      >
        {/* CSS Style Inject for Webkit Browsers */}
        <style jsx global>{`
          .custom-sidebar-scroll::-webkit-scrollbar {
            width: 5px;
          }
          .custom-sidebar-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-sidebar-scroll::-webkit-scrollbar-thumb {
            background-color: #0ea5e9; /* لون الـ Primary */
            border-radius: 20px;
          }
          .custom-sidebar-scroll::-webkit-scrollbar-thumb:hover {
            background-color: #0284c7; /* لون أغمق عند الهوفر */
          }
        `}</style>

        {menu.map((section) => (
          <div key={section.key} className="space-y-2">
            <div className="flex items-center gap-3 px-3 mb-4">
               <span className="text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-[0.25em]">
                 {section.section}
               </span>
               <div className="h-[1px] flex-1 bg-gray-200 dark:bg-white/5" />
            </div>

            <div className="space-y-1.5">
              {section.items.map((item) =>
                item.children ? (
                  <DropdownItem key={item.label} item={item} pathname={pathname} />
                ) : (
                  <Link
                    key={item.label}
                    href={item.href!}
                    className={cn(
                      "group relative flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-[13px] font-bold transition-all duration-300",
                      pathname === item.href
                        ? "bg-sky-700 text-white shadow-xl shadow-sky-900/25 translate-x-1"
                        : "text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white hover:translate-x-1"
                    )}
                  >
                    <item.icon className={cn(
                      "w-5 h-5 transition-transform group-hover:scale-110",
                      pathname === item.href ? "text-white" : "text-slate-500 dark:text-slate-300 group-hover:text-primary"
                    )} />
                    {item.label}
                    {pathname === item.href && (
                      <span className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
                    )}
                  </Link>
                )
              )}
            </div>
          </div>
        ))}
      </nav>

      {/* 4. Logout Footer */}
      <div className="p-5 border-t border-gray-200 dark:border-white/5 mt-auto bg-gray-50 dark:bg-[#0F172A]/50 backdrop-blur-md">
        <button
          onClick={handleLogout}
          onKeyDown={(e) => e.key === "Enter" && handleLogout()}
          aria-label="Logout"
          className="flex items-center justify-center gap-3 w-full py-4 rounded-xl text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all border border-gray-200 dark:border-white/5 hover:border-red-200 dark:hover:border-red-500/20 uppercase tracking-widest"
        >
          <LogOut className="w-4 h-4" />
          Logout System
        </button>
      </div>
    </aside>
  );
}

interface DropdownItemProps {
  item: MenuItem;
  pathname: string;
}

function DropdownItem({ item, pathname }: DropdownItemProps) {
  const isActive = item.children?.some((child) => pathname.startsWith(child.href)) ?? false;

  return (
    <details open={isActive} className="group">
      <summary
        className={cn(
          "flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-[13px] font-bold cursor-pointer transition-all list-none",
          "text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/[0.02] hover:text-slate-900 dark:hover:text-white",
          isActive ? "bg-gray-100 dark:bg-white/5 text-slate-900 dark:text-white" : ""
        )}
      >
        <item.icon className={cn(
          "w-5 h-5 transition-colors",
          isActive ? "text-primary" : "text-slate-500 dark:text-slate-300 group-hover:text-primary"
        )} />
        <span className="flex-1 uppercase tracking-tight">{item.label}</span>
        <ChevronDown className="w-4 h-4 transition-transform duration-500 group-open:rotate-180 text-slate-500 dark:text-slate-300" />
      </summary>
      
      <div className="mt-2 ml-6 pl-4 border-l border-primary/20 dark:border-primary/20 space-y-1.5 py-1">
        {item.children?.map((child) => (
          <Link
            key={child.label}
            href={child.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-all relative group/item",
              pathname === child.href
                ? "bg-sky-100 text-sky-800 shadow-sm dark:bg-sky-900/60 dark:text-white"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-gray-50 dark:hover:bg-white/5"
            )}
          >
            {pathname === child.href && (
              <span className="absolute left-[-18px] w-1.5 h-5 bg-primary rounded-r-full shadow-[2px_0_10px_rgba(14,165,233,0.4)]" />
            )}
            <child.icon className={cn(
                "w-4 h-4",
                pathname === child.href ? "text-primary" : "text-slate-500 dark:text-slate-300 group-hover/item:text-primary/70"
            )} />
            {child.label}
          </Link>
        ))}
      </div>
    </details>
  );
}
