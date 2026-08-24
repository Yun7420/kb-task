import { client } from "@/api/client";
import type { TaskListResponse } from "@/types";

export async function getTasks(page: number): Promise<TaskListResponse> {
  const { data } = await client.get<TaskListResponse>("/task", {
    params: { page },
  });
  return data;
}
