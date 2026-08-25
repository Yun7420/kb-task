import { Link } from "react-router-dom";
import type { TaskItem } from "@/types";
import styles from "./TaskCard.module.css";

interface TaskCardProps {
  task: TaskItem;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Link to={`/task/${task.id}`} className={styles.card}>
      <h3 className={styles.title}>{task.title}</h3>
      <p className={styles.memo}>{task.memo}</p>
    </Link>
  );
}
