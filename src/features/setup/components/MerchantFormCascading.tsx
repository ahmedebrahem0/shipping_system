// MerchantFormCascading.tsx
// Merchant form with cascading Government -> City dropdowns for the wizard

"use client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { useState, useEffect, useMemo, type FC, type HTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useGetBranchesQuery,
  useGetGovernmentsQuery,
  useGetCitiesQuery,
} from "@/store/slices/api/apiSlice";

const egyptianPhoneRegex = /^(?:\+20|0)?1[0-2,5]{1}[0-9]{8}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

// Backend requirement: name can only contain letters or digits (no spaces/special chars)
const nameOnlyLettersDigits = /^[a-zA-Z0-9]+$/;

const merchantSchema = yup.object({
  name: yup
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters")
    .matches(nameOnlyLettersDigits, "Name can only contain letters or digits (no spaces or special characters)")
    .required("Name is required"),

  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .matches(passwordRegex, "Password must contain uppercase, lowercase and number")
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),

  phone: yup
    .string()
    .matches(egyptianPhoneRegex, "Please enter a valid Egyptian phone number")
    .required("Phone is required"),

  address: yup
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(100, "Address must be at most 100 characters")
    .required("Address is required"),

  storeName: yup
    .string()
    .max(100, "Store name must be at most 100 characters")
    .optional(),

  government: yup
    .string()
    .required("Government is required"),

  city: yup
    .string()
    .required("City is required"),

  pickupCost: yup
    .number()
    .min(1, "Pickup cost must be at least 1")
    .required("Pickup cost is required"),

  rejectedOrderPercentage: yup
    .number()
    .min(0, "Must be at least 0")
    .max(100, "Must be at most 100")
    .optional(),

  branches_Id: yup
    .array()
    .of(yup.number().min(1, "Invalid branch"))
    .min(1, "Please select at least one branch")
    .required("Branch is required"),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MerchantFormValues = any;

interface MerchantFormCascadingProps {
  isLoading: boolean;
  onSubmit: (values: MerchantFormValues) => Promise<void>;
  onCancel: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getErrorMsg = (err: any): string => err?.message?.toString() || "";

export default function MerchantFormCascading({
  isLoading,
  onSubmit,
  onCancel,
}: MerchantFormCascadingProps) {
  const [selectedGovernment, setSelectedGovernment] = useState<string>("");

  const { data: branchesData } = useGetBranchesQuery({ pageSize: 100 });
  const { data: governmentsData } = useGetGovernmentsQuery({ pageSize: 100 });
  const { data: citiesData } = useGetCitiesQuery({ pageSize: 100 });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MerchantFormValues>({
    resolver: yupResolver(merchantSchema),
    defaultValues: {
      branches_Id: [],
      rejectedOrderPercentage: 0,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectedBranches: number[] = watch("branches_Id") || [];

  // Filter active branches only (isDeleted === false)
  const activeBranches = useMemo(
    () => branchesData?.data?.branches?.filter((b) => !b.isDeleted) ?? [],
    [branchesData?.data?.branches]
  );

  // Filter active governments only (isDeleted === false)
  const activeGovernments = useMemo(
    () => governmentsData?.governments?.filter((g) => !g.isDeleted) ?? [],
    [governmentsData?.governments]
  );

  // Filter cities based on selected government (only active cities)
  const filteredCities = useMemo(() => {
    if (!selectedGovernment) return [];
    return (
      citiesData?.data?.cities?.filter(
        (c) => !c.isDeleted && c.governmentName === selectedGovernment
      ) ?? []
    );
  }, [citiesData?.data?.cities, selectedGovernment]);

  // Reset city when government changes
  useEffect(() => {
    if (!selectedGovernment) {
      setValue("city", "");
    }
  }, [selectedGovernment, setValue]);

  // Reset government and city when no branches selected
  useEffect(() => {
    if (selectedBranches.length === 0) {
      setSelectedGovernment("");
      setValue("government", "");
      setValue("city", "");
    }
  }, [selectedBranches, setValue]);

  const handleGovernmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedGovernment(value);
    setValue("government", value);
    setValue("city", "");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Full Name</label>
        <input
          {...register("name")}
          placeholder="Enter merchant name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
        />
        {errors.name && <p className="text-xs text-red-500">{getErrorMsg(errors.name)}</p>}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          {...register("email")}
          type="email"
          placeholder="Enter email"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
        />
        {errors.email && <p className="text-xs text-red-500">{String(errors.email?.message)}</p>}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          {...register("password")}
          type="password"
          placeholder="Enter password"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
        />
        {errors.password && <p className="text-xs text-red-500">{getErrorMsg(errors.password)}</p>}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          {...register("confirmPassword")}
          type="password"
          placeholder="Confirm password"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">{getErrorMsg(errors.confirmPassword)}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Phone</label>
        <input
          {...register("phone")}
          placeholder="01XXXXXXXXX"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
        />
        {errors.phone && <p className="text-xs text-red-500">{getErrorMsg(errors.phone)}</p>}
      </div>

      {/* Address */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Address</label>
        <input
          {...register("address")}
          placeholder="Enter address"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
        />
        {errors.address && <p className="text-xs text-red-500">{getErrorMsg(errors.address)}</p>}
      </div>

      {/* Store Name */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Store Name <span className="text-gray-400">(optional)</span>
        </label>
        <input
          {...register("storeName")}
          placeholder="Enter store name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
        />
      </div>

      {/* Branch - Multi-select */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Branches <span className="text-gray-400">(select multiple)</span>
        </label>
        <div className="border border-gray-300 rounded-lg p-2 max-h-32 overflow-y-auto space-y-1">
          {activeBranches.map((branch) => (
            <label key={branch.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                value={branch.id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(e) => {
                  const currentValues = watch("branches_Id") || [];
                  if (e.target.checked) {
                    setValue("branches_Id", [...currentValues, branch.id]);
                  } else {
                    setValue(
                      "branches_Id",
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (currentValues as number[]).filter((id) => id !== branch.id)
                    );
                  }
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                checked={(watch("branches_Id") || []).includes(branch.id)}
                className="w-4 h-4 accent-orange-500"
              />
              <span className="text-sm">{branch.name}</span>
            </label>
          ))}
        </div>
        {errors.branches_Id && (
          <p className="text-xs text-red-500">{getErrorMsg(errors.branches_Id)}</p>
        )}
      </div>

      {/* Government */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Government</label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500 bg-white"
          onChange={handleGovernmentChange}
          value={selectedGovernment}
          disabled={selectedBranches.length === 0}
        >
          <option value="">
            {selectedBranches.length > 0 ? "Select a government" : "Select branch first"}
          </option>
          {activeGovernments.map((gov) => (
            <option key={gov.id} value={gov.name}>
              {gov.name}
            </option>
          ))}
        </select>
        {errors.government && (
          <p className="text-xs text-red-500">{getErrorMsg(errors.government)}</p>
        )}
      </div>

      {/* City - Cascading based on Government */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">City</label>
        <select
          {...register("city")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500 bg-white"
          disabled={!selectedGovernment}
        >
          <option value="">
            {selectedGovernment ? "Select a city" : "Select government first"}
          </option>
          {filteredCities.map((city) => (
            <option key={city.id} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
        {errors.city && <p className="text-xs text-red-500">{getErrorMsg(errors.city)}</p>}
      </div>

      {/* Pickup Cost */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Pickup Cost</label>
        <input
          {...register("pickupCost", { valueAsNumber: true })}
          type="number"
          placeholder="0.00"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
        />
        {errors.pickupCost && (
          <p className="text-xs text-red-500">{getErrorMsg(errors.pickupCost)}</p>
        )}
      </div>

      {/* Rejected Order Percentage */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Rejected Order Percentage <span className="text-gray-400">(optional)</span>
        </label>
        <input
          {...register("rejectedOrderPercentage", { valueAsNumber: true })}
          type="number"
          placeholder="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Saving..." : "Create"}
        </button>
      </div>
    </form>
  );
}