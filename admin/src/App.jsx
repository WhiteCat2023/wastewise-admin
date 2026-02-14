import ForgotPassword from "./pages/forgot-password";
import Login from "./pages/login";
import NewPassword from "./pages/new-password";
import Dashboard from "./pages/dashboard/index";
import Users from "./pages/dashboard/drivers";
import Announcements from "./pages/dashboard/announcements";
import Settings from "./pages/dashboard/settings";
import AuthServiceProvider from "./service/auth/auth.firebase"
import { useAuthService } from "./service/auth/auth.firebase";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import DashboardLayout from "./layout/dashboard-layout";
import ProtectedRoute from "./route/protected-route";
import PublicRoute from "./route/public-route";

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
        { path: "users", element: <Users /> },
        { path: "announcements", element: <Announcements /> },
        { path: "settings", element: <Settings /> },
      ]
    },
  ]);
    
  return (
    <AuthServiceProvider>
      <RouterProvider router={router} />
    </AuthServiceProvider>
  )
}


