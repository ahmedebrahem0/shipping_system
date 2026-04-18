// Breadcrumbs.tsx
// Shows the current page path to help users navigate

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs() {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: `/${segment}`,
    }));

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-gray-500">
      <Link
        href="/dashboard"
        aria-label="Go to dashboard"
        className="hover:text-primary-500 transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>

      {segments.map((segment, index) => (
        <div key={segment.href} className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4" />
          {index === segments.length - 1 ? (
            <span className="text-gray-900 font-medium">{segment.label}</span>
          ) : (
            <Link
              href={segment.href}
              className="hover:text-primary-500 transition-colors"
            >
              {segment.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
