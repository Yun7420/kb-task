import { useState } from "react";
import { Modal } from "@/components/modal";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import styles from "./DeleteConfirmModal.module.css";

interface DeleteConfirmModalProps {
  taskId: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  errorMessage?: string | null;
}

export function DeleteConfirmModal({
  taskId,
  onClose,
  onConfirm,
  isDeleting,
  errorMessage,
}: DeleteConfirmModalProps) {
  const [input, setInput] = useState("");
  const isMatched = input === taskId;

  return (
    <Modal isOpen onClose={onClose}>
      <p className={styles.text}>
        삭제하려면 ID <strong>{taskId}</strong> 를 입력하세요.
      </p>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={taskId}
        aria-label="삭제 확인용 할 일 ID"
      />
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      <div className={styles.actions}>
        <Button type="button" onClick={onClose}>
          취소
        </Button>
        <Button
          type="button"
          disabled={!isMatched || isDeleting}
          onClick={onConfirm}
        >
          {isDeleting ? "삭제 중..." : "삭제"}
        </Button>
      </div>
    </Modal>
  );
}
