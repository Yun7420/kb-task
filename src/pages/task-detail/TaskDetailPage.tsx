import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/button";
import { useTaskDetail, useDeleteTask } from "./hooks";
import { DeleteConfirmModal } from "./components";
import styles from "./TaskDetailPage.module.css";

const TaskDetailPage = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useTaskDetail(id);
  const { mutate, isPending } = useDeleteTask();
  const [isModalOpen, setModalOpen] = useState(false);

  if (isLoading) return <div>불러오는 중...</div>;

  if (isError || !data) {
    return (
      <div className={styles.notFound}>
        <p>할 일을 찾을 수 없습니다.</p>
        <Button type="button" onClick={() => navigate("/task")}>
          목록으로
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1>{data.title}</h1>
      <p className={styles.memo}>{data.memo}</p>
      <p className={styles.date}>{data.registerDatetime}</p>
      <Button type="button" onClick={() => setModalOpen(true)}>
        삭제
      </Button>

      {isModalOpen && (
        <DeleteConfirmModal
          taskId={id}
          onClose={() => setModalOpen(false)}
          onConfirm={() => mutate(id)}
          isDeleting={isPending}
        />
      )}
    </div>
  );
};

export default TaskDetailPage;
