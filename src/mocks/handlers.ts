import { http, HttpResponse } from "msw";
import { tasks, user } from "./db";

const VALID_EMAIL = "test@kb.com";
const VALID_PASSWORD = "test1234";

// 만료 토큰 시연용 - localStorage의 accessToken을 이 값으로 바꾸면 401 흐름을 확인할 수 있음
const EXPIRED_TOKEN = "expired-token";

// 실서버라면 HttpOnly 쿠키로 관리될 refresh 토큰. 목에서는 고정값을 사용한다.
const REFRESH_TOKEN = "mock-refresh-token";

// 재발급 때마다 다른 accessToken을 내려 재발급이 실제로 일어났는지 확인할 수 있게 한다
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
    return HttpResponse.json(
      {
        accessToken: "mock-access-token",
        refreshToken: REFRESH_TOKEN,
      },
      {
        // 실제 백엔드가 하는 일을 목이 대신한다. 프론트는 쿠키를 직접 만지지 않는다.
        // 실서버라면 HttpOnly·Secure가 함께 붙지만, 클라이언트 사이드 목에서는 적용할 수 없다.
        headers: { "Set-Cookie": `token=${REFRESH_TOKEN}; Path=/` },
      },
    );
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
    // 정상 → 200 (재발급마다 다른 accessToken)
    return HttpResponse.json({
      accessToken: issueAccessToken(),
      refreshToken: REFRESH_TOKEN,
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
      // TaskItem에 정의된 필드만 반환 (registerDatetime은 상세 응답 전용)
      data: tasks
        .slice(start, end)
        .map(({ id, title, memo, status }) => ({ id, title, memo, status })),
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
      registerDatetime: task.registerDatetime,
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
