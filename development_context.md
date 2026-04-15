# Development Context

## 1. Data Structure (Accessing Nested Data in ApiResponse)

All API responses follow the `ApiResponse<T>` interface defined in `src/types/api.types.ts`:

```typescript
interface ApiResponse<T = unknown> {
  isSuccess: boolean;
  data: T;
  message: string | null;
  error: string | null;
}
```

### Access Patterns:

- **Direct response**: `response.data` returns the wrapped data `T`
- **Paginated responses**: `response.data` contains `{ items: T[], totalCount: number }`
- **Orders response**: `response.data.data.orders` (nested: `OrdersResponse` → `{ data: { orders: [] } }`)

### TypeScript Usage:

```typescript
// For getBranches - returns ApiResponse<BranchesData>
const { data } = useGetBranchesQuery({ page: 1, pageSize: 10 });
// Access: data?.data?.branches (if BranchesData has branches property)

// For getOrders - returns OrdersResponse
const { data } = useGetOrdersQuery({ status: "" });
// Access: data?.data?.orders[]
```

---

## 2. Role-to-Hook Mapping

| Role | Dashboard Hook | Orders Hook | Specific Endpoint |
|------|----------------|-------------|-------------------|
| **Admin** | `useGetDashboardStatsQuery` | `useGetOrdersQuery` | All orders |
| **Employee** | `useGetDashboardStatsQuery` | `useGetOrdersQuery` | All orders |
| **Merchant** | N/A (use merchant orders) | `useGetMerchantOrdersQuery({ merchantId })` | Filtered by merchant |
| **Delivery** | N/A | `useGetDeliveryOrdersQuery({ deliveryId })` | Filtered by agent |

### Role Detection:

```typescript
const user = useAppSelector((state) => state.auth.user);

switch (user?.role) {
  case "Admin":
  case "Employee":
    // Use Admin/Employee view components
    break;
  case "Merchant":
    // Use Merchant view components with getMerchantOrders
    break;
  case "Delivery":
    // Use Delivery view components with getDeliveryOrders
    break;
}
```

---

## 3. String Handling for clientData

In order lists, `clientData` is stored as a newline-delimited string:

```typescript
clientData: "name\nphone1\nphone2"
```

### Parsing Logic:

```typescript
const parseClientData = (clientData: string) => {
  const parts = clientData.split('\n');
  return {
    name: parts[0]?.trim() || "",
    phone1: parts[1]?.trim() || "",
    phone2: parts[2]?.trim() || "",
  };
};

// Usage in component:
const { name, phone1, phone2 } = parseClientData(order.clientData);
```

### Display Example:

```tsx
<div className="client-info">
  <p className="font-medium">{name}</p>
  <p className="text-sm text-muted">{phone1}</p>
  {phone2 && <p className="text-sm text-muted">{phone2}</p>}
</div>
```

---

## Notes

- Always check `isSuccess` before rendering data
- Handle `null`/`undefined` data with empty states
- Filter `isDeleted === true` items manually when API doesn't filter
- Use `useChangeOrderStatusMutation` for Delivery agent status updates