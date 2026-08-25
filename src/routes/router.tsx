import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/components/layout";
import { ProtectedRoute } from "./ProtectedRoute";
import SignInPage from "@/pages/sign-in";
import DashboardPage from "@/pages/dashboard";
import TaskListPage from "@/pages/task-list";
import TaskDetailPage from "@/pages/task-detail";
import UserPage from "@/pages/user";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      // Sign In
      { path: "/sign-in", element: <SignInPage /> },
      {
        // ProtectedRoute
        element: <ProtectedRoute />,
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
