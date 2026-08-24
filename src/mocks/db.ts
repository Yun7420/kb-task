import type { TaskItem } from "../types";

export const tasks: TaskItem[] = Array.from({ length: 50 }, (_, i) => {
  const id = i + 1;
  return {
    id: String(id),
    title: `할 일 ${id}`,
    memo: `${id}번째 할 일에 대한 메모입니다.`,
    status: id % 3 === 0 ? "DONE" : "TODO",
  };
});

export const user = {
  name: "한상윤",
  memo: "KB헬스케어 프론트엔드 과제 지원자",
};
