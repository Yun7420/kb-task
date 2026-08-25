import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import type { ErrorResponse } from "@/types";
import { deleteTask } from "../api";

export function useDeleteTask() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    // 재시도 시 이전 실패 메시지를 지운다
    onMutate: () => setErrorMessage(null),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.removeQueries({ queryKey: ["task", id] });
      navigate("/task");
    },
    onError: (error) => {
      // openapi가 정의한 401·404는 errorMessage를 내려주므로 그대로 노출한다
      setErrorMessage(
        isAxiosError<ErrorResponse>(error)
          ? (error.response?.data?.errorMessage ?? "삭제에 실패했습니다.")
          : "삭제에 실패했습니다.",
      );
    },
  });

  const clearError = () => setErrorMessage(null);

  return { mutate, isPending, errorMessage, clearError };
}
