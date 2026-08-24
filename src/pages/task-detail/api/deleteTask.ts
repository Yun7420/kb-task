import { client } from "@/api/client";
import type { DeleteTaskResponse } from "@/types";

export async function deleteTask(id: string): Promise<DeleteTaskResponse> {
  const { data } = await client.delete<DeleteTaskResponse>(`/task/${id}`);
  return data;
}
