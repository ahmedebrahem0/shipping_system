// settings/pricing/page.tsx
// Redirect to settings/governments

import { redirect } from "next/navigation";

export default function PricingPage() {
  redirect("/settings/governments");
}
