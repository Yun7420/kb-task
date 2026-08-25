import type { TaskItem } from "@/types";

/** 목 데이터에만 필요한 등록일시를 TaskItem에 덧붙인 형태 */
export type TaskRecord = TaskItem & { registerDatetime: string };

// 기준일로부터 id마다 하루씩 뒤로 밀어 서로 다른 등록일시를 갖게 함
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
