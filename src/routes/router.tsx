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
      { path: "/sign-in", element: <SignInPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/", element: <DashboardPage /> },
          { path: "/task", element: <TaskListPage /> },
          { path: "/task/:id", element: <TaskDetailPage /> },
          { path: "/user", element: <UserPage /> },
        ],
      },
    ],
  },
]);
