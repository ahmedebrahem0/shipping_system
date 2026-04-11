// AssignDeliveryModal.tsx
// Modal to assign a delivery agent to an order

"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useGetDeliveriesQuery } from "@/store/slices/api/apiSlice";

interface AssignDeliveryModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onAssign: (deliveryId: number) => void;
  onClose: () => void;
}

export default function AssignDeliveryModal({
  isOpen,
  isLoading,
  onAssign,
  onClose,
}: AssignDeliveryModalProps) {
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<number | null>(null);
  const { data: deliveries } = useGetDeliveriesQuery();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Assign Delivery Agent</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Delivery List */}
        <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
          {deliveries?.map((delivery) => (
            <button
              key={delivery.id}
              onClick={() => setSelectedDeliveryId(delivery.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                selectedDeliveryId === delivery.id
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {delivery.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{delivery.name}</p>
                <p className="text-xs text-gray-500">{delivery.branchName}</p>
              </div>
            </button>
          ))}
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
            onClick={() => selectedDeliveryId && onAssign(selectedDeliveryId)}
            disabled={!selectedDeliveryId || isLoading}
            className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Assigning..." : "Assign"}
          </button>
        </div>

      </div>
    </div>
  );
}