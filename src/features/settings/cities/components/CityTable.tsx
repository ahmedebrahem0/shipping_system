// CityTable.tsx
// Displays cities in a table with edit and delete actions

import { Pencil, Trash2 } from "lucide-react";
import type { City } from "@/types/city.types";

interface CityTableProps {
  cities: City[];
  onEdit: (city: City) => void;
  onDelete: (city: City) => void;
}

export default function CityTable({
  cities,
  onEdit,
  onDelete,
}: CityTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">#</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Name</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Government</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Pickup Shipping</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Standard Shipping</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {cities.map((city) => (
            <tr key={city.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-500">{city.id}</td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{city.name}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{city.governmentName}</td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {city.pickupShipping ?? "—"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {city.standardShipping}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(city)}
                    className="p-1.5 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(city)}
                    className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}