// useCities.ts
// Handles all city operations - fetch, create, update, delete

import { useState } from "react";
import { toast } from "sonner";
import {
  useGetCitiesQuery,
  useCreateCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
} from "@/store/slices/api/apiSlice";
import type { CityFormValues } from "@/features/settings/cities/schema/city.schema";
import type { City } from "@/types/city.types";

export const useCities = () => {
  const [page, setPage] = useState(1);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ==================== Fetch ====================
  const { data, isLoading, isError } = useGetCitiesQuery({ page, pageSize: 10 });

  // ==================== Create ====================
  const [createCity, { isLoading: isCreating }] = useCreateCityMutation();

  const handleCreate = async (values: CityFormValues) => {
    try {
      await createCity({
        name: values.name,
        government_Id: values.government_Id,
        pickupShipping: values.pickupShipping ?? undefined,
        standardShipping: values.standardShipping,
      }).unwrap();
      toast.success("City created successfully");
      setIsFormOpen(false);
    } catch {
      toast.error("Failed to create city");
    }
  };

  // ==================== Update ====================
  const [updateCity, { isLoading: isUpdating }] = useUpdateCityMutation();

  const handleUpdate = async (values: CityFormValues) => {
    if (!selectedCity) return;
    try {
      await updateCity({
        id: selectedCity.id,
        data: {
          name: values.name,
          government_Id: values.government_Id,
          pickupShipping: values.pickupShipping ?? undefined,
          standardShipping: values.standardShipping,
          isDeleted: false,
        },
      }).unwrap();
      toast.success("City updated successfully");
      setIsFormOpen(false);
      setSelectedCity(null);
    } catch {
      toast.error("Failed to update city");
    }
  };

  // ==================== Delete ====================
  const [deleteCity, { isLoading: isDeleting }] = useDeleteCityMutation();

  const handleDelete = async () => {
    if (!selectedCity) return;
    try {
      await deleteCity(selectedCity.id).unwrap();
      toast.success("City deleted successfully");
      setIsDeleteOpen(false);
      setSelectedCity(null);
    } catch {
      toast.error("Failed to delete city");
    }
  };

  // ==================== Helpers ====================
  const openCreate = () => {
    setSelectedCity(null);
    setIsFormOpen(true);
  };

  const openEdit = (city: City) => {
    setSelectedCity(city);
    setIsFormOpen(true);
  };

  const openDelete = (city: City) => {
    setSelectedCity(city);
    setIsDeleteOpen(true);
  };

  return {
    // Data
    cities: data?.data?.cities ?? [],
    totalCities: data?.data?.totalCitiess ?? 0,
    page,
    isLoading,
    isError,

    // Pagination
    setPage,

    // Form
    isFormOpen,
    setIsFormOpen,
    selectedCity,

    // Delete Dialog
    isDeleteOpen,
    setIsDeleteOpen,

    // Actions
    handleCreate,
    handleUpdate,
    handleDelete,
    openCreate,
    openEdit,
    openDelete,

    // Loading States
    isCreating,
    isUpdating,
    isDeleting,
  };
};