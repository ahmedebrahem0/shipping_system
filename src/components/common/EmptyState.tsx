// EmptyState.tsx
// Displays a message when there is no data to show

import { PackageOpen } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "No data found",
  description = "There is nothing to display here yet.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <PackageOpen className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-700">{title}</h3>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </div>
  );
}