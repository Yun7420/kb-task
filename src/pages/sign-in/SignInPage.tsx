import { FormProvider } from "react-hook-form";
import { Modal } from "@/components/modal";
import { FormInput, SubmitButton } from "./components";
import { useSignIn } from "./hooks";
import styles from "./SignInPage.module.css";
import { Button } from "@/components/button";

const SignInPage = () => {
  const { methods, onSubmit, errorMessage, closeError } = useSignIn();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>로그인</h1>
        <FormProvider {...methods}>
          <form className={styles.form} onSubmit={onSubmit}>
            <FormInput name="email" label="이메일" type="email" />
            <FormInput name="password" label="비밀번호" type="password" />
            <SubmitButton />
          </form>
        </FormProvider>
      </div>

      <Modal isOpen={errorMessage !== null} onClose={closeError}>
        <p className={styles.modalText}>{errorMessage}</p>
        <div className={styles.modalActions}>
          <Button type="button" onClick={closeError}>
            확인
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default SignInPage;
