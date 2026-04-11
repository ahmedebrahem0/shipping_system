# Shipping Management System - Full Context & Logic Rules

## 🏗 System Philosophy & Data Hierarchy

The system is built on **strict hierarchical data integrity** to prevent orphan records.

### Hierarchy Structure

- **Branch** → Root level (The foundation of the system)
- **Government** → Linked to one Branch via `branch_Id` (Foreign Key)
- **City** → Strictly linked to one Government via `government_Id` (Foreign Key)
- **Merchant** → Associated with one or more Branches via `branchsNames` (string field)
- **Order** → The main operational entity

**Golden Rule**: Never allow "orphan" records (e.g., a City without a Government, or a Government without a Branch).

---

## 👥 User Roles & UX Patterns

### 1. Admin Role (The Builder)

**Philosophy**:  
"Build the foundation correctly before allowing operations."

**UI Pattern**: **Smart Step-by-Step Wizard**

**Creation Sequence (Mandatory Order):**

| Step | Page / Action              | What to Create                  | Depends On                  | Notes |
|------|---------------------------|---------------------------------|-----------------------------|-------|
| 1    | Branches                  | Create Branches                 | -                           | Must be created first |
| 2    | Governments               | Create Governments              | Branch (`branch_Id`)        | Must select a Branch |
| 3    | Cities                    | Create Cities                   | Government (`government_Id`) | Must select a Government |
| 4    | Merchants                 | Create Merchants                | Branch (`branchsNames`)     | Can be created after Branch |
| 5    | Shipping Types            | Create Shipping Types           | -                           | Independent |
| 6    | Weight Pricing            | Configure Weight Pricing        | -                           | Single record |

**Smart Wizard Behavior (Important UX):**

- When the Admin enters the **"Add City"** step:
  - If no Governments exist → Show a prominent button **"Add Government First"** that redirects him to the Government creation step.
  - After creating the Government, return him automatically to the City step.
- Same logic applies to all dependent steps (e.g., if no Branches, show "Add Branch First" when trying to create Government).
- After successful creation of any item, show a **green success checkmark** with message: "✅ Government created successfully. You can now add Cities."
- Provide a **"Continue to Next Step"** button only when the current step is completed successfully.

**Goal**: Make the setup process feel guided and forgiving, never frustrating.

---

### 2. Employee / Merchant Role (The Operator)

**Philosophy**:  
"Enable fast and error-free daily operations."

**UI Pattern**: **Single-Page Smart Form** with intelligent dependent dropdowns.

**Order Creation Flow:**

1. Select **Merchant**
2. Select **Government**
3. Select **City** ← **Auto-filtered** based on the selected Government
4. Select **Shipping Type**
5. (Optional) Select **Branch**
6. Fill client information, products, weight, and payment type

**Form Rules:**

- Changing a parent field (e.g., Government) must **reset** all child fields (City).
- Only show active records (`isDeleted === false`).
- City dropdown must be empty until a Government is selected.
- Show helpful empty states with action buttons (e.g., "No Cities found. Add City" → redirects to Settings if Admin).

---

## 📝 Technical Implementation Requirements

- **Stack**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **State**: Redux Toolkit + Axios
- **Forms**: React Hook Form + Zod
- **API Response Format**: All endpoints return
  `{ "isSuccess": boolean, "data": any, "message": string, "error": string | null }`

## Critical Order Creation Rules (POST /api/Order)

Required fields:

- `merchant_Id`, `government_Id`, `city_Id`, `shippingType_Id`, `paymentType`
- `clientName`, `clientPhone1`, `clientAddress`, `orderCost`, `orderTotalWeight`, `products`
- `orderFromReq` is required (recommended value: "dashboard")
- `orderType` is a string field

**Constraint**: The selected City **must** belong to the selected Government (enforce this validation in the frontend).

---

## 🎯 Summary of UX Philosophy

I have an existing Admin Setup Wizard page. I want to upgrade it to be a **Smart Guided Wizard** with the following precise requirements:

### 1. Smart Redirect & Empty State Logic (Most Important)

- When the Admin opens the **"Governments"** step:
  - If no Branches exist → Show a clear empty state with a prominent button:  
    **"No Branches yet. Add Branch First"** → This button redirects to the Branches creation page.

- When the Admin opens the **"Cities"** step:
  - If no Governments exist → Show empty state with button:  
    **"No Governments yet. Add Government First"** → Redirects to Governments page.

- Same logic for other dependent steps.

- After successfully creating an entity from the redirect, automatically return the user to the previous wizard step.

### 2. Success Feedback

- After successful creation of Branch, Government, City, or Merchant, show a **Sonner toast** with green checkmark:
  Example: "✅ Government 'Cairo' created successfully. You can now add Cities."

### 3. Wizard Navigation

- Keep the current stepper: Branch → Government → City → Merchant
- The "Continue to Next Step" button should be **disabled** until the current step has at least one active record (`isDeleted === false`).
- After successful creation in the current step, enable the Continue button.

### 4. Technical Requirements

- Use **Yup** for validation (with React Hook Form)
- Use **Sonner** for toasts
- Use shadcn/ui components
- Use TypeScript
- Follow the data hierarchy strictly:
  - Branch is root
  - Government depends on Branch (`branch_Id`)
  - City depends on Government (`government_Id`)
  - Merchant depends on Branch (`branchsNames`)

Please rewrite and improve the Admin Setup Wizard page with the smart redirect logic, empty states, success toasts, and navigation rules described above.

Show me the complete updated code for the wizard page, including any necessary hooks or helpers.
