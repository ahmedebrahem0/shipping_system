// MerchantForm.tsx
// Form for creating and editing a merchant

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Landmark, User } from "lucide-react";
import {
  merchantCreateSchema,
  merchantEditSchema,
  type MerchantCreateFormValues,
  type MerchantEditFormValues,
} from "@/features/merchants/schema/merchant.schema";

import {
  useGetBranchesQuery,
  useGetCitiesQuery,
  useGetDeliveryGovernmentsByBranchQuery,
} from "@/store/slices/api/apiSlice";
import type { Merchant } from "@/types/merchant.types";
import type { Government } from "@/types/government.types";
import PasswordInput from "@/components/common/PasswordInput";
import { cn } from "@/lib/utils/cn";

interface MerchantFormProps {
  selectedMerchant?: Merchant | null;
  isLoading: boolean;
  onSubmit: (values: MerchantCreateFormValues | MerchantEditFormValues) => void;
  onCancel: () => void;
}

interface MerchantFormFields {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  phone: string;
  address: string;
  storeName?: string;
  government: number[];
  governmentsId: number[];
  city: string;
  pickupCost: number;
  rejectedOrderPercentage?: number;
  branches_Id: number[];
  branchId: number;
  specialShippingRates?: { city_Id: number; specialPrice: number }[];
  isDeleted?: boolean;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

const SELECT_CLASSNAME =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pl-11 text-sm transition-all outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

function InputField({
  label,
  icon: Icon,
  error,
  children,
}: {
  label: string;
  icon: typeof User;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        {children}
      </div>
      <FieldError message={error} />
    </div>
  );
}

export default function MerchantForm({
  selectedMerchant,
  isLoading,
  onSubmit,
  onCancel,
}: MerchantFormProps) {
  const isEditing = !!selectedMerchant;
  const previousBranchIdRef = useRef<number>(selectedMerchant?.branches_Id?.[0] ?? 0);

  const { data: branchesData } = useGetBranchesQuery({ pageSize: 100 });
  const activeBranches =
    branchesData?.data?.branches?.filter((branch) => !branch.isDeleted) ?? [];
  const { data: citiesData } = useGetCitiesQuery({ pageSize: 100 });

  const [selectedGovernment, setSelectedGovernment] = useState<string>(
    selectedMerchant?.government || ""
  );
  const [specialShippingRates, setSpecialShippingRates] = useState<
    { city_Id: number; specialPrice: number }[]
  >([]);

  const filteredCities =
    citiesData?.data?.cities?.filter(
      (city) => city.governmentName === selectedGovernment
    ) || [];

  const resolver = yupResolver(
    isEditing ? merchantEditSchema : merchantCreateSchema
  ) as unknown as Resolver<MerchantFormFields>;
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MerchantFormFields>({
    resolver,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      storeName: "",
      government: [],
      governmentsId: [],
      city: "",
      pickupCost: 0,
      rejectedOrderPercentage: 0,
      branches_Id: [],
      branchId: 0,
      specialShippingRates: [],
      isDeleted: false,
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  // Required here to mirror the delivery form interaction pattern.
  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedBranchId = watch("branchId");
  const watchedGovernments = watch("governmentsId");
  const branchId = Number(watchedBranchId || 0);
  const hasSelectedBranch = branchId > 0;

  const { data: governmentsData, isFetching: isFetchingGovernments } =
    useGetDeliveryGovernmentsByBranchQuery(branchId, {
      skip: !hasSelectedBranch,
    });

  useEffect(() => {
    if (selectedMerchant) {
      const nextBranchId = Number(selectedMerchant.branches_Id?.[0] ?? 0);

      previousBranchIdRef.current = nextBranchId;
      reset({
        name: selectedMerchant.name,
        email: selectedMerchant.email,
        phone: selectedMerchant.phone,
        address: selectedMerchant.address,
        storeName: selectedMerchant.storeName,
        government: [],
        governmentsId: [],
        city: selectedMerchant.city,
        pickupCost: selectedMerchant.pickupCost,
        rejectedOrderPercentage: selectedMerchant.rejectedOrderPercentage,
        branches_Id: selectedMerchant.branches_Id ?? [],
        branchId: nextBranchId,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      return;
    }

    previousBranchIdRef.current = 0;
    reset({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      storeName: "",
      government: [],
      governmentsId: [],
      city: "",
      pickupCost: 0,
      rejectedOrderPercentage: 0,
      branches_Id: [],
      branchId: 0,
      specialShippingRates: [],
      isDeleted: false,
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  }, [selectedMerchant, reset]);

  useEffect(() => {
    setValue("branches_Id", branchId > 0 ? [branchId] : [], {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (previousBranchIdRef.current !== branchId) {
      setValue("governmentsId", [], {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("government", [], {
        shouldDirty: true,
        shouldValidate: true,
      });
      setSelectedGovernment("");
    }

    previousBranchIdRef.current = branchId;
  }, [branchId, setValue]);

  useEffect(() => {
    const selectedGovernmentIds = watchedGovernments ?? [];

    if (!selectedMerchant || !governmentsData?.length || selectedGovernmentIds.length > 0) {
      return;
    }

    const governmentNames = selectedMerchant.government
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean);

    if (!governmentNames.length) {
      return;
    }

    const matchedGovernmentIds = governmentsData
      .filter((government: Government) => governmentNames.includes(government.name))
      .map((government: Government) => government.id);

    if (matchedGovernmentIds.length) {
      setValue("governmentsId", matchedGovernmentIds);
      setValue("government", matchedGovernmentIds);
    }
  }, [governmentsData, selectedMerchant, setValue, watchedGovernments]);

  useEffect(() => {
    const selectedGovernmentIds = watchedGovernments ?? [];
    const selectedGovernmentName =
      governmentsData?.find((government: Government) =>
        selectedGovernmentIds.includes(government.id)
      )?.name ?? "";

    setSelectedGovernment(selectedGovernmentName);
  }, [governmentsData, watchedGovernments]);

  const handleSubmitWrapper = (values: MerchantFormFields) => {
    const validRates = specialShippingRates.filter(r => r.city_Id > 0 && r.specialPrice > 0);
    if (validRates.length === 0) {
      alert("At least one special shipping rate is required");
      return;
    }
    const payload = {
      ...values,
      government: values.governmentsId,
      branches_Id: values.branchId ? [Number(values.branchId)] : [],
      specialShippingRates: validRates,
    };
    onSubmit(payload);
  };

  return (
    <form 
  onSubmit={handleSubmit(handleSubmitWrapper, (errors) => console.log("Form Errors:", errors))} 
  className="max-w-4xl mx-auto space-y-8 bg-white p-6 rounded-xl"
>
  
  {/* --- القسم الأول: المعلومات الأساسية --- */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="col-span-full border-b pb-2">
      <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
      <p className="text-xs text-gray-500">Merchant personal and store details</p>
    </div>

    {/* Name */}
    <div className="space-y-1">
      <label className="text-sm font-semibold text-gray-700">Full Name</label>
      <input
        {...register("name")}
        placeholder="Enter merchant name"
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm transition-all focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
      />
      {errors.name && <p className="text-xs text-red-500 mt-1">{String(errors.name.message)}</p>}
    </div>

    {/* Email */}
    <div className="space-y-1">
      <label className="text-sm font-semibold text-gray-700">Email Address</label>
      <input
        {...register("email")}
        type="email"
        placeholder="name@company.com"
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm transition-all focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
      />
      {errors.email && <p className="text-xs text-red-500 mt-1">{String(errors.email.message)}</p>}
    </div>

    {/* Phone */}
    <div className="space-y-1">
      <label className="text-sm font-semibold text-gray-700">Phone Number</label>
      <input
        {...register("phone")}
        placeholder="01XXXXXXXXX"
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm transition-all focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
      />
      {errors.phone && <p className="text-xs text-red-500 mt-1">{String(errors.phone.message)}</p>}
    </div>

    {/* Store Name */}
    <div className="space-y-1">
      <label className="text-sm font-semibold text-gray-700">
        Store Name <span className="text-gray-400 font-normal">(Optional)</span>
      </label>
      <input
        {...register("storeName")}
        placeholder="Enter store name"
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm transition-all focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
      />
    </div>
  </div>

  {/* --- Password Section (Create Mode) --- */}
  {!isEditing && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
      <div className="col-span-full flex items-center gap-2 mb-2">
        <span className="p-1 bg-primary-100 text-primary-600 rounded">
           <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="Ref 12" /></svg>
        </span>
        <h3 className="text-sm font-bold text-gray-800">Security</h3>
      </div>
      <PasswordInput
        {...register("password")}
        label="Password"
        placeholder="••••••••"
        error={String(errors.password?.message || "")}
      />
      <PasswordInput
        {...register("confirmPassword")}
        label="Confirm Password"
        placeholder="••••••••"
        error={String(errors.confirmPassword?.message || "")}
      />
    </div>
  )}

  {/* --- القسم الثاني: الموقع والفرع --- */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="col-span-full border-b pb-2">
      <h3 className="text-lg font-semibold text-gray-800">Location & Logistics</h3>
    </div>

    <div className="md:col-span-3 space-y-1">
      <label className="text-sm font-semibold text-gray-700">Full Address</label>
      <input
        {...register("address")}
        placeholder="Street, Building, Landmark..."
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm transition-all focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
      />
      {errors.address && <p className="text-xs text-red-500 mt-1">{String(errors.address.message)}</p>}
    </div>

    <InputField
      label="Branch"
      icon={Landmark}
      error={String(errors.branches_Id?.message || errors.branchId?.message || "")}
    >
      <select
        {...register("branchId", { valueAsNumber: true })}
        className={cn(SELECT_CLASSNAME, (errors.branches_Id || errors.branchId) && "border-red-500")}
      >
        <option value={0}>Select branch</option>
        {activeBranches.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </select>
    </InputField>

    <div className="space-y-1">
      <label className="text-sm font-semibold text-gray-700">Government</label>
      <Controller
        control={control}
        name="governmentsId"
        render={({ field }) => (
          <div
            className={cn(
              "rounded-xl border bg-gray-50/70 p-4 transition-all",
              errors.government || errors.governmentsId
                ? "border-red-500"
                : "border-gray-200",
              !hasSelectedBranch && "bg-gray-50"
            )}
          >
            {!hasSelectedBranch ? (
              <p className="text-sm text-gray-400">Select a branch first</p>
            ) : isFetchingGovernments ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : governmentsData?.length ? (
              <div className="grid max-h-52 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                {governmentsData.map((government: Government) => {
                  const checked = field.value?.includes(government.id);

                  return (
                    <label
                      key={government.id}
                      className={cn(
                        "flex w-fit cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors",
                        checked
                          ? "border-primary-300 bg-primary-50 text-primary-700"
                          : "border-gray-200 bg-white text-gray-700 hover:border-primary-200 hover:bg-primary-50/50"
                      )}
                    >
                      <input
                        type="checkbox"
                        value={government.id}
                        checked={checked}
                        onChange={(event) => {
                          const nextValues = event.target.checked
                            ? [...(field.value ?? []), government.id]
                            : (field.value ?? []).filter((value) => value !== government.id);

                          field.onChange(nextValues);
                          setValue("government", nextValues, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        }}
                        disabled={!hasSelectedBranch}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary-500"
                      />
                      <span>{government.name}</span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No governments are available for this branch.
              </p>
            )}
          </div>
        )}
      />
      <FieldError
        message={String(errors.government?.message || errors.governmentsId?.message || "")}
      />
    </div>

  </div>

  {/* --- القسم الثالث: التكاليف والنسب --- */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/30 p-4 rounded-xl border border-blue-100">
    <div className="space-y-1">
      <label className="text-sm font-semibold text-blue-900">Pickup Cost (EGP)</label>
      <input
        {...register("pickupCost")}
        type="number"
        placeholder="0.00"
        className="w-full px-4 py-2.5 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      />
      {errors.pickupCost && <p className="text-xs text-red-500">{String(errors.pickupCost.message)}</p>}
    </div>

    <div className="space-y-1">
      <label className="text-sm font-semibold text-blue-900">
        Rejected Percentage <span className="text-blue-400 font-normal">(%)</span>
      </label>
      <input
        {...register("rejectedOrderPercentage")}
        type="number"
        placeholder="0"
        className="w-full px-4 py-2.5 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  </div>

  {/* --- Special Shipping Rates --- */}
  <div className="space-y-3 p-4 border border-gray-200 rounded-lg">
    <div className="flex justify-between items-center">
      <div>
        <label className="text-sm font-bold text-gray-700 items-center flex gap-1">
          Special Shipping Rates <span className="text-red-500">*</span>
        </label>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Required: at least one rate</p>
      </div>
      <button
        type="button"
        onClick={() => setSpecialShippingRates([...specialShippingRates, { city_Id: 0, specialPrice: 0 }])}
        className="text-xs font-bold text-primary-600 hover:bg-primary-50 px-3 py-1.5 rounded-full transition-colors border border-primary-200"
      >
        + Add New Rate
      </button>
    </div>

    <div className="space-y-2">
      {specialShippingRates.map((rate, index) => (
        <div key={index} className="flex gap-2 items-center animate-in fade-in slide-in-from-top-1">
          <select
            value={rate.city_Id}
            onChange={(e) => {
              const updated = [...specialShippingRates];
              updated[index].city_Id = Number(e.target.value);
              setSpecialShippingRates(updated);
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white outline-none"
          >
            <option value="">Select city</option>
            {filteredCities.map((city) => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-400 text-xs">£</span>
            <input
              type="number"
              value={rate.specialPrice}
              onChange={(e) => {
                const updated = [...specialShippingRates];
                updated[index].specialPrice = Number(e.target.value);
                setSpecialShippingRates(updated);
              }}
              placeholder="Price"
              className="w-28 pl-6 pr-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => setSpecialShippingRates(specialShippingRates.filter((_, i) => i !== index))}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      ))}
    </div>
    {specialShippingRates.length === 0 && (
      <p className="text-xs text-red-500 font-medium">Please add at least one special shipping rate.</p>
    )}
  </div>

  {/* --- Password Section (Edit Mode) --- */}
  {isEditing && (
    <div className="border-t pt-6 mt-6">
      <div className="bg-orange-50/50 p-5 rounded-xl border border-orange-100 space-y-4">
        <div className="flex items-center gap-2">
           <h3 className="text-sm font-bold text-orange-800 tracking-tight">Account Security Update</h3>
           <span className="text-[10px] bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full uppercase">Optional</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PasswordInput
              {...register("currentPassword")}
              label="Current Password"
              placeholder="••••••••"
              error={String(errors.currentPassword?.message || "")}
            />
            <PasswordInput
              {...register("newPassword")}
              label="New Password"
              placeholder="••••••••"
              error={String(errors.newPassword?.message || "")}
            />
            <PasswordInput
              {...register("confirmNewPassword")}
              label="Confirm New Password"
              placeholder="••••••••"
              error={String(errors.confirmNewPassword?.message || "")}
            />
        </div>
      </div>
    </div>
  )}

  {/* --- Actions --- */}
  <div className="flex items-center justify-end gap-4 pt-6 border-t">
    <button
      type="button"
      onClick={onCancel}
      className="px-8 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={isLoading}
      className="px-10 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary-500/30 hover:bg-primary-600 active:transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Processing...
        </span>
      ) : isEditing ? "Update Merchant" : "Create Merchant"}
    </button>
  </div>
</form> 
  );
}
