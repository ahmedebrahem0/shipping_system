// DeliveryForm.tsx
// Form for creating and editing a delivery agent

"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  Controller,
  useForm,
  useWatch,
  type Resolver,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Landmark, Mail, MapPin, Phone, User } from "lucide-react";
import { toast } from "sonner";
import {
  deliveryCreateSchema,
  deliveryEditSchema,
} from "@/features/deliveries/schema/delivery.schema";
import {
  useGetBranchesQuery,
  useGetDeliveryGovernmentsByBranchQuery,
} from "@/store/slices/api/apiSlice";
import PasswordInput from "@/components/common/PasswordInput";
import { DISCOUNT_TYPES, DISCOUNT_TYPE_LABELS } from "@/constants/shippingTypes";
import { cn } from "@/lib/utils/cn";
import type {
  Delivery,
  DeliveryCreateRequest,
  DeliveryEditRequest,
} from "@/types/delivery.types";
import type { Government } from "@/types/government.types";

interface DeliveryFormProps {
  selectedDelivery?: Delivery | null;
  isLoading: boolean;
  onSubmit: (
    values: DeliveryCreateRequest | DeliveryEditRequest
  ) => Promise<void> | void;
  onCancel: () => void;
}

interface DeliveryFormValues {
  name: string;
  email: string;
  phone: string;
  password?: string;
  address: string;
  branchId: number;
  governmentsId: number[];
  discountType: string;
  companyPercentage: number;
  isDeleted?: boolean;
}

const INPUT_CLASSNAME =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pl-11 text-sm transition-all outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20";

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

export default function DeliveryForm({
  selectedDelivery,
  isLoading,
  onSubmit,
  onCancel,
}: DeliveryFormProps) {
  const isEditing = !!selectedDelivery;
  const previousBranchIdRef = useRef<number>(selectedDelivery?.branchId ?? 0);
  const resolver = yupResolver(
    isEditing ? deliveryEditSchema : deliveryCreateSchema
  ) as unknown as Resolver<DeliveryFormValues>;

  const { data: branchesData } = useGetBranchesQuery({ pageSize: 100 });

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<DeliveryFormValues>({
    resolver,
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      address: "",
      branchId: 0,
      governmentsId: [],
      discountType: "",
      companyPercentage: 0,
      isDeleted: false,
    },
  });

  const watchedBranchId = useWatch({
    control,
    name: "branchId",
  });
  const branchId = Number(watchedBranchId || 0);
  const hasSelectedBranch = branchId > 0;

  const { data: governmentsData, isFetching: isFetchingGovernments } =
    useGetDeliveryGovernmentsByBranchQuery(branchId, {
      skip: !hasSelectedBranch,
    });

  useEffect(() => {
    if (selectedDelivery) {
      const nextBranchId = Number(selectedDelivery.branchId ?? 0);

      previousBranchIdRef.current = nextBranchId;
      reset({
        name: selectedDelivery.name,
        email: selectedDelivery.email,
        phone: selectedDelivery.phone,
        password: "",
        address: selectedDelivery.address,
        branchId: nextBranchId,
        governmentsId: selectedDelivery.governmentsId?.map(Number) ?? [],
        discountType: selectedDelivery.discountType,
        companyPercentage: Number(selectedDelivery.companyPercentage),
        isDeleted: selectedDelivery.isDeleted,
      });
      return;
    }

    previousBranchIdRef.current = 0;
    reset({
      name: "",
      email: "",
      phone: "",
      password: "",
      address: "",
      branchId: 0,
      governmentsId: [],
      discountType: "",
      companyPercentage: 0,
      isDeleted: false,
    });
  }, [selectedDelivery, reset]);

  useEffect(() => {
    if (previousBranchIdRef.current !== branchId) {
      setValue("governmentsId", [], {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    previousBranchIdRef.current = branchId;
  }, [branchId, setValue]);

  const getServerMessage = (error: unknown) => {
    if (error && typeof error === "object") {
      const errorData = "data" in error ? error.data : undefined;

      if (typeof errorData === "string") {
        return errorData;
      }

      if (errorData && typeof errorData === "object") {
        if (
          "message" in errorData &&
          typeof errorData.message === "string" &&
          errorData.message.trim()
        ) {
          return errorData.message;
        }

        if (
          "title" in errorData &&
          typeof errorData.title === "string" &&
          errorData.title.trim()
        ) {
          return errorData.title;
        }
      }

      if ("message" in error && typeof error.message === "string") {
        return error.message;
      }
    }

    return "Something went wrong while saving the delivery representative.";
  };

  const handleFormSubmit = async (values: DeliveryFormValues) => {
    const basePayload = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
      branchId: Number(values.branchId),
      governmentsId: values.governmentsId.map((id) => Number(id)),
      discountType: values.discountType,
      companyPercentage: Number(values.companyPercentage),
    };

    if (isEditing) {
      const payload: DeliveryEditRequest = {
        ...basePayload,
        isDeleted: Boolean(values.isDeleted),
      };

      if (values.password?.trim()) {
        payload.password = values.password.trim();
      }

      try {
        await onSubmit(payload);
      } catch (error) {
        const serverMessage = getServerMessage(error);

        if (serverMessage.includes("Username already taken")) {
          setError("name", {
            type: "server",
            message:
              "This name is already used as a username, please choose another.",
          });
          return;
        }

        if (
          serverMessage.includes("Email") ||
          serverMessage.includes("Sequence contains more than one element")
        ) {
          setError("email", {
            type: "server",
            message:
              "This email is already registered. Please use a different email.",
          });
          return;
        }

        toast.error(serverMessage);
      }
      return;
    }

    const payload: DeliveryCreateRequest = {
      ...basePayload,
      password: values.password?.trim() ?? "",
    };

    console.log("DEBUG - Create Delivery Payload:", payload);

    try {
      await onSubmit(payload);
    } catch (error) {
      const serverMessage = getServerMessage(error);

      if (serverMessage.includes("Username already taken")) {
        setError("name", {
          type: "server",
          message:
            "This name is already used as a username, please choose another.",
        });
        return;
      }

      if (
        serverMessage.includes("Email") ||
        serverMessage.includes("Sequence contains more than one element")
      ) {
        setError("email", {
          type: "server",
          message:
            "This email is already registered. Please use a different email.",
        });
        return;
      }

      toast.error(serverMessage);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="mx-auto max-w-4xl space-y-8 rounded-xl bg-white p-6"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="col-span-full border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-800">
            Basic Information
          </h3>
          <p className="text-xs text-gray-500">
            Delivery representative identity and contact details
          </p>
        </div>

        <InputField
          label="Full Name"
          icon={User}
          error={String(errors.name?.message || "")}
        >
          <input
            {...register("name", {
              onChange: () => clearErrors("name"),
            })}
            placeholder="Enter delivery representative name"
            className={cn(INPUT_CLASSNAME, errors.name && "border-red-500")}
          />
        </InputField>

        <InputField
          label="Email Address"
          icon={Mail}
          error={String(errors.email?.message || "")}
        >
          <input
            {...register("email", {
              onChange: () => clearErrors("email"),
            })}
            type="email"
            placeholder="name@company.com"
            className={cn(INPUT_CLASSNAME, errors.email && "border-red-500")}
          />
        </InputField>

        <InputField
          label="Phone Number"
          icon={Phone}
          error={String(errors.phone?.message || "")}
        >
          <input
            {...register("phone")}
            inputMode="numeric"
            maxLength={11}
            placeholder="01XXXXXXXXX"
            className={cn(INPUT_CLASSNAME, errors.phone && "border-red-500")}
          />
        </InputField>

        <div className="space-y-1">
          <PasswordInput
            {...register("password")}
            label={isEditing ? "Password (Optional)" : "Password"}
            placeholder={isEditing ? "Leave blank to keep current password" : "Enter password"}
            error={String(errors.password?.message || "")}
            className={cn(
              "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm transition-all outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
              errors.password && "border-red-500"
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="col-span-full border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-800">
            Coverage & Assignment
          </h3>
          <p className="text-xs text-gray-500">
            Assign one branch and the governments this representative can cover
          </p>
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-semibold text-gray-700">
            Full Address
          </label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              {...register("address")}
              placeholder="Street, building, landmark..."
              className={cn(
                INPUT_CLASSNAME,
                errors.address && "border-red-500"
              )}
            />
          </div>
          <FieldError message={String(errors.address?.message || "")} />
        </div>

        <InputField
          label="Branch"
          icon={Landmark}
          error={String(errors.branchId?.message || "")}
        >
          <select
            {...register("branchId", { valueAsNumber: true })}
            className={cn(SELECT_CLASSNAME, errors.branchId && "border-red-500")}
          >
            <option value={0}>Select branch</option>
            {branchesData?.data?.branches?.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </InputField>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            Governments
          </label>
          <Controller
            control={control}
            name="governmentsId"
            render={({ field }) => (
              <div
                className={cn(
                  "rounded-xl border bg-gray-50/70 p-4 transition-all",
                  errors.governmentsId
                    ? "border-red-500"
                    : "border-gray-200",
                  !hasSelectedBranch && "bg-gray-50"
                )}
              >
                {!hasSelectedBranch ? (
                  <p className="text-sm text-gray-400">
                    Select a branch first to load governments.
                  </p>
                ) : isFetchingGovernments ? (
                  <p className="text-sm text-gray-500">
                    Loading governments...
                  </p>
                ) : governmentsData?.length ? (
                  <div className="grid max-h-52 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                    {governmentsData.map((government: Government) => {
                      const checked = field.value?.includes(government.id);

                      return (
                        <label
                          key={government.id}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors w-fit",
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
                                : (field.value ?? []).filter(
                                    (value) => value !== government.id
                                  );

                              field.onChange(nextValues);
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
          <p className="text-xs text-gray-400">
            Choose one or more governments covered by this delivery rep.
          </p>
          <FieldError message={String(errors.governmentsId?.message || "")} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 rounded-xl border border-blue-100 bg-blue-50/30 p-4 md:grid-cols-2">
        <div className="col-span-full border-b border-blue-100 pb-2">
          <h3 className="text-lg font-semibold text-gray-800">
            Pricing & Commission
          </h3>
          <p className="text-xs text-gray-500">
            Configure the discount mode and company percentage share
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-blue-900">
            Discount Type
          </label>
          <select
            {...register("discountType")}
            className={cn(
              "w-full rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
              errors.discountType && "border-red-500"
            )}
          >
            <option value="">Select discount type</option>
            {Object.values(DISCOUNT_TYPES).map((type) => (
              <option key={type} value={type}>
                {DISCOUNT_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
          <FieldError message={String(errors.discountType?.message || "")} />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-blue-900">
            Company Percentage <span className="font-normal text-blue-400">(%)</span>
          </label>
          <input
            {...register("companyPercentage", { valueAsNumber: true })}
            type="number"
            min={0}
            max={100}
            placeholder="0"
            className={cn(
              "w-full rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
              errors.companyPercentage && "border-red-500"
            )}
          />
          <FieldError
            message={String(errors.companyPercentage?.message || "")}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 border-t pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-8 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-primary px-10 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-500/30 transition-all hover:bg-primary-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Processing..." : isEditing ? "Update Delivery" : "Create Delivery"}
        </button>
      </div>
    </form>
  );
}
