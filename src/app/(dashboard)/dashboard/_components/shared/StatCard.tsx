"use client";

import React from "react";
import { LucideIcon, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: "sky" | "emerald" | "amber" | "rose";
  trend?: number;
  href?: string;
}

const colorThemes = {
  sky: "from-blue-600 via-sky-500 to-cyan-400 shadow-[0_18px_40px_rgba(37,99,235,0.30)]",
  emerald:
    "from-emerald-600 via-teal-500 to-cyan-400 shadow-[0_18px_40px_rgba(5,150,105,0.30)]",
  amber:
    "from-orange-500 via-amber-500 to-yellow-400 shadow-[0_18px_40px_rgba(217,119,6,0.30)]",
  rose: "from-rose-600 via-pink-500 to-fuchsia-500 shadow-[0_18px_40px_rgba(225,29,72,0.30)]",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  color,
  trend,
  href,
}: StatCardProps) {
  const content = (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[2rem] bg-gradient-to-br p-6 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.015]",
        colorThemes[color]
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_30%)]" />
      <div className="absolute -right-8 -bottom-8 h-28 w-28 rounded-full bg-white/10 blur-2xl transition-all duration-500 group-hover:scale-125" />
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="relative z-10">
        <div className="mb-8 flex items-start justify-between">
          <div className="rounded-2xl border border-white/25 bg-white/20 p-4 backdrop-blur-md shadow-inner">
            <Icon className="h-8 w-8 text-white" />
          </div>

          <div className="flex items-center gap-2">
            {typeof trend === "number" && (
              <span className="rounded-full border border-white/20 bg-white/20 px-3 py-1 text-[10px] font-black tracking-widest text-white">
                +{trend}%
              </span>
            )}
            {href && (
              <span className="rounded-full border border-white/20 bg-white/15 p-2 text-white/90">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-4xl font-black tracking-tighter text-white drop-shadow-md">
            {value}
          </p>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/80">
            {label}
          </p>
        </div>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}
