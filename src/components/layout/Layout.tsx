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
            <NavLink to="/" end className={navClassName}>
              📊 대시보드
            </NavLink>
            <NavLink to="/task" className={navClassName}>
              📋 할 일
            </NavLink>
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
