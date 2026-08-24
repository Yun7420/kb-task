import { http, HttpResponse } from "msw";
import { tasks, user } from "./db";

// 목킹용 유효 계정 (이 값으로 로그인해야 성공)
const VALID_EMAIL = "test@kb.com";
const VALID_PASSWORD = "test1234";

export const handlers = [
  // 로그인
  http.post("/api/sign-in", async ({ request }) => {
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };

    // 계정이 안 맞으면 400 + 에러 메시지 (요구사항: non-200 → 에러 모달)
    if (email !== VALID_EMAIL || password !== VALID_PASSWORD) {
      return HttpResponse.json(
        { errorMessage: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 400 },
      );
    }

    // 성공 → 토큰 반환 (openapi의 AuthTokenResponse)
    return HttpResponse.json({
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
    });
  }),

  // 토큰 재발급
  http.post("/api/refresh", () => {
    return HttpResponse.json({
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
    });
  }),

  // 회원정보
  http.get("/api/user", () => {
    return HttpResponse.json(user);
  }),

  // 대시보드 통계 (tasks 배열로 계산)
  http.get("/api/dashboard", () => {
    const numOfDoneTask = tasks.filter((t) => t.status === "DONE").length;
    const numOfRestTask = tasks.filter((t) => t.status === "TODO").length;
    return HttpResponse.json({
      numOfTask: tasks.length,
      numOfRestTask,
      numOfDoneTask,
    });
  }),

  // 할 일 목록 (페이지네이션)
  http.get("/api/task", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const PAGE_SIZE = 10;

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const data = tasks.slice(start, end);
    const hasNext = end < tasks.length;

    return HttpResponse.json({ data, hasNext });
  }),

  // 할 일 상세
  http.get("/api/task/:id", ({ params }) => {
    const id = Number(params.id);
    const task = tasks.find((t) => t.id === id);

    if (!task) {
      return HttpResponse.json(
        { errorMessage: "할 일을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      title: task.title,
      memo: task.memo,
      registerDatetime: "2026-08-01T09:00:00.000Z",
    });
  }),

  // 할 일 삭제
  http.delete("/api/task/:id", ({ params }) => {
    const id = Number(params.id);
    const index = tasks.findIndex((t) => t.id === id);

    if (index === -1) {
      return HttpResponse.json(
        { errorMessage: "할 일을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    tasks.splice(index, 1); // 실제로 배열에서 제거
    return HttpResponse.json({ success: true });
  }),
];
