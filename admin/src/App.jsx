import ForgotPassword from "./pages/forgot-password";
import Login from "./pages/login";
import NewPassword from "./pages/new-password";
import Dashboard from "./pages/dashboard/dashboard";
import AuthServiceProvider from "./service/auth/auth.firebase"
import { useAuthService } from "./service/auth/auth.firebase";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

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
    { path: "/dashboard", element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ) },
  ]);
    
  return (
    <AuthServiceProvider>
      <RouterProvider router={router} />
    </AuthServiceProvider>
  )
}


