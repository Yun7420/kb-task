import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/layout";
import SignInPage from "../pages/SignInPage";
import DashboardPage from "../pages/DashboardPage";
import TaskListPage from "../pages/TaskListPage";
import TaskDetailPage from "../pages/TaskDetailPage";
import UserPage from "../pages/UserPage";

export const router = createBrowserRouter([
  {
    // Sign In
    path: "/sign-in",
    element: <SignInPage />,
  },
  {
    // Layout
    element: <Layout />,
    children: [
      // Dashboard
      { path: "/", element: <DashboardPage /> },
      // Task List
      { path: "/task", element: <TaskListPage /> },
      // Task Detail
      { path: "/task/:id", element: <TaskDetailPage /> },
      // User
      { path: "/user", element: <UserPage /> },
    ],
  },
]);
