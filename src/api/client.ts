import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores";
import type { AuthTokenResponse } from "@/types";

const REFRESH_PATH = "/refresh";

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const client = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

function requestNewAccessToken(): Promise<string> {
  return client.post<AuthTokenResponse>(REFRESH_PATH).then(({ data }) => {
    useAuthStore.getState().setAccessToken(data.accessToken);
    return data.accessToken;
  });
}

function forceSignOut() {
  const { accessToken, clearAuth } = useAuthStore.getState();
  if (accessToken === null) return;
  clearAuth();
  window.location.replace("/sign-in");
}

// 401 → 재발급 → 원 요청 재시도. 동시 요청은 refreshPromise로 묶어 재발급을 1회로 제한한다.
// 설계 근거와 무한 루프 차단 규칙은 README "토큰 재발급(refresh)" 참고.
client.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const config = error.config as RetriableConfig | undefined;

    if (!config || config.url === REFRESH_PATH) {
      forceSignOut();
      return Promise.reject(error);
    }

    if (config._retry) {
      return Promise.reject(error);
    }
    config._retry = true;

    try {
      if (refreshPromise === null) {
        refreshPromise = requestNewAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const accessToken = await refreshPromise;

      config.headers.Authorization = `Bearer ${accessToken}`;
      return client(config);
    } catch {
      forceSignOut();
      return Promise.reject(error);
    }
  },
);
