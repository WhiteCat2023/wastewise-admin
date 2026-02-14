import ForgotPassword from "./pages/forgot-password";
import Login from "./pages/login";
import NewPassword from "./pages/new-password";
import Dashboard from "./pages/dashboard/index";
import Users from "./pages/dashboard/users";
import Reports from "./pages/dashboard/reports";
import Settings from "./pages/dashboard/settings";
import AuthServiceProvider from "./service/auth/auth.firebase"
import { useAuthService } from "./service/auth/auth.firebase";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Layout from "./pages/dashboard/layout";

function ProtectedRoute({ children }) {
  const { user, authReady } = useAuthService()

  if (!authReady) {
    return null
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function PublicRoute({ children }) {
  const { user, authReady } = useAuthService()

  if (!authReady) {
    return null
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

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
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Dashboard /> },
        { path: "users", element: <Users /> },
        { path: "reports", element: <Reports /> },
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


