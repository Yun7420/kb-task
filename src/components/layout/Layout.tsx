import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore, authSelector } from "@/stores";
import styles from "./Layout.module.css";

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
            <Link to="/" className={styles.navItem}>
              📊 대시보드
            </Link>
            <Link to="/task" className={styles.navItem}>
              📋 할 일
            </Link>
            {isAuthenticated ? (
              <Link to="/user" className={styles.navItem}>
                👤 회원정보
              </Link>
            ) : (
              <Link to="/sign-in" className={styles.navItem}>
                🔑 로그인
              </Link>
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
