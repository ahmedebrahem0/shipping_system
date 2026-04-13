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
  Building2,
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
import { ROLES } from "@/constants/roles";
import { logout } from "@/store/slices/auth/authSlice";
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
          { label: "Revenue Report", icon: Wallet, href: ROUTES.REPORTS },
          { label: "Merchants Report", icon: Users, href: ROUTES.REPORTS },
          { label: "Drivers Report", icon: Truck, href: ROUTES.REPORTS },
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
          { label: "New Orders", icon: Package, href: `${ROUTES.ORDERS}?status=New` },
          { label: "In Distribution", icon: Package, href: `${ROUTES.ORDERS}?status=DeliveredToAgent` },
          { label: "In Delivery", icon: Truck, href: `${ROUTES.ORDERS}?status=DeliveredToDelivery` },

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
      { label: "Create Order", icon: Plus, href: ROUTES.ORDER_CREATE },
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
          { label: "New Orders", icon: Package, href: `${ROUTES.ORDERS}?status=New` },
          { label: "In Delivery", icon: Truck, href: `${ROUTES.ORDERS}?status=DeliveredToDelivery` },
          { label: "Delivered", icon: Package, href: `${ROUTES.ORDERS}?status=Delivered` },
          { label: "Rejected", icon: Package, href: `${ROUTES.ORDERS}?status=Rejected` },
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
          { label: "Revenue Report", icon: Wallet, href: ROUTES.REPORTS },
          { label: "Rejected Orders", icon: Package, href: ROUTES.REPORTS },
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
          { label: "Pending", icon: Package, href: `${ROUTES.ORDERS}?status=Pending` },
          { label: "In Delivery", icon: Truck, href: `${ROUTES.ORDERS}?status=DeliveredToDelivery` },
          { label: "Delivered Today", icon: Package, href: `${ROUTES.ORDERS}?status=Delivered` },
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
          { label: "Today's Earnings", icon: Wallet, href: "/earnings/today" },
          { label: "Weekly Earnings", icon: Wallet, href: "/earnings/weekly" },
          { label: "Monthly Earnings", icon: Wallet, href: "/earnings/monthly" },
        ],
      },
      { label: "Assigned Areas", icon: Map, href: "/assigned-areas" },
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

  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove("token");
    router.push(ROUTES.LOGIN);
    toast.success("Logged out successfully");
  };

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-full bg-[#0F172A] text-slate-300 transition-all duration-300 z-40 flex flex-col border-r border-white/5 shadow-2xl",
        isSidebarOpen ? "w-72" : "w-0 overflow-hidden shadow-none border-none" 
      )}
    >
      {/* 1. Brand Logo */}
      <div className="flex items-center gap-4 px-7 py-9 flex-shrink-0">
        <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 transform rotate-3">
          <Package className="w-6 h-6 text-white -rotate-3" />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-2xl text-white tracking-tight leading-none italic">SHIPPRO</span>
          <span className="text-[10px] font-black text-primary tracking-[0.3em] mt-1.5 uppercase opacity-90">Logistics System</span>
        </div>
      </div>

      {/* 2. User Profile Card */}
      <div className="px-5 mb-6">
        <div className="bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 rounded-2xl p-4 flex items-center gap-3 shadow-inner">
          <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate leading-tight mb-1">{user.name}</p>
            <div className="flex items-center gap-1.5">
               <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)] animate-pulse" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.role}</p>
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
               <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em]">
                 {section.section}
               </span>
               <div className="h-[1px] flex-1 bg-white/5" />
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
                        ? "bg-primary text-white shadow-xl shadow-primary/25 translate-x-1"
                        : "text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1"
                    )}
                  >
                    <item.icon className={cn(
                      "w-5 h-5 transition-transform group-hover:scale-110",
                      pathname === item.href ? "text-white" : "text-slate-500 group-hover:text-primary"
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
      <div className="p-5 border-t border-white/5 mt-auto bg-[#0F172A]/50 backdrop-blur-md">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 w-full py-4 rounded-xl text-xs font-black text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all border border-white/5 hover:border-red-500/20 uppercase tracking-widest"
        >
          <LogOut className="w-4 h-4" />
          Logout System
        </button>
      </div>
    </aside>
  );
}

function DropdownItem({ item, pathname }: { item: any, pathname: string }) {
  const isActive = item.children?.some((child: any) => pathname.startsWith(child.href));

  return (
    <details open={isActive} className="group">
      <summary
        className={cn(
          "flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-[13px] font-bold cursor-pointer transition-all list-none group-hover:bg-white/[0.02]",
          isActive
            ? "bg-white/5 text-white"
            : "text-slate-400 hover:text-white"
        )}
      >
        <item.icon className={cn(
          "w-5 h-5 transition-colors",
          isActive ? "text-primary" : "text-slate-500 group-hover:text-primary"
        )} />
        <span className="flex-1 uppercase tracking-tight">{item.label}</span>
        <ChevronDown className="w-4 h-4 transition-transform duration-500 group-open:rotate-180 text-slate-600" />
      </summary>
      
      <div className="mt-2 ml-6 pl-4 border-l-1 border-primary/20 space-y-1.5 py-1 animate-in slide-in-from-left-2 duration-300">
        {item.children?.map((child: any) => (
          <Link
            key={child.label}
            href={child.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-all relative group/item",
              pathname === child.href
                ? "text-primary bg-primary/10 shadow-sm"
                : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
            )}
          >
            {pathname === child.href && (
              <span className="absolute left-[-18px] w-1.5 h-5 bg-primary rounded-r-full shadow-[2px_0_10px_rgba(14,165,233,0.4)]" />
            )}
            <child.icon className={cn(
                "w-4 h-4",
                pathname === child.href ? "text-primary" : "text-slate-600 group-hover/item:text-primary/70"
            )} />
            {child.label}
          </Link>
        ))}
      </div>
    </details>
  );
}