import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/Register.jsx";
import { validateToken } from "./api/auth.js";
import { AdminPanel } from "./pages/AdminPanel.jsx";
function App() {
  const [userAuthData, setUserAuthData] = useState({
    userId: localStorage.getItem("userId"),
    userName: localStorage.getItem("userName"),
    email: localStorage.getItem("userEmail"),
  });
  const [isDoneCheckingToken, setIsDoneCheckingToken] = useState(false);
  console.log("in app.jsx", localStorage.getItem("userName"));
  console.log("in app.jsx", userAuthData);

  function resetUserData() {
    setUserAuthData({
      userId: null,
      userName: null,
      email: null,
    });
  }
  function resetlocalStorage() {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
  }
  useEffect(() => {
    async function verifyTokenAndClearData() {
      const isTokenValid = await validateToken();
      if (!isTokenValid) {
        resetlocalStorage();
        setUserAuthData({ userId: null, userName: null, userEmail: null });
      }
      setIsDoneCheckingToken(true);
    }
    verifyTokenAndClearData();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              userAuthData={userAuthData}
              resetUserData={resetUserData}
              resetlocalStorage={resetlocalStorage}
              setUserAuthData={setUserAuthData}
            ></MainPage>
          }
        ></Route>
        <Route
          path="/login"
          element={
            <Login
              userAuthData={userAuthData}
              setUserAuthData={setUserAuthData}
            ></Login>
          }
        ></Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route
          path="/adminPanel"
          element={<AdminPanel userAuthData={userAuthData}></AdminPanel>}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
