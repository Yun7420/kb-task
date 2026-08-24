import { useQuery } from "@tanstack/react-query";
import { getTaskDetail } from "../api";

export function useTaskDetail(id: string) {
  return useQuery({
    queryKey: ["task", id],
    queryFn: () => getTaskDetail(id),
    retry: false,
  });
}
