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

\`\`\`bash
pnpm install
pnpm dev
\`\`\`
→ http://localhost:5173

### 테스트 계정

백엔드가 MSW로 모킹되어 아래 고정 계정으로 로그인합니다.

- 이메일: \`test@kb.com\`
- 비밀번호: \`test1234\`

## 구현 기능

- **로그인** (\`/sign-in\`) — zod 유효성 검증, 실패 시 에러 모달, 성공 시 토큰 저장 + 인증 가드
- **대시보드** (\`/\`) — 할 일 통계(일/해야할 일/한 일)
- **할 일 목록** (\`/task\`) — 카드 목록, 가상 스크롤 + 무한 스크롤
- **할 일 상세** (\`/task/:id\`) — 상세 조회, 404 화면, 삭제 모달(ID 입력 일치 시 활성화)
- **회원정보** (\`/user\`)

## 프로젝트 구조

페이지 단위 코로케이션 — 각 페이지가 쓰는 concern(api/hooks/components/schema)만 폴더로 가짐.

\`\`\`
src/
├── api/ 공통 axios 인스턴스 + 인터셉터
├── components/ 공유 UI (Button, Input, Modal, Layout)
├── mocks/ MSW 핸들러 + 목 데이터
├── pages/ 페이지별 폴더 (각자 api/hooks/components/schema)
├── routes/ 라우터 + 인증 가드
├── stores/ zustand (인증)
├── styles/ 전역 스타일 + 색상 토큰
└── types/ API 계약 타입
\`\`\`

## 주요 설계

- **관심사 분리**: 로직은 hooks, 뷰는 컴포넌트 (페이지는 조립만)
- **렌더 격리**: 로그인 폼에서 \`useFormState\`로 필드별 구독 → 해당 조각만 리렌더
- **인증**: accessToken을 zustand에 저장, axios 인터셉터로 Bearer 자동 첨부
- **서버 상태**: React Query 캐싱, \`useInfiniteQuery\`(+ hasNext) 무한 스크롤, 삭제 후 \`invalidateQueries\`로 목록 갱신

## 컨벤션

- 커밋: Conventional Commits (feat/fix/chore/docs/refactor)
- 파일명: 컴포넌트 PascalCase, 그 외 camelCase, 폴더 소문자/kebab
- import: \`@/\` 별칭
