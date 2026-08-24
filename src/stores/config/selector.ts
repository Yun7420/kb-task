import type { AuthState } from "./actions";

export const authSelector = {
  accessToken: (state: AuthState) => state.accessToken,
  isAuthenticated: (state: AuthState) => !!state.accessToken,
};
