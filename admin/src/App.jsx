import Login from "./pages/login";
import AuthServiceProvider from "./service/auth/auth.firebase"
import {createBrowserRouter, RouterProvider} from "react-router-dom"

export default function App() {
  
  const router = createBrowserRouter([
    {path: "/", element: <Login/>}
  ]);
    
  return (
    <AuthServiceProvider>
      <RouterProvider router={router} />
    </AuthServiceProvider>
  )
}


