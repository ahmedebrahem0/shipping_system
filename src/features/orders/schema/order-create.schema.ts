// order-create.schema.ts
// Validation rules for order create and edit forms

import * as yup from "yup";

const egyptianPhoneRegex = /^(?:\+20|0)?1[0-2,5]{1}[0-9]{8}$/;

export const orderCreateSchema = yup.object({
  merchant_Id: yup
    .number()
    .min(1, "Please select a merchant")
    .required("Merchant is required"),

  branch_Id: yup
    .number()
    .min(1, "Please select a branch")
    .required("Branch is required"),

  government_Id: yup
    .number()
    .min(1, "Please select a government")
    .required("Government is required"),

  city_Id: yup
    .number()
    .min(1, "Please select a city")
    .required("City is required"),

  shippingType_Id: yup
    .number()
    .min(1, "Please select a shipping type")
    .required("Shipping type is required"),

  orderType: yup
    .string()
    .required("Order type is required"),

  clientName: yup
    .string()
    .max(100, "Name must be at most 100 characters")
    .required("Client name is required"),

  clientPhone1: yup
    .string()
    .matches(egyptianPhoneRegex, "Please enter a valid Egyptian phone number")
    .required("Phone is required"),

  clientPhone2: yup
    .string()
    .matches(egyptianPhoneRegex, "Please enter a valid Egyptian phone number")
    .nullable()
    .optional(),

  clientEmail: yup
    .string()
    .email("Please enter a valid email")
    .nullable()
    .optional(),

  clientAddress: yup
    .string()
    .max(200, "Address must be at most 200 characters")
    .required("Address is required"),

  deliverToVillage: yup
    .boolean()
    .default(false),

  paymentType: yup
    .string()
    .required("Payment type is required"),

  orderCost: yup
    .number()
    .min(0, "Cost must be a positive number")
    .required("Order cost is required"),

  orderTotalWeight: yup
    .number()
    .min(0, "Weight must be a positive number")
    .optional(),

  merchantNotes: yup
    .string()
    .max(250)
    .nullable()
    .optional(),

  employeeNotes: yup
    .string()
    .max(250)
    .nullable()
    .optional(),

  deliveryNotes: yup
    .string()
    .max(250)
    .nullable()
    .optional(),

  products: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required("Product name is required"),
        quantity: yup.number().min(1, "Quantity must be at least 1").required("Quantity is required"),
        itemWeight: yup.number().min(0.1, "Weight must be at least 0.1").required("Weight is required"),
      })
    )
    .min(1, "Please add at least one product")
    .required("Products are required"),
});

export type OrderCreateFormValues = yup.InferType<typeof orderCreateSchema>;