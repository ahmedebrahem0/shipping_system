// ProfileImageUpload.tsx
// Profile picture upload component with preview

"use client";

import { useState, useRef } from "react";
import { Camera, Upload, X } from "lucide-react";
import { toast } from "sonner";
import {
  useGetProfileQuery,
  useUploadProfileImageMutation,
} from "@/store/slices/api/apiSlice";
import { useAppSelector } from "@/store/hooks";
import Loader from "@/components/common/Loader";
import { getAssetUrl } from "@/lib/api/asset-url";

export default function ProfileImageUpload() {
  const user = useAppSelector((state) => state.auth.user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: profileData } = useGetProfileQuery(user?.id ?? "", {
    skip: !user?.id,
  });

  const [uploadProfileImage, { isLoading: isUploading }] =
    useUploadProfileImageMutation();

  const currentImageUrl = getAssetUrl(profileData?.data?.profileImagePath ?? "");
  const userName = profileData?.data?.userName ?? user?.name ?? "User";

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file || !user?.id) return;

    try {
      const formData = new FormData();
      formData.append("imageFile", file);
      await uploadProfileImage({ id: user.id, imageFile: formData }).unwrap();
      toast.success("Profile image updated successfully");
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      toast.error("Failed to upload profile image");
    }
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!user) {
    return <Loader />;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-base font-bold text-gray-900 mb-4">
        Profile Picture
      </h3>

      <div className="flex flex-col items-center">
        {/* Current Image / Preview */}
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden border-4 border-primary-200">
            {isUploading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : currentImageUrl ? (
              <img
                src={currentImageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-primary-500 text-4xl font-bold">
                {userName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Camera Button */}
          {!previewUrl && !isUploading && (
            <button
              onClick={handleClick}
              className="absolute bottom-0 right-0 w-10 h-10 bg-[primary] rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors shadow-lg"
            >
              <Camera className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Preview Actions */}
        {previewUrl && !isUploading && (
          <div className="flex gap-3">
            <button
              onClick={handleUpload}
              className="flex items-center gap-2 px-4 py-2 bg-[primary] text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}

        {/* Help Text */}
        {!previewUrl && !isUploading && (
          <p className="text-sm text-gray-500 mt-2">
            Click the camera icon to upload a new profile picture
          </p>
        )}

        {/* Loading Text */}
        {isUploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
      </div>
    </div>
  );
}
