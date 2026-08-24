import { client } from "@/api/client";
import type { UserResponse } from "@/types";

export async function getUser(): Promise<UserResponse> {
  const { data } = await client.get<UserResponse>("/user");
  return data;
}
