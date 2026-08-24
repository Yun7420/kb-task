import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/layout";
import { ProtectedRoute } from "./protected-route";
import SignInPage from "@/pages/sign-in";
import DashboardPage from "@/pages/DashboardPage";
import TaskListPage from "@/pages/task-list";
import TaskDetailPage from "@/pages/task-detail";
import UserPage from "@/pages/UserPage";

export const router = createBrowserRouter([
  {
    // Sign In
    path: "/sign-in",
    element: <SignInPage />,
  },
  {
    // ProtectedRoute
    element: <ProtectedRoute />,
    // Layout
    children: [
      {
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
    ],
  },
]);
