import { http, HttpResponse } from "msw";
import { tasks, user } from "./db";

const VALID_EMAIL = "test@kb.com";
const VALID_PASSWORD = "test1234";

const EXPIRED_TOKEN = "expired-token";

const REFRESH_TOKEN = "mock-refresh-token";

// 만료 시연용 - 이 키가 true면 재발급이 항상 실패한다
const REFRESH_EXPIRED_KEY = "mock-refresh-expired";

let issuedAccessTokenCount = 0;
const issueAccessToken = () => `access-token-${++issuedAccessTokenCount}`;

function isAuthorized(request: Request) {
  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return false;
  return authorization.slice("Bearer ".length) !== EXPIRED_TOKEN;
}

const unauthorized = () =>
  HttpResponse.json(
    { errorMessage: "인증이 만료되었습니다. 다시 로그인해주세요." },
    { status: 401 },
  );

export const handlers = [
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
    return HttpResponse.json(
      {
        accessToken: "mock-access-token",
        refreshToken: REFRESH_TOKEN,
      },
      {
        headers: { "Set-Cookie": `token=${REFRESH_TOKEN}; Path=/` },
      },
    );
  }),

  http.post("/api/refresh", ({ cookies }) => {
    // 재발급 실패 시나리오 재현용 - localStorage에 이 키를 두면 항상 401을 반환한다
    if (localStorage.getItem(REFRESH_EXPIRED_KEY) === "true") {
      return HttpResponse.json(
        { errorMessage: "리프레시 토큰이 유효하지 않습니다." },
        { status: 401 },
      );
    }

    const token = cookies.token;
    if (!token || token === "expired") {
      return HttpResponse.json(
        { errorMessage: "리프레시 토큰이 유효하지 않습니다." },
        { status: 401 },
      );
    }
    if (token === "invalid") {
      return HttpResponse.json(
        { errorMessage: "토큰 재발급에 실패했습니다." },
        { status: 400 },
      );
    }
    return HttpResponse.json({
      accessToken: issueAccessToken(),
      refreshToken: REFRESH_TOKEN,
    });
  }),

  http.get("/api/user", ({ request }) => {
    if (!isAuthorized(request)) return unauthorized();
    return HttpResponse.json(user);
  }),

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

  http.get("/api/task", ({ request }) => {
    if (!isAuthorized(request)) return unauthorized();
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const PAGE_SIZE = 10;
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return HttpResponse.json({
      data: tasks
        .slice(start, end)
        .map(({ id, title, memo, status }) => ({ id, title, memo, status })),
      hasNext: end < tasks.length,
    });
  }),

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
      registerDatetime: task.registerDatetime,
    });
  }),

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
