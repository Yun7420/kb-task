export type TaskStatus = "TODO" | "DONE";

export interface TaskItem {
  id: number;
  title: string;
  memo: string;
  status: TaskStatus;
}
