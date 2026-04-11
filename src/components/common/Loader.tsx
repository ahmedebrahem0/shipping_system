// Loader.tsx
// Loading spinner component used while data is being fetched

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  fullPage?: boolean;
}

export default function Loader({ size = "md", fullPage = false }: LoaderProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10",
  };

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
        <Loader2 className={cn("animate-spin text-primary-500", sizes[size])} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-10">
      <Loader2 className={cn("animate-spin text-primary-500", sizes[size])} />
    </div>
  );
}