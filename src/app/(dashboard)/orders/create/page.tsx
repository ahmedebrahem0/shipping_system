// orders/create/page.tsx
// Redirect to orders page

import { redirect } from "next/navigation";

export default function CreateOrderPage() {
  redirect("/orders");
}
