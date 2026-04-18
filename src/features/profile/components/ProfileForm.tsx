// ProfileForm.tsx
// Displays profile information and allows image upload

"use client";

import { Camera, Mail, Phone, MapPin, Calendar, Shield } from "lucide-react";
import { useProfile } from "@/features/profile/hooks/useProfile";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/ErrorMessage";
import { BASE_URL } from "@/constants/api-endpoints";

const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
};

export default function ProfileForm() {
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

  if (isLoading) return <Loader />;
  if (isError || !profile) return <ErrorMessage />;

  const imageUrl = getImageUrl(profile.profileImagePath);

  return (
    <div className="space-y-6">

      {/* Profile Header */}
      <div className="bg-[#1a1f36] rounded-xl p-6 flex items-center gap-6">

        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={profile.userName}
                className="w-full h-full object-cover"
              />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>
          <button
            onClick={handleImageClick}
            disabled={isUploading}
            className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            <Camera className="w-3.5 h-3.5 text-white" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Info */}
        <div>
          <h2 className="text-xl font-bold text-white">{profile.userName}</h2>
          <p className="text-primary-400 text-sm mt-1">{profile.roles.join(", ")}</p>
          <p className="text-slate-400 text-xs mt-1">Member since {profile.createdDate}</p>
        </div>

      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-primary-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-900">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4 text-primary-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Phone</p>
              <p className="text-sm font-medium text-gray-900">{profile.phoneNumber || "—"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-primary-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Address</p>
              <p className="text-sm font-medium text-gray-900">{profile.address || "—"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-primary-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Role</p>
              <p className="text-sm font-medium text-gray-900">{profile.roles.join(", ")}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-primary-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Member Since</p>
              <p className="text-sm font-medium text-gray-900">{profile.createdDate}</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
