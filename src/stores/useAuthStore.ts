import { create } from "zustand";
import { persist } from "zustand/middleware";
import { initialState } from "./config/store";
import { createAuthActions, type AuthState } from "./config/actions";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,
      ...createAuthActions(set),
    }),
    { name: "auth-storage" },
  ),
);
