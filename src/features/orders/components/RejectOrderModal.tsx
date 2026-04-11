// RejectOrderModal.tsx
// Modal to change order status with optional note

"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/constants/orderStatuses";
import { useAppSelector } from "@/store/hooks";
import { ROLES } from "@/constants/roles";

interface ChangeStatusModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onChangeStatus: (newStatus: string, note?: string) => void;
  onClose: () => void;
}

export default function RejectOrderModal({
  isOpen,
  isLoading,
  onChangeStatus,
  onClose,
}: ChangeStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [note, setNote] = useState("");
  const user = useAppSelector((state) => state.auth.user);

  if (!isOpen) return null;

  // ==================== Status options based on role ====================
  const getStatusOptions = () => {
    const role = user?.role?.toLowerCase();

    if (role === ROLES.ADMIN.toLowerCase() || role === ROLES.EMPLOYEE.toLowerCase()) {
      return [
        ORDER_STATUSES.PENDING,
        ORDER_STATUSES.DELIVERED_TO_AGENT,
        ORDER_STATUSES.DELIVERED,
        ORDER_STATUSES.CANCELED_BY_RECIPIENT,
        ORDER_STATUSES.PARTIALLY_DELIVERED,
        ORDER_STATUSES.POSTPONED,
        ORDER_STATUSES.CANNOT_BE_REACHED,
        ORDER_STATUSES.REJECTED_AND_NOT_PAID,
        ORDER_STATUSES.REJECTED_WITH_PARTIAL_PAYMENT,
        ORDER_STATUSES.REJECTED_WITH_PAYMENT,
      ];
    }

    if (role === ROLES.DELIVERY.toLowerCase()) {
      return [
        ORDER_STATUSES.DELIVERED,
        ORDER_STATUSES.CANCELED_BY_RECIPIENT,
        ORDER_STATUSES.PARTIALLY_DELIVERED,
        ORDER_STATUSES.POSTPONED,
        ORDER_STATUSES.CANNOT_BE_REACHED,
      ];
    }

    return [];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Change Order Status</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Status Options */}
        <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
          {getStatusOptions().map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${
                selectedStatus === status
                  ? "border-primary-500 bg-primary-50 text-primary-700 font-medium"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"
              }`}
            >
              {ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS]}
            </button>
          ))}
        </div>

        {/* Note */}
        <div className="space-y-1 mb-4">
          <label className="text-sm font-medium text-gray-700">
            Note <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => selectedStatus && onChangeStatus(selectedStatus, note)}
            disabled={!selectedStatus || isLoading}
            className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Saving..." : "Confirm"}
          </button>
        </div>

      </div>
    </div>
  );
}