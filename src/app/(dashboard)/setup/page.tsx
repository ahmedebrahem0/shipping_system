// setup/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  CheckCircle2,
  Circle,
  ChevronLeft, 
  Plus, 
  Building2, 
  Map, 
  MapPin, 
  Store, 
  Settings2,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { useSetupWizard, SETUP_STEPS, type SetupStep } from "@/features/setup/hooks/useSetupWizard";
import BranchForm from "@/features/branches/components/BranchForm";
import GovernmentForm from "@/features/settings/governments/components/GovernmentForm";
import CityForm from "@/features/settings/cities/components/CityForm";
import MerchantFormCascading from "@/features/setup/components/MerchantFormCascading";
import type { MerchantCreateFormValues } from "@/features/merchants/schema/merchant.schema";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import { useAppSelector } from "@/store/hooks";
import { ROLES } from "@/constants/roles";
import { cn } from "@/lib/utils";

const STEP_ICONS = {
  branches: Building2,
  governments: Map,
  cities: MapPin,
  merchants: Store,
};

interface SetupTableItem {
  id: number | string;
  name: string;
  location?: string;
  branch_Id?: number;
  governmentName?: string;
  storeName?: string;
}

export default function SetupPage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === ROLES.ADMIN;

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!isAdmin) {
      toast.error("⛔ You don't have permission to access the Setup Wizard.");
      router.push("/dashboard");
    }
  }, [user, isAdmin, router]);

  const {
    currentStep,
    currentStepIndex,
    canProceed,
    isLoading,
    branches,
    governments,
    cities,
    merchants,
    hasBranches,
    hasGovernments,
    hasCities,
    hasMerchants,
    isFormOpen,
    setIsFormOpen,
    goToStep,
    goNextStep,
    goPrevStep,
    handleCreateBranch,
    handleCreateGovernment,
    handleCreateCity,
    handleCreateMerchant,
  } = useSetupWizard();

  const [createLoading] = useState(false);
  const currentStepInfo = SETUP_STEPS.find((s) => s.id === currentStep);
  const StepIcon = STEP_ICONS[currentStep as keyof typeof STEP_ICONS];
  const currentTableStepIndex = SETUP_STEPS.findIndex((step) => step.id === currentStep);

  const hasData = {
    branches: hasBranches,
    governments: hasGovernments,
    cities: hasCities,
    merchants: hasMerchants,
  };

  const currentStepData = {
    branches,
    governments,
    cities,
    merchants,
  };

  const redirectInfo: Record<SetupStep, { target: SetupStep; message: string }> = {
    branches: { target: "branches", message: "" },
    governments: { target: "branches", message: "No Branches available" },
    cities: { target: "governments", message: "No Governments available" },
    merchants: { target: "branches", message: "No Branches available" },
  };

  const showSmartRedirect = currentStep !== "branches" && !hasData[currentStep as keyof typeof hasData] && redirectInfo[currentStep as SetupStep]?.message;

  if (isLoading || !user || !isAdmin) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-20 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <PageHeader
          title="System Setup Wizard"
          description="Configuration center to get your shipping operations running"
        />
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10">
          <Settings2 size={16} className="text-primary animate-spin-slow" />
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Admin Configuration Mode</span>
        </div>
      </div>

      {/* --- Progress Stepper --- */}
      <div className="relative bg-white px-8 pb-12 pt-3 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-50">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-in-out" 
            style={{ width: `${(currentStepIndex / (SETUP_STEPS.length - 1)) * 100}%` }}
          />
        </div>
        
        <div className="relative flex justify-between items-center">
          {SETUP_STEPS.map((step, index) => {
            const Icon = STEP_ICONS[step.id as keyof typeof STEP_ICONS];
            const isActive = step.id === currentStep;
            const isCompleted = index < currentStepIndex;
            const isClickable = index <= currentStepIndex + 1;

            return (
              <div key={step.id} className="flex flex-col items-center z-10">
                <button
                  onClick={() => isClickable && goToStep(step.id as SetupStep)}
                  disabled={!isClickable}
                  className={cn(
                    "relative group flex h-14 w-14 items-center justify-center rounded-2xl border-2 transition-all duration-300",
                    isActive 
                      ? "border-primary bg-primary text-white shadow-lg shadow-primary/30 scale-110" 
                      : isCompleted 
                      ? "border-emerald-500 bg-emerald-50 text-emerald-600" 
                      : "border-primary bg-primary text-white"
                  )}
                >
                  {isCompleted ? <CheckCircle2 size={24} strokeWidth={3} /> : <Icon size={22} />}
                  
                  {/* Tooltip-style title */}
                  <span className={cn(
                    "absolute -bottom-10 whitespace-nowrap text-[11px] font-bold uppercase tracking-tighter transition-colors",
                    isActive ? "text-primary" : isCompleted ? "text-emerald-600" : "text-primary"
                  )}>
                    {step.title}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- Main Content Section --- */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden transition-all duration-500">
        <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <StepIcon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 leading-none mb-1">{currentStepInfo?.title}</h2>
              <p className="text-sm text-gray-500 font-medium">{currentStepInfo?.description}</p>
            </div>
          </div>

          {!showSmartRedirect && (
             <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-primary transition-all shadow-md active:scale-95 text-sm font-bold"
            >
              <Plus size={18} />
              Add New {currentStepInfo?.title.replace(/s$/, "")}
            </button>
          )}
        </div>

        <div className="p-8 min-h-[300px]">
          {showSmartRedirect ? (
            <div className="py-10 animate-in zoom-in-95 duration-300">
              <EmptyState
                title={redirectInfo[currentStep as SetupStep].message}
                description={`Dependencies required: You must configure ${redirectInfo[currentStep as SetupStep].target} before managing ${currentStep}.`}
                actionLabel={`Configure ${redirectInfo[currentStep as SetupStep].target} Now`}
                onAction={() => goToStep(redirectInfo[currentStep as SetupStep].target)}
              />
            </div>
          ) : (
            <div className="animate-in slide-in-from-top-4 duration-500">
              {currentStepData[currentStep as keyof typeof currentStepData].length > 0 ? (
                <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50">
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Resource Name</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                          {currentStep === "governments" ? "Linked Branch" : currentStep === "cities" ? "Linked Government" : "Secondary Info"}
                        </th>
                        <th className="px-6 py-4 text-right text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                      </tr>
                    </thead>
                      <tbody className="divide-y divide-gray-50">
                        {currentStepData[currentStep as keyof typeof currentStepData].map((item: SetupTableItem) => {
                          const isCompletedStep = currentStepIndex > currentTableStepIndex;
                          const isActiveStep = currentStepIndex === currentTableStepIndex;

                          return (
                            <tr key={item.id} className="group hover:bg-primary/5 transition-colors">
                              <td className="px-6 py-4 font-bold text-gray-800">{item.name}</td>

                              <td className="px-6 py-4 text-sm text-gray-500">
                                {currentStep === "branches"
                                  ? item.location 
                                  : currentStep === "governments"
                                    ? branches.find((b) => b.id === item.branch_Id)?.name
                                    : currentStep === "cities"
                                      ? item.governmentName
                                      : currentStep === "merchants"
                                        ? item.storeName
                                        : "-"}
                              </td>

                              {/* 3. لوجيك الـ Status الجديد والأيقونات المتغيرة */}
                              <td className="px-6 py-4 text-right">
                                {isCompletedStep ? (
                                  // حالة الخطوة المكتملة (أخضر + علامة صح)
                                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase text-emerald-700 shadow-sm">
                                    <CheckCircle2 size={10} />
                                    Confirmed
                                  </span>
                                ) : isActiveStep ? (
                                  // حالة الخطوة الحالية (أزرق + أيقونة الخطوة الأصلية بتنبض)
                                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-black uppercase text-blue-700 shadow-sm">
                                    <StepIcon size={10} className="animate-pulse" />
                                    In Progress
                                  </span>
                                ) : (
                                  // حالة الخطوات القادمة (رمادي + دائرة فارغة)
                                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[10px] font-black uppercase text-gray-400">
                                    <Circle size={10} />
                                    Pending
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                  <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                    <StepIcon size={40} />
                  </div>
                  <div className="max-w-xs">
                    <h3 className="text-gray-900 font-bold">No data found</h3>
                    <p className="text-sm text-gray-400">Start by clicking the &quot;Add New&quot; button to begin your system configuration.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- Footer Navigation --- */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={goPrevStep}
          disabled={currentStepIndex === 0}
          className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:grayscale transition-all"
        >
          <ChevronLeft size={20} />
          Previous Stage
        </button>
        
        <button
          onClick={goNextStep}
          disabled={!canProceed || currentStepIndex === SETUP_STEPS.length - 1}
          className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {currentStepIndex === SETUP_STEPS.length - 1 ? "Complete Setup" : "Continue to Next Step"}
          <ArrowRight size={20} />
        </button>
      </div>

      {/* --- Improved Form Modal --- */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsFormOpen(false)} />
          <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
            <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center gap-4">
               <div className="h-10 w-10 bg-primary text-white rounded-xl flex items-center justify-center">
                  <Plus size={20} />
               </div>
               <div>
                 <h2 className="text-xl font-black text-gray-900 tracking-tight">New {currentStepInfo?.title.replace(/s$/, "")}</h2>
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Entry Registration</p>
               </div>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {currentStep === "branches" && (
                <BranchForm
                  selectedBranch={null}
                  isLoading={createLoading}
                  onSubmit={async (values) => await handleCreateBranch(values)}
                  onCancel={() => setIsFormOpen(false)}
                />
              )}
              {currentStep === "governments" && (
                <GovernmentForm
                  selectedGovernment={null}
                  isLoading={createLoading}
                  onSubmit={async (values) => await handleCreateGovernment(values)}
                  onCancel={() => setIsFormOpen(false)}
                />
              )}
              {currentStep === "cities" && (
                <CityForm
                  selectedCity={null}
                  isLoading={createLoading}
                  onSubmit={async (values) => await handleCreateCity(values)}
                  onCancel={() => setIsFormOpen(false)}
                />
              )}
              {currentStep === "merchants" && (
                <MerchantFormCascading
                  isLoading={createLoading}
                  onSubmit={async (values: MerchantCreateFormValues) => {
                    try {
                      await handleCreateMerchant({
                        ...values,
                        specialShippingRates: values.specialShippingRates || [],
                      });
                    } catch (error) { throw error; }
                  }}
                  onCancel={() => setIsFormOpen(false)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
