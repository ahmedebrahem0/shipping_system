// ConfirmDialog.tsx
// Confirmation dialog used before delete or any destructive action

"use client";

import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">

        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>

        {/* Content */}
        <h3 className="text-base font-bold text-gray-900 text-center">{title}</h3>
        <p className="text-sm text-gray-500 text-center mt-1">{description}</p>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Deleting..." : confirmLabel}
          </button>
        </div>

      </div>
    </div>
  );
}