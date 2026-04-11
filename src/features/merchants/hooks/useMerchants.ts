import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  useGetMerchantsQuery, 
  useCreateMerchantMutation, 
  useUpdateMerchantMutation, 
  useDeleteMerchantMutation 
} from "@/store/slices/api/apiSlice";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner"; // استيراد sonner

export function useMerchants() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  
  // Mutations
  const [createMerchant, { isLoading: isCreating }] = useCreateMerchantMutation();
  const [updateMerchant, { isLoading: isUpdating }] = useUpdateMerchantMutation();
  const [deleteMerchant, { isLoading: isDeleting }] = useDeleteMerchantMutation();

  // States for Delete Modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<any>(null);

  // Helper to parse and display API errors
  const showApiErrors = (error: any) => {
    const errorData = error?.response?.data || error?.data;
    
    // Check for validation errors array
    if (errorData?.errors) {
      const errors = errorData.errors;
      Object.keys(errors).forEach((key) => {
        const messages = errors[key];
        if (Array.isArray(messages)) {
          messages.forEach((msg: string) => {
            toast.error(`${key}: ${msg}`, { position: "top-center" });
          });
        } else {
          toast.error(`${key}: ${messages}`, { position: "top-center" });
        }
      });
      return;
    }
    
    // Check for single error message
    if (errorData?.title) {
      toast.error(errorData.title, { position: "top-center" });
      return;
    }
    
    if (errorData?.message) {
      toast.error(errorData.message, { position: "top-center" });
      return;
    }

    // Fallback
    toast.error("Something went wrong. Please try again.", { position: "top-center" });
    console.log("err",errorData)
  };

  // 1. دالة تنظيف وتنسيق البيانات (The Payload Fix)
  const formatPayload = (values: any, originalValues: any, isUpdate: boolean = false) => {
    const payload: Record<string, unknown> = {};

    // Only include changed fields for update
    if (isUpdate && originalValues) {
      const fieldsToCheck = [
        'name', 'email', 'phone', 'address', 'storeName', 
        'government', 'city', 'pickupCost', 'rejectedOrderPercentage', 'branches_Id'
      ];
      
      fieldsToCheck.forEach((field) => {
        if (values[field] !== originalValues[field]) {
          payload[field] = values[field];
        }
      });
    } else {
      // For create: include all fields
      payload.name = values.name;
      payload.email = values.email;
      payload.phone = values.phone;
      payload.address = values.address;
      payload.storeName = values.storeName || "";
      payload.government = values.government;
      payload.city = values.city;
      payload.pickupCost = Number(values.pickupCost);
      payload.rejectedOrderPercentage = Number(values.rejectedOrderPercentage) || 0;
      payload.branches_Id = values.branches_Id ? [Number(values.branches_Id)] : [];
    }

    // Always include these for API requirements
    payload.specialShippingRates = [];
    payload.merchantFromReq = true;

    if (isUpdate) {
      // API requires password fields and isDeleted
      payload.currentPassword = values.currentPassword || "";
      payload.newPassword = values.newPassword || "";
      payload.confirmNewPassword = values.confirmNewPassword || "";
      payload.isDeleted = false;
    } else {
      // For create: include password fields
      payload.password = values.password;
      payload.confirmPassword = values.confirmPassword;
    }

    return payload;
  };

  // 2. دالة الإنشاء
  const handleCreate = async (values: any) => {
    try {
      const payload = formatPayload(values, null, false);
      await createMerchant(payload as any).unwrap();
      toast.success("Merchant created successfully!", { position: "top-center" });
      router.push(ROUTES.MERCHANTS);
    } catch (error: any) {
      showApiErrors(error);
    }
  };

  // 3. دالة التعديل
  const handleUpdate = async (id: number, values: any, originalValues?: any) => {
    try {
      const payload = formatPayload(values, originalValues, true);
      
      await updateMerchant({ id, data: payload as any }).unwrap();
      toast.success("Merchant updated successfully!", { position: "top-center" });
      router.push(ROUTES.MERCHANTS);
    } catch (error: any) {
      showApiErrors(error);
    }
  };

  // 4. دالة الحذف
  const openDelete = (merchant: any) => {
    setSelectedMerchant(merchant);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedMerchant) return;
    try {
      await deleteMerchant(selectedMerchant.id).unwrap();
      toast.success("Merchant deleted successfully");
      setIsDeleteOpen(false);
    } catch (error: any) {
      toast.error("Error deleting merchant");
    }
  };

  // Queries
  const { data, isLoading, isError } = useGetMerchantsQuery({ page, pageSize: 10 });
  const merchants = data?.data?.merchants?.filter((m) => !m.isDeleted) || [];
  const totalMerchants = data?.data?.totalMerchants || 0;

  return {
    merchants,
    totalMerchants,
    page,
    isLoading,
    isError,
    handleCreate,
    handleUpdate,
    handleDelete,
    openDelete,
    isCreating,
    isUpdating,
    isDeleting,
    isDeleteOpen,
    setIsDeleteOpen,
    selectedMerchant,
    setPage,
  };
}