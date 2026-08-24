import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      {/* Header */}
      <header>
        <h1>KB Task</h1>
      </header>
      {/* Sidebar */}
      <aside>
        <nav>
          <Link to="/">대시보드</Link>
          <Link to="/task">할 일 목록</Link>
          <Link to="/user">회원정보</Link>
        </nav>
      </aside>
      {/* Main */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
