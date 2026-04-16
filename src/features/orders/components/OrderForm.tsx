"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm, type UseFormRegister, type FieldPath } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Plus, Trash2, Package, ChevronDown, User, MapPin, ShoppingBag, Phone, Mail, DollarSign, Weight, ListTree } from "lucide-react";
import { toast } from "sonner";
import {
  orderCreateSchema,
  type OrderCreateFormValues,
} from "@/features/orders/schema/order-create.schema";
import { cn } from "@/lib/utils/cn";
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

const selectWrapper = "group space-y-2";
const selectContainer = `
  relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/80
  shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-200
  hover:border-slate-300 hover:shadow-[0_14px_34px_rgba(15,23,42,0.09)]
  focus-within:border-primary/50 focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.12),0_18px_36px_rgba(15,23,42,0.1)]
`;
const selectBase = `
  w-full appearance-none bg-transparent text-sm font-medium text-slate-800
  transition-all duration-200 ease-out cursor-pointer
  px-4 py-3.5 pr-16
  focus:outline-none
  disabled:cursor-not-allowed disabled:text-slate-400 disabled:opacity-70
`;
const optionBase = "text-sm font-medium text-slate-700 py-2.5 px-3";
const placeholderOption = "text-sm font-medium text-slate-400 italic";
const inputBase = "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:bg-gray-50 disabled:text-gray-400";
const labelBase = "block text-[11px] font-bold text-slate-500 uppercase tracking-[0.18em] ml-1";
const notesFields: Array<"merchantNotes" | "employeeNotes" | "deliveryNotes"> = [
  "merchantNotes",
  "employeeNotes",
  "deliveryNotes",
];

function EnhancedSelect({
  register,
  name,
  label,
  options,
  disabled = false,
  placeholder,
  valueAsNumber = false,
}: {
  register: UseFormRegister<OrderCreateFormValues>;
  name: FieldPath<OrderCreateFormValues>;
  label?: string;
  options: { value: number; label: string }[];
  disabled?: boolean;
  placeholder?: string;
  valueAsNumber?: boolean;
}) {
  return (
    <div className={selectWrapper}>
      {label && <label className={labelBase}>{label}</label>}
      <div className={cn(selectContainer, disabled && "border-slate-100 from-slate-50 to-slate-100 shadow-none")}>
        <select
          {...register(name, { valueAsNumber })}
          disabled={disabled}
          className={selectBase}
        >
          <option value={0} className={placeholderOption}>{placeholder || "Select an option"}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className={optionBase}>{opt.label}</option>
          ))}
        </select>
        <div
          className={cn(
            "pointer-events-none absolute inset-y-2 right-2 flex w-11 items-center justify-center rounded-xl border border-slate-200/80 bg-white/90 shadow-sm transition-all duration-200",
            disabled
              ? "border-slate-100 bg-slate-100 text-slate-300"
              : "text-slate-400 group-hover:text-primary group-focus-within:border-primary/30 group-focus-within:text-primary"
          )}
        >
          <ChevronDown
            className={cn(
              "transition-transform duration-200",
              !disabled && "group-focus-within:rotate-180"
            )}
            size={18}
          />
        </div>
      </div>
    </div>
  );
}

function StringSelect({
  register,
  name,
  label,
  options,
  disabled = false,
  placeholder,
}: {
  register: UseFormRegister<OrderCreateFormValues>;
  name: FieldPath<OrderCreateFormValues>;
  label?: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div className={selectWrapper}>
      {label && <label className={labelBase}>{label}</label>}
      <div className={cn(selectContainer, disabled && "border-slate-100 from-slate-50 to-slate-100 shadow-none")}>
        <select
          {...register(name)}
          disabled={disabled}
          className={selectBase}
        >
          <option value="" className={placeholderOption}>{placeholder || "Select an option"}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className={optionBase}>{opt.label}</option>
          ))}
        </select>
        <div
          className={cn(
            "pointer-events-none absolute inset-y-2 right-2 flex w-11 items-center justify-center rounded-xl border border-slate-200/80 bg-white/90 shadow-sm transition-all duration-200",
            disabled
              ? "border-slate-100 bg-slate-100 text-slate-300"
              : "text-slate-400 group-hover:text-primary group-focus-within:border-primary/30 group-focus-within:text-primary"
          )}
        >
          <ChevronDown
            className={cn(
              "transition-transform duration-200",
              !disabled && "group-focus-within:rotate-180"
            )}
            size={18}
          />
        </div>
      </div>
    </div>
  );
}

export default function  OrderForm({ isLoading, onSubmit, onCancel }: OrderFormProps) {
  const [products, setProducts] = useState([{ name: "", quantity: 1, itemWeight: 0.1 }]);

  const { data: branchesData } = useGetBranchesQuery({ pageSize: 10000 });
  const { data: governmentsData } = useGetGovernmentsQuery({ pageSize: 10000 });
  const { data: citiesData } = useGetCitiesQuery({ pageSize: 10000 });
  const { data: merchantsData } = useGetMerchantsQuery({ pageSize: 10000 });
  const { data: shippingTypes } = useGetShippingTypesQuery();

  const { register, handleSubmit, setValue, watch } = useForm<OrderCreateFormValues>({
    resolver: yupResolver(orderCreateSchema),
    defaultValues: {
      deliverToVillage: false,
      products: [{ name: "", quantity: 1, itemWeight: 0.1 }],
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
      orderType: "",
      paymentType: "",
    },
  });

  const [selectedBranch_Id, , selectedGovernment_Id] = watch(["branch_Id", "merchant_Id", "government_Id"]);

  const activeBranches = useMemo(() => branchesData?.data?.branches?.filter((b) => !b.isDeleted) || [], [branchesData]);
  const selectedBranchName = useMemo(() => activeBranches.find((b) => b.id === selectedBranch_Id)?.name?.toLowerCase() || "", [activeBranches, selectedBranch_Id]);

  const activeMerchants = useMemo(() => merchantsData?.data?.merchants?.filter((m) => {
    if (m.isDeleted) return false;
    if (!selectedBranchName) return true;
    return (m.branchsNames?.toLowerCase() || "").includes(selectedBranchName);
  }) || [], [merchantsData, selectedBranchName]);

  const activeGovernments = useMemo(() => governmentsData?.governments?.filter((g) => !g.isDeleted && g.branch_Id === selectedBranch_Id) || [], [governmentsData, selectedBranch_Id]);

  const filteredCities = useMemo(() => {
    if (!selectedGovernment_Id) return [];
    const selectedGov = governmentsData?.governments?.find((g) => g.id === selectedGovernment_Id);
    return citiesData?.data?.cities?.filter((c) => !c.isDeleted && c.governmentName === selectedGov?.name) || [];
  }, [citiesData, governmentsData, selectedGovernment_Id]);

  useEffect(() => { setValue("products", products, { shouldValidate: true }); }, [products, setValue]);
  useEffect(() => { if (!selectedBranch_Id) { setValue("government_Id", 0); setValue("city_Id", 0); setValue("merchant_Id", 0); } }, [selectedBranch_Id, setValue]);

  const handleSubmitForm = (values: OrderCreateFormValues) => {
    if (products.some(p => p.name.trim() === "")) return toast.error("Please fill all product names");
    onSubmit({ ...values, products, orderCost: Number(values.orderCost), orderTotalWeight: Number(values.orderTotalWeight) || 0 });
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="max-w-6xl mx-auto space-y-6 pb-20">

      {/* 1. MERCHANT & BRANCH SECTION */}
      <div className="themed-surface rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
          <div className="p-2 bg-primary/10 rounded-lg text-primary"><Package size={18} /></div>
          <h3 className="text-md font-bold text-gray-800">Branch & Merchant Selection</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <EnhancedSelect
            register={register}
            name="branch_Id"
            label="Select Branch"
            options={activeBranches.map(b => ({ value: b.id, label: b.name }))}
            valueAsNumber
            placeholder="Choose Branch"
          />
          <EnhancedSelect
            register={register}
            name="merchant_Id"
            label="Merchant"
            options={activeMerchants.map(m => ({ value: m.id, label: `${m.name} • ${m.storeName}` }))}
            valueAsNumber
            disabled={!selectedBranch_Id}
            placeholder={selectedBranch_Id ? "Choose Merchant" : "Select Branch First"}
          />
          <EnhancedSelect
            register={register}
            name="shippingType_Id"
            label="Shipping Method"
            options={shippingTypes?.filter(s => !s.isDeleted).map(s => ({ value: s.id, label: `${s.type} • ${s.cost.toFixed(0)} EGP` })) || []}
            valueAsNumber
            placeholder="Select Shipping Type"
          />
        </div>
      </div>

      {/* 3. GEOGRAPHY SECTION */}
      <div className="themed-surface rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><MapPin size={18} /></div>
          <h3 className="text-md font-bold text-gray-800">Shipping Destination</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <EnhancedSelect
            register={register}
            name="government_Id"
            label="Government"
            options={activeGovernments.map(g => ({ value: g.id, label: g.name }))}
            valueAsNumber
            disabled={!selectedBranch_Id}
            placeholder={selectedBranch_Id ? "Choose Government" : "Select Branch First"}
          />
          <EnhancedSelect
            register={register}
            name="city_Id"
            label="City"
            options={filteredCities.map(c => ({ value: c.id, label: c.name }))}
            valueAsNumber
            disabled={!selectedGovernment_Id}
            placeholder={selectedGovernment_Id ? "Choose City" : "Select Government First"}
          />
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-xl flex items-center gap-3 border border-gray-100">
          <input type="checkbox" {...register("deliverToVillage")} id="village" className="w-5 h-5 accent-primary rounded cursor-pointer" />
          <label htmlFor="village" className="text-sm font-semibold text-gray-600 cursor-pointer">Special Delivery to Village (Check if applicable)</label>
        </div>
      </div>

      {/* 2. ORDER TYPE & PAYMENT SECTION */}
      <div className="themed-surface rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
          <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><ListTree size={18} /></div>
          <h3 className="text-md font-bold text-gray-800">Order & Payment Configuration</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="md:col-span-2">
            <StringSelect
              register={register}
              name="orderType"
              label="Order Type"
              options={Object.values(ORDER_TYPES).map(t => ({ value: t, label: ORDER_TYPE_LABELS[t] }))}
              placeholder="Choose Order Type"
            />
          </div>
          <div className="md:col-span-2">
            <StringSelect
              register={register}
              name="paymentType"
              label="Payment Method"
              options={Object.values(PAYMENT_TYPES).map(t => ({ value: t, label: PAYMENT_TYPE_LABELS[t] }))}
              placeholder="Choose Payment Type"
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelBase}>Order Cost (EGP)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 text-gray-400" size={16} />
              <input type="number" {...register("orderCost")} className={`${inputBase} pl-9 font-bold text-primary`} placeholder="0.00" />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className={labelBase}>Total Weight (KG)</label>
            <div className="relative">
              <Weight className="absolute left-3 top-3 text-gray-400" size={16} />
              <input type="number" step="0.1" {...register("orderTotalWeight")} className={`${inputBase} pl-9`} placeholder="0.0" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. CLIENT INFO SECTION */}
      <div className="themed-surface rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
          <div className="p-2 bg-green-50 rounded-lg text-green-600"><User size={18} /></div>
          <h3 className="text-md font-bold text-gray-800">Client Contact Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-1">
            <label className={labelBase}>Full Name</label>
            <input {...register("clientName")} className={inputBase} placeholder="Receiver's full name" />
          </div>
          <div className="md:col-span-1">
            <label className={labelBase}>Email Address (Optional)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={14} />
              <input type="email" {...register("clientEmail")} className={`${inputBase} pl-9`} placeholder="client@example.com" />
            </div>
          </div>
          <div>
            <label className={labelBase}>Phone Number 1</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={14} />
              <input {...register("clientPhone1")} className={`${inputBase} pl-9`} placeholder="01xxxxxxxxx" />
            </div>
          </div>
          <div>
            <label className={labelBase}>Phone Number 2 (Optional)</label>
            <input {...register("clientPhone2")} className={inputBase} placeholder="01xxxxxxxxx" />
          </div>
          <div className="md:col-span-2">
            <label className={labelBase}>Detailed Address</label>
            <textarea {...register("clientAddress")} rows={2} className={`${inputBase} resize-none`} placeholder="Street, Building No, Floor, Apartment..." />
          </div>
        </div>
      </div>

      {/* 5. PRODUCTS SECTION */}
      <div className="themed-surface rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-primary" size={20} />
            <h3 className="text-lg font-bold tracking-tight text-gray-300">Order Items</h3>
          </div>
          <button type="button" onClick={() => setProducts([...products, { name: "", quantity: 1, itemWeight: 0.1 }])}
            className="px-4 py-2 bg-primary hover:bg-primary-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
            <Plus size={14} /> Add Product
          </button>
        </div>
        <div className="space-y-3">
          {products.map((p, index) => (
            <div key={index} className="flex gap-3 items-center bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors text-gray-300">
              <input value={p.name} onChange={(e) => { const n = [...products]; n[index].name = e.target.value; setProducts(n); }} placeholder="Product Name" className="bg-transparent border-b border-white/20 outline-none flex-[4] text-sm py-1 focus:border-primary" />
              <input type="number" value={p.quantity} onChange={(e) => { const n = [...products]; n[index].quantity = Number(e.target.value); setProducts(n); }} className="bg-transparent border-b border-white/20 outline-none flex-1 text-sm py-1 text-center" placeholder="Qty" />
              <input type="number" step="0.1" value={p.itemWeight} onChange={(e) => { const n = [...products]; n[index].itemWeight = Number(e.target.value); setProducts(n); }} className="bg-transparent border-b border-white/20 outline-none flex-1 text-sm py-1 text-center" placeholder="Wt" />
              <button type="button" onClick={() => setProducts(products.filter((_, i) => i !== index))} disabled={products.length === 1} className="p-2 text-red-400 hover:text-red-300 disabled:opacity-0 transition-opacity"><Trash2 size={18} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* 6. NOTES SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {notesFields.map((n) => (
          <div key={n} className="themed-surface rounded-2xl p-5">
            <label className={labelBase}>{n.replace("Notes", " Instructions")}</label>
            <textarea {...register(n)} className={`${inputBase} h-24 resize-none bg-gray-50/30`} placeholder="Write any specific notes here..." />
          </div>
        ))}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="themed-surface sticky bottom-6 z-10 mx-4 flex gap-4 rounded-3xl p-4 backdrop-blur-md md:mx-0">
        <button type="button" onClick={onCancel} className="flex-1 py-4 text-sm font-bold text-gray-400 hover:text-gray-700 transition-colors">Discard Changes</button>
        <button type="submit" disabled={isLoading} className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all">
          {isLoading ? "Synchronizing Data..." : "Finalize & Create Order"}
        </button>
      </div>
    </form>
  );
}
