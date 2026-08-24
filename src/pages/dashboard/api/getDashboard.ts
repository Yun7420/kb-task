import { client } from "@/api/client";
import type { DashboardResponse } from "@/types";

export async function getDashboard(): Promise<DashboardResponse> {
  const { data } = await client.get<DashboardResponse>("/dashboard");
  return data;
}
