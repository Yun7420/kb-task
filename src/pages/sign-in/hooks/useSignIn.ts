import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { useAuthStore } from "@/stores";
import { signIn } from "../api";
import { signInSchema, type SignInInput } from "../schema";

export function useSignIn() {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const methods = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
  });

  const onSubmit = methods.handleSubmit(async (input) => {
    try {
      const { accessToken } = await signIn(input);
      setAccessToken(accessToken);
      navigate("/");
    } catch (error) {
      const message = isAxiosError(error)
        ? (error.response?.data?.errorMessage ?? "로그인에 실패했습니다.")
        : "로그인에 실패했습니다.";
      setErrorMessage(message);
    }
  });

  const closeError = () => setErrorMessage(null);

  return { methods, onSubmit, errorMessage, closeError };
}
