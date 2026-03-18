// orders/[id]/page.tsx
// Redirect to orders page

import { redirect } from "next/navigation";

export default function OrderDetailPage() {
  redirect("/orders");
}
