import ForgotPassword from "./pages/forgot-password";
import Login from "./pages/login";
import NewPassword from "./pages/new-password";
import Dashboard from "./pages/dashboard/index";
import Users from "./pages/dashboard/drivers";
import Announcements from "./pages/dashboard/announcements";
import Reports from "./pages/dashboard/reports";
import AuthServiceProvider from "./service/auth/auth.firebase"
import { useAuthService } from "./service/auth/auth.firebase";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import DashboardLayout from "./layout/dashboard-layout";
import ProtectedRoute from "./route/protected-route";
import PublicRoute from "./route/public-route";
import Schedules from "./pages/dashboard/schedules";

export default function App() {
  
  const router = createBrowserRouter([
    { path: "/", element: <Navigate to="/login" replace /> },
    { path: "/login", element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ) },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/new-password", element: <NewPassword /> },
    { 
      path: "/dashboard", 
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Dashboard /> },
        { path: "drivers", element: <Users /> },
        { path: "announcements", element: <Announcements /> },
        { path: "reports", element: <Reports /> },
        { path: "schedules", element: <Schedules /> },
      ]
    },
  ]);
    
  return (
    <AuthServiceProvider>
      <RouterProvider router={router} />
    </AuthServiceProvider>
  )
}


