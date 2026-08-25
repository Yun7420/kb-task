import "axios";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    /**
     * 토큰 재발급 후 한 번 재시도한 요청인지 표시한다.
     * 재시도한 요청이 또 401을 받으면 토큰 문제가 아니므로 재발급을 다시 시도하지 않는다.
     */
    _retry?: boolean;
  }
}
