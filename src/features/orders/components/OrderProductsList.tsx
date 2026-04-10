// OrderProductsList.tsx
// Displays existing products and allows adding new ones to an order

"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useAddProductMutation } from "@/store/slices/api/apiSlice";
import { toast } from "sonner";
import type { Product, ProductRequest } from "@/types/order.types";

interface OrderProductsListProps {
  products: Product[];
  orderId?: number;
  isEditing?: boolean;
}

export default function OrderProductsList({
  products,
  orderId,
  isEditing = false,
}: OrderProductsListProps) {
  const [newProducts, setNewProducts] = useState<ProductRequest[]>([]);
  const [addProduct, { isLoading }] = useAddProductMutation();

  // ==================== Add new product row ====================
  const addProductRow = () => {
    if (!orderId) return;
    setNewProducts((prev) => [
      ...prev,
      { name: "", quantity: 1, itemWeight: 0.1, orderId },
    ]);
  };

  // ==================== Update new product field ====================
  const updateNewProduct = (
    index: number,
    field: keyof ProductRequest,
    value: string | number
  ) => {
    setNewProducts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  // ==================== Remove new product row ====================
  const removeNewProduct = (index: number) => {
    setNewProducts((prev) => prev.filter((_, i) => i !== index));
  };

  // ==================== Save new products ====================
  const handleSaveProducts = async () => {
    if (newProducts.length === 0) return;
    try {
      await Promise.all(newProducts.map((p) => addProduct(p).unwrap()));
      toast.success("Products added successfully");
      setNewProducts([]);
    } catch {
      toast.error("Failed to add products");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-gray-900">Products</h3>

      {/* Existing Products */}
      {products.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-2">Name</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-2">Quantity</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-2">Weight (kg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-900">{product.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{product.quantity}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{product.itemWeight} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add New Products - Edit mode only */}
      {isEditing && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Add New Products</p>
            <button
              type="button"
              onClick={addProductRow}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white text-xs font-semibold rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Product
            </button>
          </div>

          {newProducts.length > 0 && (
            <div className="space-y-2">
              {newProducts.map((product, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Product name"
                    value={product.name}
                    onChange={(e) => updateNewProduct(index, "name", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={product.quantity}
                    onChange={(e) => updateNewProduct(index, "quantity", Number(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Weight"
                      value={product.itemWeight}
                      onChange={(e) => updateNewProduct(index, "itemWeight", Number(e.target.value))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewProduct(index)}
                      className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleSaveProducts}
                disabled={isLoading}
                className="w-full py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 transition-colors"
              >
                {isLoading ? "Saving..." : "Save New Products"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {products.length === 0 && !isEditing && (
        <p className="text-sm text-gray-400 text-center py-4">No products found</p>
      )}
    </div>
  );
}