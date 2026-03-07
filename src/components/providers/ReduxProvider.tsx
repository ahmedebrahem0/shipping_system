// ReduxProvider.tsx
// Wraps the app with Redux store - must be a client component

"use client";

import { Provider } from "react-redux";
import { store } from "@/store";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}