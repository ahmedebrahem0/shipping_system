// useProfile.ts
// Handles profile data fetching and image upload

import { useRef } from "react";
import { toast } from "sonner";
import {
  useGetProfileQuery,
  useUploadProfileImageMutation,
} from "@/store/slices/api/apiSlice";
import { useAppSelector } from "@/store/hooks";

export const useProfile = () => {
  const user = useAppSelector((state) => state.auth.user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ==================== Fetch ====================
  const { data, isLoading, isError } = useGetProfileQuery(user?.id ?? "", {
    skip: !user?.id,
  });

  // ==================== Upload Image ====================
  const [uploadProfileImage, { isLoading: isUploading }] = useUploadProfileImageMutation();

  const handleImageUpload = async (file: File) => {
    if (!user?.id) return;
    try {
      const formData = new FormData();
      formData.append("imageFile", file);
      await uploadProfileImage({ id: user.id, imageFile: formData }).unwrap();
      console.log("image",file)
      toast.success("Profile image updated successfully");
    } catch {
      toast.error("Failed to upload profile image");
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  return {
    profile: data?.data,
    user,
    isLoading,
    isError,
    isUploading,
    fileInputRef,
    handleImageClick,
    handleFileChange,
  };
};