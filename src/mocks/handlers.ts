import { http, HttpResponse } from "msw";
import { tasks, user } from "./db";

const VALID_EMAIL = "test@kb.com";
const VALID_PASSWORD = "test1234";

function isAuthorized(request: Request) {
  return !!request.headers.get("Authorization")?.startsWith("Bearer ");
}

const unauthorized = () =>
  HttpResponse.json({ errorMessage: "인증이 필요합니다." }, { status: 401 });

export const handlers = [
  // 로그인 (200/400)
  http.post("/api/sign-in", async ({ request }) => {
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };
    if (email !== VALID_EMAIL || password !== VALID_PASSWORD) {
      return HttpResponse.json(
        { errorMessage: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 400 },
      );
    }
    return HttpResponse.json({
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
    });
  }),

  http.post("/api/refresh", ({ cookies }) => {
    const token = cookies.token;
    // 쿠키 없음/만료 → 401
    if (!token || token === "expired") {
      return HttpResponse.json(
        { errorMessage: "리프레시 토큰이 유효하지 않습니다." },
        { status: 401 },
      );
    }
    // 재발급 실패 → 400
    if (token === "invalid") {
      return HttpResponse.json(
        { errorMessage: "토큰 재발급에 실패했습니다." },
        { status: 400 },
      );
    }
    // 정상 → 200
    return HttpResponse.json({
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
    });
  }),

  // 회원정보 (200/401)
  http.get("/api/user", ({ request }) => {
    if (!isAuthorized(request)) return unauthorized();
    return HttpResponse.json(user);
  }),

  // 대시보드 (200/401)
  http.get("/api/dashboard", ({ request }) => {
    if (!isAuthorized(request)) return unauthorized();
    const numOfDoneTask = tasks.filter((t) => t.status === "DONE").length;
    const numOfRestTask = tasks.filter((t) => t.status === "TODO").length;
    return HttpResponse.json({
      numOfTask: tasks.length,
      numOfRestTask,
      numOfDoneTask,
    });
  }),

  // 목록 (200/401)
  http.get("/api/task", ({ request }) => {
    if (!isAuthorized(request)) return unauthorized();
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const PAGE_SIZE = 10;
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return HttpResponse.json({
      data: tasks.slice(start, end),
      hasNext: end < tasks.length,
    });
  }),

  // 상세 (200/401/404)
  http.get("/api/task/:id", ({ request, params }) => {
    if (!isAuthorized(request)) return unauthorized();
    const task = tasks.find((t) => t.id === params.id);
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

  // 삭제 (200/401/404)
  http.delete("/api/task/:id", ({ request, params }) => {
    if (!isAuthorized(request)) return unauthorized();
    const index = tasks.findIndex((t) => t.id === params.id);
    if (index === -1) {
      return HttpResponse.json(
        { errorMessage: "할 일을 찾을 수 없습니다." },
        { status: 404 },
      );
    }
    tasks.splice(index, 1);
    return HttpResponse.json({ success: true });
  }),
];
