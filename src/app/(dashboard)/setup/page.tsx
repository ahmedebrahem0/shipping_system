// setup/page.tsx
// Smart Admin Setup Wizard - Guided step-by-step system setup

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, ChevronLeft, Plus, Building2, Map, MapPin, Store } from "lucide-react";
import { toast } from "sonner";
import { useSetupWizard, SETUP_STEPS, type SetupStep } from "@/features/setup/hooks/useSetupWizard";
import BranchForm from "@/features/branches/components/BranchForm";
import GovernmentForm from "@/features/settings/governments/components/GovernmentForm";
import CityForm from "@/features/settings/cities/components/CityForm";
import MerchantFormCascading from "@/features/setup/components/MerchantFormCascading";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import { useAppSelector } from "@/store/hooks";
import { ROLES } from "@/constants/roles";
import type { BranchFormValues } from "@/features/branches/schema/branch.schema";
import type { GovernmentFormValues } from "@/features/settings/governments/schema/government.schema";
import type { CityFormValues } from "@/features/settings/cities/schema/city.schema";
import type { MerchantCreateFormValues } from "@/features/merchants/schema/merchant.schema";

const STEP_ICONS = {
  branches: Building2,
  governments: Map,
  cities: MapPin,
  merchants: Store,
};

export default function SetupPage() {
  const router = useRouter();
  const [formValues] = useState<Record<string, unknown>>({});

  // Get user from Redux store
  const { user } = useAppSelector((state) => state.auth);

  // Check if user is admin
  const isAdmin = user?.role === ROLES.ADMIN;

  // Route guard - only allow Admin role
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

  // Redirect if not admin
  if (!user || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  // Hooks must be called before any conditional returns (rules of hooks)
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
    markStepCompleted,
  } = useSetupWizard();

  const [createLoading] = useState(false);

  const currentStepInfo = SETUP_STEPS.find((s) => s.id === currentStep);
  const StepIcon = STEP_ICONS[currentStep];

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

  const handleSmartRedirect = (targetStep: SetupStep) => {
    goToStep(targetStep);
  };

  const redirectInfo: Record<SetupStep, { target: SetupStep; message: string }> = {
    branches: {
      target: "branches",
      message: "",
    },
    governments: {
      target: "branches",
      message: "No Branches yet. Add Branch First",
    },
    cities: {
      target: "governments",
      message: "No Governments yet. Add Government First",
    },
    merchants: {
      target: "branches",
      message: "No Branches yet. Add Branch First",
    },
  };

  const showSmartRedirect = currentStep !== "branches" && !hasData[currentStep] && redirectInfo[currentStep]?.message;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <PageHeader
        title="System Setup Wizard"
        description="Follow the steps to set up your shipping system"
      />

      {/* Stepper */}
      <div className="mt-6 card">
        <div className="flex items-center justify-between">
          {SETUP_STEPS.map((step, index) => {
            const Icon = STEP_ICONS[step.id];
            const isActive = step.id === currentStep;
            const isCompleted = currentStepIndex > index || (index === 0 ? hasBranches : 
              index === 1 ? hasGovernments : 
              index === 2 ? hasCities : hasMerchants);
            const isClickable = index <= currentStepIndex + 1;

            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => isClickable && goToStep(step.id)}
                  disabled={!isClickable}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : isCompleted
                      ? "bg-emerald-50 text-emerald-600"
                      : isClickable
                      ? "text-gray-500 hover:bg-gray-50"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                >
                  {isCompleted && !isActive ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                  <span className="text-xs font-medium">{step.title}</span>
                </button>
                {index < SETUP_STEPS.length - 1 && (
                  <ChevronRight
                    className={`w-5 h-5 mx-2 ${
                      currentStepIndex > index ? "text-emerald-500" : "text-gray-300"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="mt-6 card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <StepIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {currentStepInfo?.title}
              </h2>
              <p className="text-sm text-gray-500">
                {currentStepInfo?.description}
              </p>
            </div>
          </div>
        </div>

        {/* Smart Redirect Empty State */}
        {showSmartRedirect && (
          <EmptyState
            title={redirectInfo[currentStep].message}
            description={`You need to create ${redirectInfo[currentStep].target} before adding ${currentStep}.`}
            actionLabel={`Add ${redirectInfo[currentStep].target.charAt(0).toUpperCase() + redirectInfo[currentStep].target.slice(1)} First`}
            onAction={() => handleSmartRedirect(redirectInfo[currentStep].target)}
          />
        )}

        {/* Data Table or Add Button */}
        {!showSmartRedirect && (
          <>
            {currentStepData[currentStep].length > 0 ? (
              <div className="space-y-3">
              <div className="flex justify-end">
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="btn btn-primary"
                >
                  <Plus className="w-4 h-4" />
                  Add Another
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {currentStep === "governments" ? "Branch" : currentStep === "cities" ? "Government" : "Details"}
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentStepData[currentStep].map((item: unknown) => (
                      <tr key={(item as { id: number }).id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {(item as { name: string }).name}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {currentStep === "governments"
                            ? branches.find((b) => b.id === (item as { branch_Id: number }).branch_Id)?.name
                            : currentStep === "cities"
                            ? (item as { governmentName: string }).governmentName
                            : currentStep === "merchants"
                            ? (item as { storeName: string }).storeName
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setIsFormOpen(true)}
                            className="text-primary hover:text-primary/80 text-sm font-medium"
                          >
                            Add Another
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  No {currentStep} created yet. Get started by adding your first one.
                </p>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="btn btn-primary"
                >
                  <Plus className="w-4 h-4" />
                  Add {currentStepInfo?.title.replace(/s$/, "")}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={goPrevStep}
          disabled={currentStepIndex === 0}
          className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        
        <button
          onClick={goNextStep}
          disabled={!canProceed || currentStepIndex === SETUP_STEPS.length - 1}
          className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsFormOpen(false)}
          />
          <div className="relative card w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto animate-fade-in">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Add {currentStepInfo?.title.replace(/s$/, "")}
            </h2>
            
            {currentStep === "branches" && (
              <BranchForm
                selectedBranch={null}
                isLoading={createLoading}
                onSubmit={async (values) => {
                  await handleCreateBranch(values);
                }}
                onCancel={() => setIsFormOpen(false)}
              />
            )}
            
            {currentStep === "governments" && (
              <GovernmentForm
                selectedGovernment={null}
                isLoading={createLoading}
                onSubmit={async (values) => {
                  await handleCreateGovernment(values);
                }}
                onCancel={() => setIsFormOpen(false)}
              />
            )}
            
            {currentStep === "cities" && (
              <CityForm
                selectedCity={null}
                isLoading={createLoading}
                onSubmit={async (values) => {
                  await handleCreateCity(values);
                }}
                onCancel={() => setIsFormOpen(false)}
              />
            )}
            
            {currentStep === "merchants" && (
              <MerchantFormCascading
                isLoading={createLoading}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onSubmit={async (values: any) => {
                  console.log("📝 Submitting Merchant form data:", values);
                  console.log("📋 branches_Id (array):", values.branches_Id);
                  try {
                    await handleCreateMerchant({
                      name: values.name,
                      email: values.email,
                      password: values.password,
                      confirmPassword: values.confirmPassword,
                      phone: values.phone,
                      address: values.address,
                      storeName: values.storeName,
                      government: values.government,
                      city: values.city,
                      pickupCost: values.pickupCost,
                      rejectedOrderPercentage: values.rejectedOrderPercentage,
                      branches_Id: values.branches_Id,
                      specialShippingRates: values.specialShippingRates || [],
                    });
                  } catch (error) {
                    console.error("❌ Failed to create merchant:", error);
                    throw error;
                  }
                }}
                onCancel={() => setIsFormOpen(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}