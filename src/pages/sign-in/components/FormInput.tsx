import { useFormContext, useFormState } from "react-hook-form";
import { Input } from "@/components/input";
import type { SignInInput } from "../schema";
import styles from "./FormInput.module.css";

interface FormInputProps {
  name: keyof SignInInput;
  label: string;
  type?: string;
}

export function FormInput({ name, label, type = "text" }: FormInputProps) {
  const { register } = useFormContext<SignInInput>();
  const { errors } = useFormState<SignInInput>({ name });
  const error = errors[name];

  return (
    <div className={styles.field}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <Input id={name} type={type} {...register(name)} />
      {error && <p className={styles.error}>{error.message}</p>}
    </div>
  );
}
