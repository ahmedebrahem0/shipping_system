// useSetupWizard.ts
// Smart Admin Setup Wizard hook with smart redirect logic and success callbacks

import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  useGetBranchesQuery,
  useCreateBranchMutation,
} from "@/store/slices/api/apiSlice";
import {
  useGetGovernmentsQuery,
  useCreateGovernmentMutation,
} from "@/store/slices/api/apiSlice";
import {
  useGetCitiesQuery,
  useCreateCityMutation,
} from "@/store/slices/api/apiSlice";
import {
  useGetMerchantsQuery,
  useCreateMerchantMutation,
} from "@/store/slices/api/apiSlice";
import type { BranchFormValues } from "@/features/branches/schema/branch.schema";
import type { GovernmentFormValues } from "@/features/settings/governments/schema/government.schema";
import type { CityFormValues } from "@/features/settings/cities/schema/city.schema";
import type { MerchantCreateFormValues } from "@/features/merchants/schema/merchant.schema";

export type SetupStep = "branches" | "governments" | "cities" | "merchants";

export interface StepInfo {
  id: SetupStep;
  title: string;
  description: string;
  dependsOn?: SetupStep;
}

export const SETUP_STEPS: StepInfo[] = [
  { id: "branches", title: "Branches", description: "Create your branches" },
  { id: "governments", title: "Governments", description: "Add governments linked to branches", dependsOn: "branches" },
  { id: "cities", title: "Cities", description: "Add cities linked to governments", dependsOn: "governments" },
  { id: "merchants", title: "Merchants", description: "Add merchants linked to branches", dependsOn: "branches" },
];

const STEP_ORDER: SetupStep[] = ["branches", "governments", "cities", "merchants"];

export interface UseSetupWizardReturn {
  currentStep: SetupStep;
  currentStepIndex: number;
  canProceed: boolean;
  isLoading: boolean;
  
  // Data
  branches: { id: number; name: string; isDeleted: boolean }[];
  governments: { id: number; name: string; branch_Id: number; isDeleted: boolean }[];
  cities: { id: number; name: string; governmentName: string; isDeleted: boolean }[];
  merchants: { id: number; name: string; isDeleted: boolean }[];
  
  // Smart empty state checks
  hasBranches: boolean;
  hasGovernments: boolean;
  hasCities: boolean;
  hasMerchants: boolean;
  
  // Redirect targets (which step to redirect to if parent is missing)
  redirectToStep: SetupStep | null;
  redirectReason: string;
  
  // Form states
  isFormOpen: boolean;
  setIsFormOpen: (open: boolean) => void;
  
  // Actions
  goToStep: (step: SetupStep) => void;
  goNextStep: () => void;
  goPrevStep: () => void;
  
  // CRUD
  handleCreateBranch: (values: BranchFormValues) => Promise<void>;
  handleCreateGovernment: (values: GovernmentFormValues) => Promise<void>;
  handleCreateCity: (values: CityFormValues) => Promise<void>;
  handleCreateMerchant: (values: MerchantCreateFormValues) => Promise<void>;
  
  // Mark step as completed (used after successful creation)
  markStepCompleted: () => void;
  
  // Completed steps tracking
  completedSteps: Set<SetupStep>;
}

export const useSetupWizard = (): UseSetupWizardReturn => {
  const [currentStep, setCurrentStep] = useState<SetupStep>("branches");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<SetupStep>>(new Set());
  const [redirectToStep, setRedirectToStep] = useState<SetupStep | null>(null);
  const [redirectReason, setRedirectReason] = useState("");

  const currentStepIndex = STEP_ORDER.indexOf(currentStep);

  // ==================== Fetch Data ====================
  const { data: branchesData, isLoading: isLoadingBranches } = useGetBranchesQuery({ pageSize: 100 });
  const { data: governmentsData, isLoading: isLoadingGovernments } = useGetGovernmentsQuery({ pageSize: 100 });
  const { data: citiesData, isLoading: isLoadingCities } = useGetCitiesQuery({ pageSize: 100 });
  const { data: merchantsData, isLoading: isLoadingMerchants } = useGetMerchantsQuery({ pageSize: 100 });

  // ==================== Mutations ====================
  const [createBranch] = useCreateBranchMutation();
  const [createGovernment] = useCreateGovernmentMutation();
  const [createCity] = useCreateCityMutation();
  const [createMerchant] = useCreateMerchantMutation();

  // ==================== Filter Active Records ====================
  const branches = useMemo(
    () => branchesData?.data?.branches?.filter((b) => !b.isDeleted) ?? [],
    [branchesData?.data?.branches]
  );

  const governments = useMemo(
    () => governmentsData?.governments?.filter((g) => !g.isDeleted) ?? [],
    [governmentsData?.governments]
  );

  const cities = useMemo(
    () => citiesData?.data?.cities?.filter((c) => !c.isDeleted) ?? [],
    [citiesData?.data?.cities]
  );

  const merchants = useMemo(
    () => merchantsData?.data?.merchants?.filter((m) => !m.isDeleted) ?? [],
    [merchantsData?.data?.merchants]
  );

  // ==================== Check if parent exists ====================
  const hasBranches = branches.length > 0;
  const hasGovernments = governments.length > 0;
  const hasCities = cities.length > 0;
  const hasMerchants = merchants.length > 0;

  const isLoading = isLoadingBranches || isLoadingGovernments || isLoadingCities || isLoadingMerchants;

  // ==================== Smart Redirect Logic ====================
  const checkAndSetRedirect = useCallback((step: SetupStep) => {
    switch (step) {
      case "governments":
        if (!hasBranches) {
          setRedirectToStep("branches");
          setRedirectReason("No Branches yet. Add Branch First");
        }
        break;
      case "cities":
        if (!hasGovernments) {
          setRedirectToStep("governments");
          setRedirectReason("No Governments yet. Add Government First");
        }
        break;
      default:
        setRedirectToStep(null);
        setRedirectReason("");
    }
  }, [hasBranches, hasGovernments]);

  // ==================== Navigation ====================
  const goToStep = useCallback((step: SetupStep) => {
    checkAndSetRedirect(step);
    setCurrentStep(step);
    setRedirectToStep(null);
    setRedirectReason("");
  }, [checkAndSetRedirect]);

  const goNextStep = useCallback(() => {
    if (currentStepIndex < STEP_ORDER.length - 1) {
      const nextStep = STEP_ORDER[currentStepIndex + 1];
      goToStep(nextStep);
    }
  }, [currentStepIndex, goToStep]);

  const goPrevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      const prevStep = STEP_ORDER[currentStepIndex - 1];
      setCurrentStep(prevStep);
    }
  }, [currentStepIndex]);

  // ==================== Mark Step as Completed ====================
  const markStepCompleted = useCallback(() => {
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
  }, [currentStep]);

  // ==================== Can Proceed Check ====================
  const canProceed = useMemo(() => {
    if (completedSteps.has(currentStep)) return true;
    
    switch (currentStep) {
      case "branches":
        return hasBranches;
      case "governments":
        return hasGovernments;
      case "cities":
        return hasCities;
      case "merchants":
        return hasMerchants;
      default:
        return false;
    }
  }, [currentStep, hasBranches, hasGovernments, hasCities, hasMerchants, completedSteps]);

  // ==================== CRUD Handlers with Success Toast ====================
  const handleCreateBranch = useCallback(async (values: BranchFormValues) => {
    try {
      await createBranch(values).unwrap();
      toast.success(`✅ Branch '${values.name}' created successfully. You can now add Governments.`);
      markStepCompleted();
      setIsFormOpen(false);
      // Auto-advance to next step after success (only if not last step)
      if (currentStepIndex < STEP_ORDER.length - 1) {
        setTimeout(() => goNextStep(), 1500);
      }
    } catch (error) {
      console.error("❌ Failed to create branch:", error);
      toast.error("Failed to create branch");
      throw error;
    }
  }, [createBranch, markStepCompleted, goNextStep, currentStepIndex]);

  const handleCreateGovernment = useCallback(async (values: GovernmentFormValues) => {
    try {
      await createGovernment(values).unwrap();
      toast.success(`✅ Government '${values.name}' created successfully. You can now add Cities.`);
      markStepCompleted();
      setIsFormOpen(false);
      // Auto-advance to next step after success (only if not last step)
      if (currentStepIndex < STEP_ORDER.length - 1) {
        setTimeout(() => goNextStep(), 1500);
      }
    } catch (error) {
      console.error("❌ Failed to create government:", error);
      toast.error("Failed to create government");
      throw error;
    }
  }, [createGovernment, markStepCompleted, goNextStep, currentStepIndex]);

  const handleCreateCity = useCallback(async (values: CityFormValues) => {
    try {
      await createCity({
        name: values.name,
        government_Id: values.government_Id,
        standardShipping: values.standardShipping ?? undefined,
        pickupShipping: values.pickupShipping ?? undefined,
      }).unwrap();
      toast.success(`✅ City '${values.name}' created successfully.`);
      markStepCompleted();
      setIsFormOpen(false);
      // Auto-advance to next step after success (only if not last step)
      if (currentStepIndex < STEP_ORDER.length - 1) {
        setTimeout(() => goNextStep(), 1500);
      }
    } catch (error) {
      console.error("❌ Failed to create city:", error);
      toast.error("Failed to create city");
      throw error;
    }
  }, [createCity, markStepCompleted, goNextStep, currentStepIndex]);

  const handleCreateMerchant = useCallback(async (values: MerchantCreateFormValues) => {
    console.log("📤 Merchant API Request:", values);
    try {
      const branchesId = values.branches_Id;
      const processedBranchesId = Array.isArray(branchesId) 
        ? branchesId as unknown as number[]
        : branchesId 
          ? [branchesId as unknown as number] 
          : undefined;
      
      const apiPayload = {
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
        branches_Id: processedBranchesId,
      };
      
      console.log("📤 Sending to API:", apiPayload);
      
      await createMerchant(apiPayload).unwrap();
      toast.success(` Merchant '${values.name}' created successfully.`);
      markStepCompleted();
      setIsFormOpen(false);
    } catch (error) {
      console.error("❌ Merchant creation failed:",error);
      toast.error("Failed to create merchant");
      throw error;
    }
  }, [createMerchant, markStepCompleted]);

  return {
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
    
    redirectToStep,
    redirectReason,
    
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
    completedSteps,
  };
};