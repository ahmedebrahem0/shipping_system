// reports/page.tsx
// Redirect to dashboard

import { redirect } from "next/navigation";

export default function ReportsPage() {
  redirect("/dashboard");
}
