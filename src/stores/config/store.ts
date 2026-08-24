export type AuthProperty = {
  accessToken: string | null;
};

export const initialState: AuthProperty = {
  accessToken: null,
};
