import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore, authSelector } from "@/stores";
import styles from "./Layout.module.css";

const navClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? `${styles.navItem} ${styles.active}` : styles.navItem;

export function Layout() {
  const isAuthenticated = useAuthStore(authSelector.isAuthenticated);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/sign-in");
  };

  return (
    <div className={styles.layout}>
      <header className={styles.gnb}>
        <span className={styles.logo}>KB Task</span>
        {isAuthenticated && (
          <button className={styles.logout} onClick={handleLogout}>
            로그아웃
          </button>
        )}
      </header>
      <div className={styles.body}>
        <aside className={styles.lnb}>
          <nav className={styles.nav}>
            {/* 라우트 맵: 인증과 무관하게 항상 노출 (비로그인 시 클릭하면 인증 가드가 로그인으로 보냄) */}
            {/* "/"는 end 없이는 모든 경로에 매칭되므로 정확히 일치할 때만 active */}
            <NavLink to="/" end className={navClassName}>
              📊 대시보드
            </NavLink>
            {/* 상세(/task/:id)에서도 "할 일"이 active로 유지됨 */}
            <NavLink to="/task" className={navClassName}>
              📋 할 일
            </NavLink>
            {/* 로그인/회원정보: 인증 상태에 따라 전환 */}
            {isAuthenticated ? (
              <NavLink to="/user" className={navClassName}>
                👤 회원정보
              </NavLink>
            ) : (
              <NavLink to="/sign-in" className={navClassName}>
                🔑 로그인
              </NavLink>
            )}
          </nav>
        </aside>
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
