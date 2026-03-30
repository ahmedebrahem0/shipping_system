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
  section: string;
  items: MenuItem[];
};

// ==================== Admin Menu ====================
const adminMenu: MenuSection[] = [
  {
    key: "main",
    // section: "Main",
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
          { label: "In Delivery", icon: Truck, href: `${ROUTES.ORDERS}?status=DeliveredToDelivery` },
          { label: "Delivered", icon: Package, href: `${ROUTES.ORDERS}?status=Delivered` },
          { label: "Rejected", icon: Package, href: `${ROUTES.ORDERS}?status=Rejected` },
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
        "fixed top-0 left-0 h-full bg-[#1a1f36] text-white transition-all duration-300 z-40 flex flex-col",
        isSidebarOpen ? "w-60" : "w-0 overflow-hidden"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10 flex-shrink-0">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Package className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-lg">ShipPro</span>
      </div>

      {/* User Info */}
      <div className="px-5 py-4 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-xs text-orange-400">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4 [scrollbar-width:thin] [scrollbar-color:#ff6b00_transparent] 
                [&::-webkit-scrollbar]:w-1.5 
                [&::-webkit-scrollbar-thumb]:bg-[#ff6b00] 
                [&::-webkit-scrollbar-thumb]:rounded-full">
        {menu.map((section) => (
          <div key={section.key}>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
              {section.section}
            </p>
            <div className="space-y-1 ">
              {section.items.map((item) =>
                item.children ? (
                  <DropdownItem
                    key={item.label}
                    item={item}
                    pathname={pathname}
                  />
                ) : (
                  <Link
                    key={item.label}
                    href={item.href!}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all rounded-xl",
                      pathname === item.href
                        ? "bg-orange-500 text-white"
                        : "text-slate-400 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {item.label}
                  </Link>
                )
              )}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout
      <div className="px-3 py-4 border-t border-white/10 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all w-full"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Logout
        </button>
      </div> */}
    </aside>
  );
}

function DropdownItem({
  item,
  pathname,
}: {
  item: { label: string; icon: React.ElementType; children?: { label: string; icon: React.ElementType; href: string }[] };
  pathname: string;
}) {
  const isActive = item.children?.some((child) => pathname.startsWith(child.href));

  return (
    <details open={isActive} className="group">
      <summary
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all list-none rounded-xl",
          isActive
            ? "bg-white/10 text-white"
            : "text-slate-400 hover:bg-white/10 hover:text-white"
        )}
      >
        <item.icon className="w-4 h-4 flex-shrink-0 " />
        <span className="flex-1 ">{item.label}</span>
        <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180 rounded-xl" />
      </summary>
      <div className="mt-1 ml-4 space-y-1 ">
        {item.children?.map((child) => (
          <Link
            key={child.label}
            href={child.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all rounded-xl",
              pathname === child.href
                ? "bg-orange-500 text-white"
                : "text-slate-400 hover:bg-white/10 hover:text-white"
            )}
          >
            <child.icon className="w-4 h-4 flex-shrink-0" />
            {child.label}
          </Link>
        ))}
      </div>
    </details>
  );
}