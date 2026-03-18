// branches/create/page.tsx
// Redirect to branches page

import { redirect } from "next/navigation";

export default function CreateBranchPage() {
  redirect("/branches");
}
