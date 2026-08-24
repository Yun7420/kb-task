import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api";

export function useUser() {
  return useQuery({ queryKey: ["user"], queryFn: getUser });
}
