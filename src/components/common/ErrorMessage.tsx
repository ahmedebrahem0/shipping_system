// ErrorMessage.tsx
// Displays error message when API call fails

import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message?: string;
}

export default function ErrorMessage({
  message = "Something went wrong. Please try again.",
}: ErrorMessageProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
      <p className="text-sm text-red-600">{message}</p>
    </div>
  );
}