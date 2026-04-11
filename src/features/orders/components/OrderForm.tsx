// OrderForm.tsx
// Form for creating a new order with products

"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  orderCreateSchema,
  type OrderCreateFormValues,
} from "@/features/orders/schema/order-create.schema";
import {
  useGetBranchesQuery,
  useGetGovernmentsQuery,
  useGetCitiesQuery,
  useGetMerchantsQuery,
  useGetShippingTypesQuery,
} from "@/store/slices/api/apiSlice";
import { ORDER_TYPES, ORDER_TYPE_LABELS, PAYMENT_TYPES, PAYMENT_TYPE_LABELS } from "@/constants/shippingTypes";

interface OrderFormProps {
  isLoading: boolean;
  onSubmit: (values: OrderCreateFormValues) => void;
  onCancel: () => void;
}

export default function OrderForm({
  isLoading,
  onSubmit,
  onCancel,
}: OrderFormProps) {
  const [products, setProducts] = useState([
    { name: "", quantity: 1, itemWeight: 0.1 },
  ]);

  const { data: branchesData } = useGetBranchesQuery({ pageSize: 100 });
  const { data: governmentsData } = useGetGovernmentsQuery({ pageSize: 100 });
  const { data: citiesData } = useGetCitiesQuery({ pageSize: 100 });
  const { data: merchantsData } = useGetMerchantsQuery({ pageSize: 100 });
  const { data: shippingTypes } = useGetShippingTypesQuery();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrderCreateFormValues>({
    resolver: yupResolver(orderCreateSchema),
    defaultValues: {
      deliverToVillage: false,
      products: [{ name: "", quantity: 1, itemWeight: 0.1 }],
      // ضيف دول عشان الـ Backend ميعملش Crash
      merchantNotes: "",
      employeeNotes: "",
      deliveryNotes: "",
      clientPhone2: "",
      clientEmail: "",
      orderTotalWeight: 0,
      merchant_Id: 0,
      branch_Id: 0,
      government_Id: 0,
      city_Id: 0,
      shippingType_Id: 0,
    },
  });

  const [selectedBranch_Id, selectedMerchant_Id, selectedGovernment_Id, city_Id] = watch(["branch_Id", "merchant_Id", "government_Id", "city_Id"]);

  const activeBranches = useMemo(
    () => branchesData?.data?.branches?.filter((b) => !b.isDeleted) || [],
    [branchesData?.data?.branches]
  );

  const selectedBranch = activeBranches.find((b) => b.id === selectedBranch_Id);
  const selectedBranchName = selectedBranch?.name?.toLowerCase() || "";

  const activeMerchants = useMemo(
    () =>
      merchantsData?.data?.merchants?.filter((m) => {
        if (m.isDeleted) return false;
        if (!selectedBranchName) return true;
        const branchNames = m.branchsNames?.toLowerCase() || "";
        return branchNames.includes(selectedBranchName);
      }) || [],
    [merchantsData?.data?.merchants, selectedBranchName]
  );

  const activeGovernments = useMemo(
    () =>
      governmentsData?.governments?.filter(
        (g) => !g.isDeleted && g.branch_Id === selectedBranch_Id
      ) || [],
    [governmentsData?.governments, selectedBranch_Id]
  );

  const selectedGovernment = activeGovernments.find(
    (g) => g.id === selectedGovernment_Id
  );

  const filteredCities = useMemo(() => {
    if (!selectedGovernment || !selectedGovernment_Id) {
      return citiesData?.data?.cities?.filter((c) => !c.isDeleted) || [];
    }
    return (
      citiesData?.data?.cities?.filter(
        (c) => !c.isDeleted && c.governmentName === selectedGovernment.name
      ) || []
    );
  }, [citiesData?.data?.cities, selectedGovernment, selectedGovernment_Id]);

  useEffect(() => {
    if (!selectedGovernment_Id && city_Id !== 0) {
      setValue("city_Id", 0);
    }
  }, [selectedGovernment_Id, city_Id, setValue]);

  useEffect(() => {
    if (!selectedBranch_Id && (selectedGovernment_Id !== 0 || city_Id !== 0 || selectedMerchant_Id !== 0)) {
      setValue("government_Id", 0);
      setValue("city_Id", 0);
      setValue("merchant_Id", 0);
    }
  }, [selectedBranch_Id, selectedGovernment_Id, city_Id, selectedMerchant_Id, setValue]);

  useEffect(() => {
    if (selectedMerchant_Id && !activeMerchants.some((m) => m.id === selectedMerchant_Id)) {
      setValue("merchant_Id", 0);
    }
  }, [selectedMerchant_Id, activeMerchants, setValue]);

  useEffect(() => {
    if (selectedGovernment_Id && !activeGovernments.some((g) => g.id === selectedGovernment_Id)) {
      setValue("government_Id", 0);
      setValue("city_Id", 0);
    }
  }, [selectedGovernment_Id, activeGovernments, setValue]);

  useEffect(() => {
    setValue("products", products, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [products, setValue]);

  // ==================== Products ====================
  const addProduct = () => {
    setProducts((prev) => [...prev, { name: "", quantity: 1, itemWeight: 0.1 }]);
  };

  const removeProduct = (index: number) => {
    if (products.length === 1) return;
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitForm = (values: OrderCreateFormValues) => {
    // 1. التحقق من وجود منتجات
    if (products.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    // 2. التحقق من صحة بيانات كل منتج (Validation)
    const isValid = products.every(
      (product) =>
        product.name.trim() !== "" &&
        product.quantity > 0 &&
        product.itemWeight > 0
    );

    if (!isValid) {
      toast.error("Please fill in all product details");
      return;
    }

    // 3. تجهيز البيانات النهائية وتنظيفها من أي قيم undefined أو null
    const finalValues: OrderCreateFormValues = {
      ...values,
      products: products, // استخدام قائمة المنتجات من الـ state
      // ضمان إرسال نصوص فارغة بدلاً من undefined للحقول الاختيارية
      merchantNotes: values.merchantNotes || "",
      employeeNotes: values.employeeNotes || "",
      deliveryNotes: values.deliveryNotes || "",
      clientPhone2: values.clientPhone2 || "",
      clientEmail: values.clientEmail || "",
      // التأكد من أن الأوزان والقيم الرقمية مبعوثة كـ Numbers
      orderTotalWeight: Number(values.orderTotalWeight) || 0,
      orderCost: Number(values.orderCost) || 0,
    };

    // 4. إرسال البيانات للـ Hook (useCreateOrder)
    console.log("Submitting cleaned order data:", finalValues);
    onSubmit(finalValues);
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">

      {/* ── Order Information ── */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-bold text-gray-900">Order Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Merchant */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Merchant</label>
            <select
              {...register("merchant_Id", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500 bg-white"
              disabled={!selectedBranch_Id}
            >
              <option value={0}>
                {selectedBranch_Id ? "Select merchant" : "Select branch first"}
              </option>
              {activeMerchants.map((m) => (
                <option key={m.id} value={m.id}>{m.name} - {m.storeName}</option>
              ))}
            </select>
            {errors.merchant_Id && <p className="text-xs text-red-500">{errors.merchant_Id.message}</p>}
          </div>

          {/* Branch */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Branch</label>
            <select
              {...register("branch_Id", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500 bg-white"
            >
              <option value={0}>Select branch</option>
              {activeBranches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            {errors.branch_Id && <p className="text-xs text-red-500">{errors.branch_Id.message}</p>}
          </div>

          {/* Government */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Government</label>
            <select
              {...register("government_Id", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500 bg-white"
            >
              <option value={0}>Select government</option>
              {activeGovernments.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
            {errors.government_Id && <p className="text-xs text-red-500">{errors.government_Id.message}</p>}
          </div>

          {/* City */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">City</label>
            <select
              {...register("city_Id", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500 bg-white"
              disabled={!selectedGovernment_Id}
            >
              <option value={0}>
                {selectedGovernment_Id ? "Select city" : "Select government first"}
              </option>
              {filteredCities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.city_Id && <p className="text-xs text-red-500">{errors.city_Id.message}</p>}
          </div>

          {/* Shipping Type */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Shipping Type</label>
            <select
              {...register("shippingType_Id", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500 bg-white"
            >
              <option value={0}>Select shipping type</option>
              {shippingTypes?.map((s) => (
                <option key={s.id} value={s.id}>{s.type} - {s.cost} EGP</option>
              ))}
            </select>
            {errors.shippingType_Id && <p className="text-xs text-red-500">{errors.shippingType_Id.message}</p>}
          </div>

          {/* Order Type */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Order Type</label>
            <select
              {...register("orderType")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500 bg-white"
            >
              <option value="">Select order type</option>
              {Object.values(ORDER_TYPES).map((type) => (
                <option key={type} value={type}>
                  {ORDER_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
            {errors.orderType && <p className="text-xs text-red-500">{errors.orderType.message}</p>}
          </div>

          {/* Payment Type */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Payment Type</label>
            <select
              {...register("paymentType")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500 bg-white"
            >
              <option value="">Select payment type</option>
              {Object.values(PAYMENT_TYPES).map((type) => (
                <option key={type} value={type}>
                  {PAYMENT_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
            {errors.paymentType && <p className="text-xs text-red-500">{errors.paymentType.message}</p>}
          </div>

          {/* Order Cost */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Order Cost (EGP)</label>
            <input
              {...register("orderCost", { valueAsNumber: true })}
              type="number"
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
            />
            {errors.orderCost && <p className="text-xs text-red-500">{errors.orderCost.message}</p>}
          </div>

          {/* Order Total Weight */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Total Weight (kg) <span className="text-gray-400">(optional)</span>
            </label>
            <input
              {...register("orderTotalWeight", {
                setValueAs: (value) => (value === "" ? undefined : Number(value)),
              })}
              type="number"
              placeholder="0.0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
            />
          </div>

          {/* Deliver To Village */}
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
            <input
              {...register("deliverToVillage")}
              type="checkbox"
              id="deliverToVillage"
              className="w-4 h-4 accent-orange-500"
            />
            <label htmlFor="deliverToVillage" className="text-sm font-medium text-gray-700 cursor-pointer">
              Deliver to Village (extra cost)
            </label>
          </div>

        </div>
      </div>

      {/* ── Client Information ── */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-bold text-gray-900">Client Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Client Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Client Name</label>
            <input
              {...register("clientName")}
              placeholder="Enter client name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
            />
            {errors.clientName && <p className="text-xs text-red-500">{errors.clientName.message}</p>}
          </div>

          {/* Client Phone 1 */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Phone 1</label>
            <input
              {...register("clientPhone1")}
              placeholder="01XXXXXXXXX"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
            />
            {errors.clientPhone1 && <p className="text-xs text-red-500">{errors.clientPhone1.message}</p>}
          </div>

          {/* Client Phone 2 */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Phone 2 <span className="text-gray-400">(optional)</span>
            </label>
            <input
              {...register("clientPhone2")}
              placeholder="01XXXXXXXXX"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
            />
          </div>

          {/* Client Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Email <span className="text-gray-400">(optional)</span>
            </label>
            <input
              {...register("clientEmail")}
              type="email"
              placeholder="client@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
            />
          </div>

          {/* Client Address */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">Client Address</label>
            <input
              {...register("clientAddress")}
              placeholder="Enter full address"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
            />
            {errors.clientAddress && <p className="text-xs text-red-500">{errors.clientAddress.message}</p>}
          </div>

        </div>
      </div>

      {/* ── Products ── */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">Products</h3>
          <button
            type="button"
            onClick={addProduct}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white text-xs font-semibold rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Product
          </button>
        </div>

        {products.map((product, index) => (
          <div key={index} className="grid grid-cols-3 gap-2 items-center">
            <input
              type="text"
              placeholder="Product name"
              value={product.name}
              onChange={(e) => setProducts((prev) =>
                prev.map((p, i) => i === index ? { ...p, name: e.target.value } : p)
              )}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
            />
            <input
              type="number"
              placeholder="Qty"
              value={product.quantity}
              onChange={(e) => setProducts((prev) =>
                prev.map((p, i) => i === index ? { ...p, quantity: Number(e.target.value) } : p)
              )}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Weight (kg)"
                value={product.itemWeight}
                onChange={(e) => setProducts((prev) =>
                  prev.map((p, i) => i === index ? { ...p, itemWeight: Number(e.target.value) } : p)
                )}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
              />
              <button
                type="button"
                onClick={() => removeProduct(index)}
                disabled={products.length === 1}
                className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {errors.products && (
          <p className="text-xs text-red-500">{errors.products.message}</p>
        )}
      </div>

      {/* ── Notes ── */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-bold text-gray-900">Notes</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Merchant Notes</label>
            <textarea
              {...register("merchantNotes")}
              placeholder="Optional..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500 resize-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Employee Notes</label>
            <textarea
              {...register("employeeNotes")}
              placeholder="Optional..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500 resize-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Delivery Notes</label>
            <textarea
              {...register("deliveryNotes")}
              placeholder="Optional..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Creating..." : "Create Order"}
        </button>
      </div>

    </form>
  );
}
