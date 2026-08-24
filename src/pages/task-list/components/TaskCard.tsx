import { useNavigate } from "react-router-dom";
import type { TaskItem } from "@/types";
import styles from "./TaskCard.module.css";

interface TaskCardProps {
  task: TaskItem;
}

export function TaskCard({ task }: TaskCardProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.card} onClick={() => navigate(`/task/${task.id}`)}>
      <h3 className={styles.title}>{task.title}</h3>
      <p className={styles.memo}>{task.memo}</p>
    </div>
  );
}
