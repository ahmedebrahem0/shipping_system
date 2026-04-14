
We have an architectural issue in the Order Details page that affects data retrieval and performance.

Root cause:
The frontend was incorrectly trying to fetch a single order using a non-existent backend endpoint:
useGetOrderByIdQuery(orderId)

However, the backend does NOT provide a "get order by id" endpoint.

Available backend endpoints:

- GET /api/Order/{orderStatus}/{all}
- GET /api/Order/Merchant/{id}/{orderStatus}/{all}
- GET /api/Order/Delivery/{id}/{orderStatus}/{all}

There is NO:

- GET /api/Order/{id} ❌

Because of this mismatch, the Order Details page could not reliably fetch a single order and was breaking or rendering empty data.

---

Correct approach (frontend-only solution):
We will fetch all orders using the existing endpoint:
GET /api/Order/{orderStatus}/{all}

Then select the required order from the returned list using:
order.id === orderId (from useParams)

---

Task:
Fix the Order Details page located at:
src/app/(dashboard)/orders/[id]/page.tsx

Required changes:

1. Remove useGetOrderByIdQuery completely
2. Replace it with useGetOrdersQuery (RTK Query)
3. Extract orderId from useParams() and convert it to number safely
4. Find the correct order from:
   ordersData?.data?.orders
5. Ensure proper handling of:
   - loading state
   - error state
   - missing order (not found case)
6. Replace any separate products API usage and use:
   order.products (if available)
7. Ensure safe rendering using optional chaining to avoid runtime crashes
8. Add console.log to print:
   - full orders response
   - selected order object

Performance requirements:

- Avoid unnecessary re-renders
- Use memoized derived data if needed (useMemo allowed)
- Keep code clean and production-ready

Goal:
Make the Order Details page fully functional using only existing backend endpoints, without requiring backend changes, while ensuring stable rendering and good performance.
