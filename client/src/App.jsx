import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ConfigProvider } from "antd";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import { useAuth } from "./store/hooks";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [blockRoute, setBlockRoute] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      setBlockRoute(false);
    } else {
      setBlockRoute(true);
    }
  }, [isAuthenticated, blockRoute]);

  useEffect(() => {
    if (!blockRoute) return;

    const addDummyState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    addDummyState();

    window.addEventListener("popstate", addDummyState);

    return () => {
      window.removeEventListener("popstate", addDummyState);
    };
  }, [blockRoute]);
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#1890ff",
            borderRadius: 6,
          },
        }}
      >
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={<Navigate to="/dashboard/analytics" replace />}
              />
              <Route path="analytics" element={<Analytics />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </ConfigProvider>
    </>
  );
}

export default App;
