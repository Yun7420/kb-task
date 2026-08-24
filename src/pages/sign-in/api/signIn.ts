import { client } from "@/api/client";
import type { SignInInput } from "../schema";
import type { AuthTokenResponse } from "@/types";

export async function signIn(input: SignInInput): Promise<AuthTokenResponse> {
  const { data } = await client.post<AuthTokenResponse>("/sign-in", input);
  return data;
}
