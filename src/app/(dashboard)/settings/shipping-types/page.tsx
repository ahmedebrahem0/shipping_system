// settings/shipping-types/page.tsx
// Redirect to settings/governments

import { redirect } from "next/navigation";

export default function ShippingTypesPage() {
  redirect("/settings/governments");
}
