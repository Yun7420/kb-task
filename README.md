# KB Task

KB헬스케어 프론트엔드 과제 — 할 일 관리 애플리케이션

## 기술 스택

- **React 19** + **TypeScript** / **Vite** / **pnpm**
- **React Router** — 라우팅
- **Zustand** — 인증 상태
- **TanStack Query** — 서버 상태·캐싱·무한 스크롤
- **TanStack Virtual** — 가상 스크롤링
- **React Hook Form** + **Zod** — 폼 상태·유효성 검증
- **MSW** — API 모킹 (openapi.yaml 기반)
- **CSS Modules** + CSS 변수 토큰, **Pretendard**

## 실행

```bash
pnpm install
pnpm dev
```
→ http://localhost:5173

### 테스트 계정

백엔드가 MSW로 모킹되어 아래 고정 계정으로 로그인합니다.

- 이메일: `test@kb.com`
- 비밀번호: `test1234`

## 구현 기능

- **로그인** (`/sign-in`) — zod 유효성 검증, 실패 시 에러 모달, 성공 시 토큰 저장 + 인증 가드
- **대시보드** (`/`) — 할 일 통계(일/해야할 일/한 일)
- **할 일 목록** (`/task`) — 카드 목록, 가상 스크롤 + 무한 스크롤
- **할 일 상세** (`/task/:id`) — 상세 조회, 404 화면, 삭제 모달(ID 입력 일치 시 활성화)
- **회원정보** (`/user`)

> **레이아웃 범위에 대한 결정**
> 모든 라우트가 인증을 요구하므로 비로그인 사용자는 사실상 `/sign-in`에만 머뭅니다.
> 따라서 GNB의 비로그인 상태(로그인 아이콘)는 로그인 페이지에서만 관찰됩니다.
> 로그인 페이지를 독립 레이아웃으로 두는 안도 검토했으나, 그 경우 요구사항의
> GNB 비로그인 분기가 화면에 드러나지 않아 셸을 유지했습니다.

## 프로젝트 구조

페이지 단위 코로케이션 — 각 페이지가 쓰는 concern(api/hooks/components/schema)만 폴더로 가짐.

```
src/
├── api/ 공통 axios 인스턴스 + 인터셉터
├── components/ 공유 UI (Button, Input, Modal, Layout)
├── mocks/ MSW 핸들러 + 목 데이터
├── pages/ 페이지별 폴더 (각자 api/hooks/components/schema)
├── routes/ 라우터 + 인증 가드
├── stores/ zustand (인증)
├── styles/ 전역 스타일 + 색상 토큰
└── types/ API 계약 타입
```

## 주요 설계

- **관심사 분리**: 로직은 hooks, 뷰는 컴포넌트 (페이지는 조립만)
- **렌더 격리**: 로그인 폼에서 `useFormState`로 필드별 구독 → 해당 조각만 리렌더
- **인증**: accessToken을 zustand에 저장, axios 인터셉터로 Bearer 자동 첨부
- **서버 상태**: React Query 캐싱, `useInfiniteQuery`(+ hasNext) 무한 스크롤, 삭제 후 `invalidateQueries`로 목록 갱신

### 토큰 재발급(refresh)

accessToken이 만료되면 401을 받은 시점에 `POST /api/refresh`로 재발급받고 원래 요청을
재시도합니다. 관련 코드는 `src/api/client.ts`에 모여 있습니다.

**전략 — 반응형(reactive)**

accessToken의 `exp`를 미리 디코드해 만료 전에 갱신하는 선제형(proactive) 방식도 가능하지만,
시계 오차 처리와 갱신 타이머 관리가 따라붙습니다. 401을 신호로 삼는 반응형을 택했습니다.
요청 한 번이 실패한 뒤 재시도되지만 흐름이 단순하고 검증하기 쉽습니다.

**명세 해석 — 응답 본문의 `refreshToken`은 저장하지 않습니다**

`AuthTokenResponse`가 `refreshToken`을 본문으로 내려주지만 프론트에서 사용하지 않습니다.

- `/api/refresh`에는 `requestBody`가 정의되어 있지 않습니다. 즉 재발급 자격 증명을 본문으로
  보낼 통로가 명세에 없습니다. 유일하게 선언된 채널은 보안 스킴 `refreshTokenCookie`(쿠키)입니다.
- 해당 스킴의 설명이 "**In browser clients**, send requests with credentials"로 한정되어 있습니다.
  브라우저가 아닌 클라이언트(쿠키 자동 첨부가 없는 네이티브 앱 등)를 위해 본문에도 함께 내려주는
  것으로 해석했고, 브라우저 클라이언트인 이 앱은 쿠키 경로만 사용합니다.
- refresh 토큰을 localStorage에 저장하면 XSS로 탈취될 수 있어, 쿠키를 지정한 명세의 의도와
  어긋납니다.

따라서 refresh 토큰은 쿠키로만 오가고 **프론트 JS는 쿠키를 직접 읽거나 쓰지 않습니다.**
axios 인스턴스에 `withCredentials: true`를 설정해 브라우저가 자동으로 첨부하도록 했습니다.

**동시 요청 처리 — single-flight**

한 화면에서 여러 요청이 동시에 나가면 만료 시 모두 401을 받습니다. 각자 재발급을 호출하면
불필요한 중복 요청이 생기고, 서버가 refresh 토큰을 회전시키는 경우 뒤늦은 호출이 이미 폐기된
토큰을 쓰게 되어 정상 사용자가 로그아웃됩니다.

이를 막기 위해 진행 중인 재발급 Promise를 모듈 변수 하나로 공유합니다. 첫 번째 요청만 재발급을
시작하고 나머지는 같은 Promise를 `await` 합니다. `await`가 대기 큐 역할을 하므로 별도의 큐
자료구조가 필요 없습니다. 재발급이 끝나면 대기하던 요청들이 함께 깨어나 각자 재시도합니다.

**무한 루프 차단**

- 재시도 요청에 `_retry` 표식을 남겨, 재발급 후에도 401이면 다시 재발급하지 않습니다.
  (재발급 기회는 요청당 한 번)
- `/api/refresh` 자체가 401이면 재발급할 방법이 없으므로 즉시 인증을 해제하고 로그인으로 보냅니다.
- 재시도 시 원본 요청의 `Authorization` 헤더를 새 토큰으로 직접 갱신합니다. 요청 인터셉터는 이미
  지나간 뒤라 자동으로 갱신되지 않으며, 빠뜨리면 재시도도 401을 받고 로그아웃됩니다.

**MSW 환경의 한계**

목 백엔드가 `Set-Cookie`로 쿠키를 심고 프론트가 그 쿠키로 재발급받는 왕복은 실제로 동작합니다.
다만 **HttpOnly·Secure·SameSite는 서버가 강제해야 의미를 갖는 속성이라 클라이언트 사이드
모킹에서는 적용되지 않습니다.** 실서버에서는 이 속성들이 함께 설정되어야 하며, 프론트 코드는
쿠키를 만지지 않으므로 서버 교체 시 변경이 필요 없습니다.

### 토큰 만료 흐름 확인

MSW는 `expired-token`을 만료된 accessToken으로 취급합니다. 로그인 후 devtools 콘솔에서
아래 두 시나리오를 확인할 수 있습니다.

**① 재발급 성공** — 401 → `/api/refresh` → 새 토큰으로 재시도 → 화면 정상 표시

```js
localStorage.setItem(
  "auth-storage",
  JSON.stringify({ state: { accessToken: "expired-token" }, version: 0 }),
);
location.reload();
```

Network 탭에서 `401` → `POST /api/refresh` → 같은 요청 `200` 순서를 볼 수 있습니다.
여러 요청이 동시에 401을 받아도 `/api/refresh`는 한 번만 호출됩니다(single-flight).

**② 재발급 실패** — refresh 토큰까지 만료된 상황 → 인증 해제 후 로그인 페이지로 이동

MSW는 `mock-refresh-expired` 키가 `true`이면 재발급 요청에 항상 401을 반환합니다.

```js
localStorage.setItem("mock-refresh-expired", "true");
localStorage.setItem(
  "auth-storage",
  JSON.stringify({ state: { accessToken: "expired-token" }, version: 0 }),
);
location.reload();
```

`401` → `POST /api/refresh` `401` 순서로 찍히고, 로그인 페이지로 이동합니다.
원래대로 돌리려면 `localStorage.removeItem("mock-refresh-expired")` 후 다시 로그인하세요.

## 컨벤션

- 커밋: Conventional Commits (feat/fix/chore/docs/refactor)
- 파일명: 컴포넌트 PascalCase, 그 외 camelCase, 폴더 소문자/kebab
- import: `@/` 별칭
