import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/layout";
import DashboardPage from "../pages/DashboardPage";
import SignInPage from "../pages/SignInPage";
import TaskListPage from "../pages/TaskListPage";
import TaskDetailPage from "../pages/TaskDetailPage";
import UserPage from "../pages/UserPage";

export const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: <SignInPage />,
  },
  {
    element: <Layout />,
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/task", element: <TaskListPage /> },
      { path: "/task/:id", element: <TaskDetailPage /> },
      { path: "/user", element: <UserPage /> },
    ],
  },
]);
