// store/hooks.ts
// Typed Redux hooks to use instead of plain useDispatch and useSelector

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);