"use client";

import { useState } from "react";
import { Camera, Mail, Phone, MapPin, Calendar, Shield, X } from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { BASE_URL } from "@/constants/api-endpoints";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/ErrorMessage";
import { cn } from "@/lib/utils/cn";

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
    <div className="min-h-screen bg-slate-50 p-4 animate-in fade-in duration-700 dark:bg-[#0e1227] lg:p-8">
      <PageHeader
        title="Account Settings"
        description="Manage your professional presence and personal details"
      />

      <div className="max-w-5xl mx-auto mt-8">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white/90 shadow-2xl backdrop-blur-xl dark:border-white/5 dark:bg-[#0a1120]/50">
          
          {/* Cover/Header Background */}
          <div className="h-48 border-b border-slate-200 bg-gradient-to-r from-sky-100 via-indigo-100 to-violet-100 dark:border-white/5 dark:from-blue-600/20 dark:via-indigo-600/20 dark:to-violet-600/20" />

          {/* Profile Header Content */}
          <div className="relative px-8 pb-8">
            <div className="flex flex-col md:flex-row items-end gap-6 -mt-16">
              {/* Profile Image Wrapper */}
              <div className="relative group">
                <div className="h-40 w-40 overflow-hidden rounded-[2.5rem] border-4 border-white bg-slate-200 p-1 shadow-2xl dark:border-[#020617] dark:bg-[#0f172a]">
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[2.2rem] bg-slate-100 dark:bg-slate-800">
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : currentImageUrl ? (
                      <img src={currentImageUrl} alt={userName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-6xl font-black text-slate-800 dark:text-white">
                        {userName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={handleImageClick}
                  disabled={isUploading}
                  className="absolute bottom-2 right-2 flex h-12 w-12 items-center justify-center rounded-2xl border-4 border-white bg-sky-500 text-white shadow-xl transition-all hover:scale-110 hover:bg-sky-400 active:scale-95 disabled:opacity-50 dark:border-[#020617]"
                >
                  <Camera className="w-5 h-5" />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              {/* Basic Info */}
              <div className="flex-1 mb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{userName}</h2>
                    {profile.roles.includes("Admin") && (
                        <span className="px-3 py-1 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-black uppercase rounded-lg tracking-widest">Verified Admin</span>
                    )}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 text-sm font-bold">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    {profile.roles.join(" • ")}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-bold">
                    <Calendar className="w-4 h-4 text-violet-500" />
                    Joined {profile.createdDate}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Banner */}
            {previewUrl && (
              <div className="mt-8 flex items-center justify-between rounded-3xl border border-sky-500/20 bg-sky-500/10 p-4 animate-in slide-in-from-top-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-sky-500/30">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">New Profile Picture</p>
                    <p className="text-xs font-medium text-sky-600 dark:text-sky-400">Changes are ready to be saved</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleCancelPreview} className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-white/60 dark:text-slate-400 dark:hover:bg-white/5">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Info Grid */}
            <div className="mt-12">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-6 w-1 bg-sky-500 rounded-full" />
                <h3 className="text-lg font-black italic tracking-tight text-slate-900 dark:text-white">Personal Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Official Email", value: profile.email, icon: Mail, color: "text-blue-400", bg: "bg-blue-400/5" },
                  { label: "Phone Number", value: profile.phoneNumber || "Not Provided", icon: Phone, color: "text-emerald-400", bg: "bg-emerald-400/5" },
                  { label: "Primary Address", value: profile.address || "No Address Set", icon: MapPin, color: "text-rose-400", bg: "bg-rose-400/5" },
                  { label: "Account Security", value: "Standard Protection", icon: Shield, color: "text-violet-400", bg: "bg-violet-400/5" },
                ].map((item, i) => (
                  <div key={i} className="group rounded-[2rem] border border-slate-200 bg-slate-50 p-5 transition-all hover:border-slate-300 hover:bg-white dark:border-white/5 dark:bg-white/[0.02] dark:hover:border-white/10 dark:hover:bg-white/[0.04]">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", item.bg, item.color)}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-500">{item.label}</p>
                        <p className="mt-0.5 font-bold text-slate-900 dark:text-white">{item.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Action */}
            <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 dark:border-white/5 sm:flex-row">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-500">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest">Account Status: Active</span>
                </div>
                <div className="text-[10px] font-medium text-slate-500 dark:text-slate-500">
                    Last activity: {new Date().toLocaleDateString()}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
