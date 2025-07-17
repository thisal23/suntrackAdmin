import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "./App.css";
import App from "./App.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Login from "./pages/Login/Login.jsx";
import { AuthProvider } from "./contexts/AuthContext";
import AdminRegister from "./pages/AdminRegister/AdminRegister.jsx";
import FleetManagers from "./pages/FleetManagers/FleetManagers.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/admin-register",
    element: <AdminRegister />,
  },
  {
    path: "/manage-fleet-managers",
    element: <FleetManagers />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
