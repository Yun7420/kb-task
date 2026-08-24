import { useFormState } from "react-hook-form";
import { Button } from "@/components/button";

export function SubmitButton() {
  const { isValid, isSubmitting } = useFormState();
  return (
    <Button type="submit" disabled={!isValid || isSubmitting}>
      {isSubmitting ? "로그인 중..." : "로그인"}
    </Button>
  );
}
