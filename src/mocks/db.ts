import type { TaskItem } from "@/types";

export type TaskRecord = TaskItem & { registerDatetime: string };

const BASE_DATE = new Date("2026-08-01T09:00:00.000Z");

export const tasks: TaskRecord[] = Array.from({ length: 50 }, (_, i) => {
  const id = i + 1;
  const registeredAt = new Date(BASE_DATE);
  registeredAt.setDate(BASE_DATE.getDate() - i);

  return {
    id: String(id),
    title: `할 일 ${id}`,
    memo: `${id}번째 할 일에 대한 메모입니다.`,
    status: id % 3 === 0 ? "DONE" : "TODO",
    registerDatetime: registeredAt.toISOString(),
  };
});

export const user = {
  name: "한상윤",
  memo: "KB헬스케어 프론트엔드 과제 지원자",
};
