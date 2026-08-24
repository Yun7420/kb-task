export type TaskStatus = "TODO" | "DONE";

export interface TaskItem {
  id: string;
  title: string;
  memo: string;
  status: TaskStatus;
}
