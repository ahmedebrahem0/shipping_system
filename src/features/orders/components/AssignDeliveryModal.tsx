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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/10 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.22)]">
        {/* Header */}
        <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-gray-900">
                Assign Delivery Agent
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Select a delivery agent to assign this order
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 transition-all hover:bg-gray-100"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Delivery List */}
        <div className="max-h-72 space-y-3 overflow-y-auto px-6 py-5">
          {deliveries?.map((delivery) => (
            <button
              key={delivery.id}
              onClick={() => setSelectedDeliveryId(delivery.id)}
              className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
                selectedDeliveryId === delivery.id
                  ? "border-primary-500 bg-primary-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-black text-white ${
                    selectedDeliveryId === delivery.id ? "bg-primary" : "bg-gray-400"
                  }`}
                >
                  {delivery.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-gray-900">
                    {delivery.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {delivery.branchName}
                  </p>
                </div>

                <div
                  className={`h-3 w-3 rounded-full border transition-all ${
                    selectedDeliveryId === delivery.id
                      ? "border-primary bg-primary"
                      : "border-gray-300 bg-white"
                  }`}
                />
              </div>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-gray-100 bg-gray-50/60 px-6 py-5">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => selectedDeliveryId && onAssign(selectedDeliveryId)}
            disabled={!selectedDeliveryId || isLoading}
            className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}