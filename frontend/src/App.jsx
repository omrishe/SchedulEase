import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import { validateToken } from "./services/authService.js";
import { AdminDashboardPage } from "./pages/AdminDashboardPage.jsx";
import SystemAdminPage from "./pages/SystemAdminPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

//main entery point
//contains helper functions and define the routing
function App() {
  const [userAuthData, setUserAuthData] = useState({
    userId: localStorage.getItem("userId"),
    userName: localStorage.getItem("userName"),
    email: localStorage.getItem("email"),
    role: localStorage.getItem("role"),
    storeId: localStorage.getItem("storeId"),
  });

  function saveToLocalStorage(data) {
    try {
      for (const key in data) {
        localStorage.setItem(key, data[key]);
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("failed to save to local storage see log ", err);
      }
    }
  }

  function resetUserData() {
    setUserAuthData({
      userId: null,
      userName: null,
      email: null,
      role: null,
      storeId: null,
    });
    resetlocalStorage();
  }

  function resetlocalStorage() {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("storeId");
  }

  useEffect(() => {
    const controller = new AbortController();
    async function verifyTokenAndClearData() {
      const isTokenValid = await validateToken(controller.signal);
      if (!isTokenValid) return;
      if (isTokenValid.code === "TOKEN_INVALID") {
        resetUserData();
      } else if (isTokenValid.code === "VALIDATE_TOKEN_ERROR") {
        if (import.meta.env.DEV) {
          console.warn(
            isTokenValid.otherData?.message || "Token validation aborted",
          );
        }
      }
    }
    verifyTokenAndClearData();

    return () => {
      controller.abort();
    };
  }, []);

  async function updateAuthData(newAuthData) {
    return new Promise((resolve) => {
      setUserAuthData((prev) => {
        const updated = { ...prev, ...newAuthData };
        resolve(updated);
        saveToLocalStorage(updated);
        return updated;
      });
    });
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/store/:slug"
          element={
            <HomePage
              userAuthData={userAuthData}
              resetUserData={resetUserData}
            ></HomePage>
          }
        ></Route>
        <Route
          path="/store/:slug/login"
          element={
            <LoginPage
              userAuthData={userAuthData}
              updateAuthData={updateAuthData}
            ></LoginPage>
          }
        ></Route>
        <Route
          path="/store/:slug/register"
          element={<RegisterPage></RegisterPage>}
        ></Route>
        <Route
          path="/store/:slug/adminPanel"
          element={
            <AdminDashboardPage
              userAuthData={userAuthData}
            ></AdminDashboardPage>
          }
        ></Route>
        <Route
          path="/superadminPanel"
          element={<SystemAdminPage></SystemAdminPage>}
        ></Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
