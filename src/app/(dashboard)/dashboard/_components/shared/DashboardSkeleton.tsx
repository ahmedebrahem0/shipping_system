"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

interface DashboardSkeletonProps {
  variant?: "stats" | "chart" | "table";
  count?: number;
}

export function DashboardSkeleton({ variant = "stats", count = 4 }: DashboardSkeletonProps) {
  if (variant === "chart") {
    return (
      <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 animate-pulse">
        <div className="h-6 w-32 bg-slate-800 rounded-lg mb-2" />
        <div className="h-4 w-48 bg-slate-800/50 rounded-lg mb-8" />
        <div className="h-[350px] w-full bg-slate-800/30 rounded-xl" />
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="bg-slate-900/60 rounded-3xl border border-slate-800 overflow-hidden animate-pulse">
        <div className="p-6 border-b border-slate-800">
          <div className="h-6 w-32 bg-slate-800 rounded-lg" />
        </div>
        <div className="divide-y divide-slate-800">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-800 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-slate-800 rounded-lg" />
                <div className="h-3 w-24 bg-slate-800/50 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Stats variant
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6")}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 animate-pulse"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-slate-800 rounded-xl" />
            <div className="w-14 h-6 bg-slate-800 rounded-lg" />
          </div>
          <div className="space-y-2">
            <div className="h-8 w-20 bg-slate-800 rounded-lg" />
            <div className="h-4 w-24 bg-slate-800/50 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}