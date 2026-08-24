import { client } from "@/api/client";
import type { TaskDetailResponse } from "@/types";

export async function getTaskDetail(id: string): Promise<TaskDetailResponse> {
  const { data } = await client.get<TaskDetailResponse>(`/task/${id}`);
  return data;
}
