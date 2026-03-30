// useSettings.ts
// Handles general settings operations - fetch, create, update

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import {
  useGetSettingsQuery,
  useCreateSettingMutation,
  useUpdateSettingMutation,
} from "@/store/slices/api/apiSlice";
import {
  settingsSchema,
  type SettingsFormValues,
} from "@/features/settings/general/schema/settings.schema";

export const useSettings = () => {
  const { data, isLoading, isError } = useGetSettingsQuery();

  const setting = data?.data?.[0];
  const isExisting = !!setting;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: yupResolver(settingsSchema),
  });

  useEffect(() => {
    if (setting) {
      reset({
        shippingToVillageCost: setting.shippingToVillageCost,
        deliveryAutoAccept: setting.deliveryAutoAccept,
      });
    }
  }, [setting, reset]);

  const [createSetting, { isLoading: isCreating }] = useCreateSettingMutation();
  const [updateSetting, { isLoading: isUpdating }] = useUpdateSettingMutation();

  const onSubmit = async (values: SettingsFormValues) => {
    try {
      if (isExisting && setting) {
        await updateSetting({ id: setting.id, data: values }).unwrap();
        toast.success("Settings updated successfully");
      } else {
        await createSetting(values).unwrap();
        toast.success("Settings created successfully");
      }
    } catch {
      toast.error("Failed to save settings");
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isLoading,
    isError,
    isExisting,
    isSaving: isCreating || isUpdating,
  };
};