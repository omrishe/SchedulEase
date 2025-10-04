import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage.jsx";
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx";
import { validateToken } from "./api/auth.js";
import { AdminPanel } from "./pages/AdminPanel.jsx";
import SuperAdminPanel from "./pages/SuperAdminPanel.jsx";

function App() {
  const [userAuthData, setUserAuthData] = useState({
    userId: localStorage.getItem("userId"),
    userName: localStorage.getItem("userName"),
    email: localStorage.getItem("email"),
    role: localStorage.getItem("role"),
    storeId : localStorage.getItem("storeId")
  });

  function saveToLocalStorage(data) {
    //does not work for inherited objects
    try {
      for (const key in data) {
        localStorage.setItem(key, data[key]);
      }
    } catch (err) {
      console.error("failed to save to local storage see log ", err);
    }
  }


  function resetUserData() {
    setUserAuthData({
      userId: null,
      userName: null,
      email: null,
      role: null,
      storeId:null
    });
    resetlocalStorage();
  }

  function resetlocalStorage() {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("storeId")
  }

  useEffect(() => {
    async function verifyTokenAndClearData() {
      const isTokenValid = await validateToken();
      if (!isTokenValid.isSuccess) {
        console.error("invalid token,resetting data",isTokenValid)
        resetUserData();
      }
    }
    verifyTokenAndClearData();
  }, []);

  async function updateAuthData(newAuthData)
  {
    setUserAuthData({...userAuthData,...newAuthData});
    saveToLocalStorage(newAuthData);
  }
  
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/store/:slug"
          element={
            <MainPage
              userAuthData={userAuthData}
              resetUserData={resetUserData}
            ></MainPage>
          }
        ></Route>
        <Route
          path="/store/:slug/login"
          element={
            <Login
              userAuthData={userAuthData}
              updateAuthData={updateAuthData}
            ></Login>
          }
        ></Route>
        <Route path="/store/:slug/register" element={<Register></Register>}></Route>
        <Route
          path="/store/:slug/adminPanel"
          element={
            <AdminPanel
              userAuthData={userAuthData}
            ></AdminPanel>
          }
        ></Route>
        <Route
          path="/superadminPanel"
          element={
            <SuperAdminPanel
            ></SuperAdminPanel>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
