// store/index.ts
// Combines all slices into one Redux store

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/auth/authSlice";
import uiReducer from "@/store/slices/ui/uiSlice";
import { apiSlice } from "@/store/slices/api/apiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// بنحتاجهم في hooks.ts
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;