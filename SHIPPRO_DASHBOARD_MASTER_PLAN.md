# 🚢 SHIPPRO SYSTEM: ELITE DASHBOARD IMPLEMENTATION (ZERO-ERROR PROTOCOL)

## 📋 PROJECT CONTEXT & PHILOSOPHY

You are building a professional Logistics Dashboard for "ShipPro".

- **Crucial Rule**: The current codebase is 100% functional. **DO NOT MODIFY** any existing files (`apiSlice.ts`, `api-endpoints.ts`, etc.). Read them to understand the logic, but only create new files for the dashboard.
- **Environment**: Detect and use the existing Next.js and React versions from the project's `package.json`. Do not enforce external version rules.
- **Theme**: Strictly Professional Dark Mode (Background: `slate-950`, Cards: `slate-900/60`).

---

## 🛠️ ARCHITECTURAL AUDIT (READ BEFORE CODING)

### 1. Data Access Layer (RTK Query)

- **Base Structure**: All API responses follow the `ApiResponse<T>` interface: `{ isSuccess: boolean, data: T, message: string, error: string }`.
- **Hook Discovery**: If a suggested Hook name (e.g., `useGetDashboardStatsQuery`) differs in the project, search `apiSlice.ts` for the hook that matches the **intent** (e.g., fetching stats, orders, or merchants).
- **Parameters**: Always match the parameters (page, pageSize, status) exactly as defined in the `apiSlice.ts` endpoints.

### 2. Data Transformation Rules

- **The clientData Split**: In order lists, `clientData` is a string: `"name\nphone1\nphone2"`. You **must** use `.split('\n')` to display these values separately in the UI.
- **Soft-Delete Filter**: Manually filter all arrays (Orders, Merchants, etc.) to exclude items where `isDeleted === true` if the API has not already filtered them.
- **Formatting**:
  - Currency: `${value.toLocaleString()} EGP`
  - Weight: `${value} KG`
  - Dates: Use a clean, readable format (e.g., `DD/MM/YYYY`).

---

## 🏗️ IMPLEMENTATION PHASES

### PHASE 1: ATOMIC COMPONENTS (`_components/shared/`)

1. **StatCard.tsx**:
   - Interactive cards with hover effects (`hover:scale-[1.02]`).
   - Use Lucide icons and distinct border-l-4 colors (Sky, Emerald, Amber, Rose).
2. **DashboardSkeleton.tsx**:
   - Matching the grid layout for a seamless loading experience.

### PHASE 2: DASHBOARD SWITCHER (`page.tsx`)

- **Location**: `src/app/(dashboard)/dashboard/page.tsx`
- **Logic**: Use `useAppSelector` to get `state.auth.user`.
- **Routing**: Render a specific view based on `user.role` (admin, employee, merchant, delivery).
- **Greeting**: Add a dynamic header: `"Good [Morning/Afternoon/Evening], {name}! 👋"`.

### PHASE 3: ROLE-SPECIFIC VIEWS

#### 🔴 Admin & Employee View

- **Stats**: Total Orders, Merchants, Deliveries, and Branches from `getDashboardStats`.
- **Charts**: Use `recharts`. (BarChart for order status distribution, PieChart for success rate).
- **Config Hub**: Quick-access tiles for `PRICING`, `SHIPPING_TYPES`, `BRANCHES`, and `GOVERNMENTS` using `ROUTES` constants.

#### 🔵 Merchant View

- **Stats**: Total shipments and "Delivered" count using `getMerchantOrders`.
- **Order Funnel**: A visual pipeline showing the journey of the merchant's orders.
- **Quick Action**: Prominent button "Create New Order" linking to `ROUTES.ORDER_CREATE`.

#### 🟠 Delivery Agent View

- **Daily Tasks**: Orders assigned to the agent (`DeliveredToAgent` status).
- **Task Cards**: Display client name (from split string), city, and order cost.
- **Status Mutation**: Integrated buttons to trigger `useChangeOrderStatusMutation` for "Delivered" or "Rejected".

---

## 🛡️ SAFETY & ERROR PREVENTION (STRICT)

1. **Read-Only Context**: You are authorized to read all files in `@/types/`, `@/constants/`, and `@/store/`. Do not alter them.
2. **Type Safety**: Use the existing interfaces (`OrdersResponse`, `DashboardStatsResponse`, `OrderDetails`). Do not create duplicate interfaces.
3. **No Inline Styles**: Use Tailwind CSS utility classes exclusively.
4. **Hydration**: Ensure `recharts` and interactive elements are handled correctly to prevent Next.js hydration mismatches (use `useEffect` or `"use client"` where necessary).
5. **Fallback Handling**: If a query returns no data or a 404, display a graceful "Empty State" with an icon, not a blank screen.

---

## 📁 TARGET DIRECTORY STRUCTURE

```text
src/app/(dashboard)/dashboard/
├── page.tsx (Switcher)
└── _components/
    ├── shared/ (Atomic UI)
    ├── admin/ (Admin/Staff views)
    ├── merchant/ (Merchant views)
    └── delivery/ (Agent views)
