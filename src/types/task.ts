export type TaskStatus = "TODO" | "DONE";

export interface TaskItem {
  id: string;
  title: string;
  memo: string;
  status: TaskStatus;
}

export interface TaskListResponse {
  data: TaskItem[];
  hasNext: boolean;
}
