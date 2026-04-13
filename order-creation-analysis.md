# 📦 Order Creation System - Technical Documentation

This document serves as the absolute source of truth for the Order Creation logic, data dependencies, and API integration for the frontend implementation.

---

## 🚀 1. Data Fetching Strategy (Full-Load Pattern)

To ensure a seamless user experience and prevent multiple network requests during form filling, we follow the **Upfront Loading** strategy.

- **Implementation:** Fetch all lookup data (Branches, Merchants, Governments, Cities, Shipping Types) simultaneously on page initialization.
- **Critical Parameter:** Every GET request must include `pageSize=10000` to bypass default server pagination and retrieve the full dataset.
- **API Tooling:** In React/Next.js, use RTK Query hooks with fixed parameters.

---

## 🔗 2. Data Dependency & Filtering Chain

The most vital part of the system is how dropdowns interact. Based on the Legacy System analysis, the logic is as follows:

### A. Government ⮕ City (The "String-Match" Bridge)

Unlike standard ID-to-ID relationships, this link uses a **String Name** match.

1. **User Action:** Selects a Government (stores `government_Id`).
2. **Logic:** The system searches the `governments` array to find the object where `id === government_Id`.
3. **Extraction:** Get the `name` property from that Government object.
4. **Filtering:** Filter the `cities` array where `city.governmentName === governmentName`.
5. **Result:** Only cities belonging to that specific government string are displayed.

### B. Branch & Merchant (Independent Selection)

* **Rule:** Currently, these fields are **Independent**.
- **Logic:** Loading one does not filter the other. Users can select any Merchant and any Branch as per the current Business Rules.

---

## 🛠 3. Form State & Validation Rules

### 🔄 Reset & Cleanup Logic

- **Government Change:** When the `government_Id` changes, the `city_Id` **MUST** be reset to `0` or `null` immediately to prevent cross-government data corruption.
- **Branch Change:** If you implement branch-based filtering later, ensure all child fields (Merchant/Gov) are reset accordingly.

### 🔢 Data Integrity (Types)

- **Numeric Casting:** Ensure the following fields are sent as `Number` types in the final JSON payload:
  - `merchant_Id`, `branch_Id`, `government_Id`, `city_Id`, `shippingType_Id`.
  - `orderCost`, `orderTotalWeight`.
- **Validation:** Use **Yup** or **Zod** to enforce these types before the `onSubmit` trigger.

---

## 📊 4. Expected Data Models (Interfaces)

```typescript
// City Model
interface ICity {
  id: number;
  name: string;
  governmentName: string; // Used for frontend filtering logic
  isDeleted: boolean;
}

// Government Model
interface IGovernment {
  id: number;
  name: string; // Must match city.governmentName exactly
  isDeleted: boolean;
}

// Merchant Model
interface IMerchant {
  id: number;
  name: string;
  storeName?: string;
  isDeleted: boolean;
}
