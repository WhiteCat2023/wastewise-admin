import ForgotPassword from "./pages/forgot-password";
import Login from "./pages/login";
import AuthServiceProvider from "./service/auth/auth.firebase"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

export default function App() {
  
  const router = createBrowserRouter([
    { path: "/", element: <Navigate to="/login" replace /> },
    { path: "/login", element: <Login /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
  ]);
    
  return (
    <AuthServiceProvider>
      <RouterProvider router={router} />
    </AuthServiceProvider>
  )
}


