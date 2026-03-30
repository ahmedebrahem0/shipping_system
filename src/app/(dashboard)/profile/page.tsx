// profile/page.tsx
// User profile page with image upload and user info

"use client";

import { useState } from "react";
import { Camera, Mail, Phone, MapPin, Calendar, Shield, X } from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { BASE_URL } from "@/constants/api-endpoints";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/ErrorMessage";

const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
};

export default function ProfilePage() {
  const {
    profile,
    user,
    isLoading,
    isError,
    isUploading,
    fileInputRef,
    handleImageClick,
    handleFileChange,
  } = useProfile();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    handleFileChange(e);
  };

  const handleCancelPreview = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (isLoading) return <Loader />;
  if (isError || !profile) return <ErrorMessage />;

  const currentImageUrl = getImageUrl(profile.profileImagePath);
  const userName = profile.userName || user?.name || "User";

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="View and manage your profile information"
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Profile Header Card */}
        <div className="bg-[#1a1f36] p-8">
          <div className="flex items-start gap-8">
            {/* Profile Image */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-orange-500 flex items-center justify-center overflow-hidden border-4 border-white/20">
                {isUploading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
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
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-5xl font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Camera Button */}
              <button
                onClick={handleImageClick}
                disabled={isUploading}
                className="absolute bottom-0 right-0 w-10 h-10 bg-[#ff6b00] rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors shadow-lg disabled:opacity-50"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {/* User Info */}
            <div className="flex-1 pt-2">
              <h2 className="text-2xl font-bold text-white">{userName}</h2>
              <p className="text-orange-400 text-sm mt-1">{profile.roles.join(", ")}</p>
              <p className="text-slate-400 text-xs mt-1">Member since {profile.createdDate}</p>
            </div>
          </div>
        </div>

        {/* Preview Actions */}
        {previewUrl && (
          <div className="bg-orange-50 px-8 py-4 flex items-center justify-between border-b border-orange-100">
            <div className="flex items-center gap-3">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-12 h-12 rounded-full object-cover border-2 border-orange-200"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">New profile picture</p>
                <p className="text-xs text-gray-500">Click upload to save changes</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCancelPreview}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Profile Details */}
        <div className="p-8">
          <h3 className="text-base font-bold text-gray-900 mb-4">Profile Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm font-medium text-gray-900">{profile.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm font-medium text-gray-900">{profile.phoneNumber || "—"}</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Address</p>
                <p className="text-sm font-medium text-gray-900">{profile.address || "—"}</p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Role</p>
                <p className="text-sm font-medium text-gray-900">{profile.roles.join(", ")}</p>
              </div>
            </div>

            {/* Member Since */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Member Since</p>
                <p className="text-sm font-medium text-gray-900">{profile.createdDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
