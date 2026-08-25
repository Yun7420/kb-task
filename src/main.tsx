import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "pretendard/dist/web/variable/pretendardvariable.css";
import "./styles/global.css";
import App from "./App.tsx";

// 이 프로젝트는 백엔드가 MSW뿐이므로 프로덕션 빌드에서도 워커를 시작한다
async function enableMocking() {
  const { worker } = await import("./mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" });
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
