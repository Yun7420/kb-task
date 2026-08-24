import type { AuthProperty } from "./store";

export type AuthAction = {
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
};

export type AuthState = AuthProperty & AuthAction;

type SetFn = (
  partial: Partial<AuthProperty> | ((state: AuthProperty) => AuthProperty),
) => void;

export const createAuthActions = (set: SetFn): AuthAction => ({
  setAccessToken: (token) => set({ accessToken: token }),
  clearAuth: () => set({ accessToken: null }),
});
