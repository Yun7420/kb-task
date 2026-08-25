import axios from "axios";
import { useAuthStore } from "@/stores";
import type { AuthTokenResponse } from "@/types";

const REFRESH_PATH = "/refresh";

export const client = axios.create({
  baseURL: "/api",
  // refresh 토큰 쿠키를 요청에 자동으로 실어 보내기 위해 필요하다.
  // openapi의 refreshTokenCookie 설명: "In browser clients, send requests with credentials"
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * 진행 중인 재발급 요청. null이면 재발급 중이 아니다.
 *
 * 동시에 여러 요청이 401을 받아도 이 Promise를 공유해 재발급은 한 번만 일어난다(single-flight).
 * 재발급을 중복 호출하면, 서버가 refresh 토큰을 회전시키는 경우 뒤늦은 호출이 이미 폐기된
 * 토큰을 사용하게 되어 정상 사용자가 로그아웃되는 문제가 생긴다.
 */
let refreshPromise: Promise<string> | null = null;

function requestNewAccessToken(): Promise<string> {
  // refresh 토큰 쿠키는 브라우저가 자동으로 붙이므로 본문 없이 호출한다.
  return client.post<AuthTokenResponse>(REFRESH_PATH).then(({ data }) => {
    useAuthStore.getState().setAccessToken(data.accessToken);
    return data.accessToken;
  });
}

function forceSignOut() {
  const { accessToken, clearAuth } = useAuthStore.getState();
  // 대기 중이던 요청들이 한꺼번에 실패하면 여러 번 호출될 수 있어 한 번만 수행한다.
  if (accessToken === null) return;
  clearAuth();
  window.location.replace("/sign-in");
}

client.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const config = error.config;

    // 재발급 요청 자체가 401 → 더 시도할 방법이 없으므로 재로그인을 유도한다.
    // (이 분기가 없으면 refresh 실패 → 재발급 → 또 실패가 무한히 반복된다)
    if (!config || config.url === REFRESH_PATH) {
      forceSignOut();
      return Promise.reject(error);
    }

    // 재발급 후 재시도한 요청이 또 401 → 토큰이 아니라 권한 문제로 보고 중단한다.
    // (재발급 기회는 요청당 한 번뿐이라는 규칙)
    if (config._retry) {
      return Promise.reject(error);
    }
    config._retry = true;

    try {
      // 첫 번째 요청만 재발급을 시작하고, 나머지는 같은 Promise를 기다린다.
      // await 자체가 대기 큐 역할을 하므로 별도의 큐 자료구조가 필요 없다.
      if (refreshPromise === null) {
        refreshPromise = requestNewAccessToken().finally(() => {
          // 성공/실패와 무관하게 반드시 비운다.
          // 남겨두면 다음 만료 때 이미 끝난 Promise를 재사용해 재발급이 일어나지 않는다.
          refreshPromise = null;
        });
      }

      const accessToken = await refreshPromise;

      // 원본 config에는 만료된 토큰이 그대로 남아 있다. 요청 인터셉터는 이미 지나갔으므로
      // 여기서 직접 갱신하지 않으면 재시도도 401을 받고 그대로 로그아웃된다.
      config.headers.Authorization = `Bearer ${accessToken}`;
      return client(config);
    } catch {
      // 재발급 실패 - 대기하던 요청 전부가 이 경로로 들어온다.
      forceSignOut();
      return Promise.reject(error);
    }
  },
);
