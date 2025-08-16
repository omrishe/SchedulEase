import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/Register.jsx";
import { validateToken } from "./api/auth.js";
import { AdminPanel } from "./pages/AdminPanel.jsx";
import params from "./params.json";
import SuperAdminPanel from "./pages/SuperAdminPanel.jsx";
function App() {
  const { menuItemsList, times } = params;
  const [userAuthData, setUserAuthData] = useState({
    userId: localStorage.getItem("userId"),
    userName: localStorage.getItem("userName"),
    email: localStorage.getItem("userEmail"),
    role: localStorage.getItem("role"),
  });

  useEffect(() => setUserDataToLocalStorage(userAuthData), [userAuthData]); //sync userdata to localstorage

  function setUserDataToLocalStorage(data) {
    //does not work for inherited objects
    try {
      for (const key in data) {
        localStorage.setItem(key, data[key]);
      }
    } catch (err) {
      console.error("failed to save to local storage see log ", err);
    }
  }

  console.log("in app.jsx", userAuthData);

  function resetUserData() {
    setUserAuthData({
      userId: null,
      userName: null,
      email: null,
      role: null,
    });
  }

  function resetlocalStorage() {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("role");
  }

  useEffect(() => {
    async function verifyTokenAndClearData() {
      const isTokenValid = await validateToken();
      if (!isTokenValid.success) {
        resetUserData();
      }
    }
    verifyTokenAndClearData();
    console.log("on new instance load", userAuthData);
  }, []);

  async function updateAuthData(tempAuthData)
  {
    setUserAuthData({...userAuthData,...tempAuthData});
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
              resetlocalStorage={resetlocalStorage}
              updateAuthData={updateAuthData}
              menuItemsList={menuItemsList}
              times={times}
            ></MainPage>
          }
        ></Route>
        <Route
          path="/store/:slug/login"
          element={
            <Login
              setUserDataToLocalStorage={setUserDataToLocalStorage}
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
              allTimes={params.allTimes}
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
