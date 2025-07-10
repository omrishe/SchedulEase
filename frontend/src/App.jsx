import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/Register.jsx";
import {validateToken} from "./api/auth.js"
function App() {
  const [userAuthData, setUserAuthData] = useState({
    userId: localStorage.getItem("userId"),
    userName: localStorage.getItem("userName"),
    email: localStorage.getItem("userEmail"),
  });
  console.log("in app.jsx" ,localStorage.getItem("userName"))
  console.log("in app.jsx",userAuthData);
  const isTokenValid=validateToken();
  if(!isTokenValid){
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setUserAuthData({userId : null, userName: null, userEmail: null});
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<MainPage userAuthData={userAuthData}></MainPage>}
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
      </Routes>
    </BrowserRouter>
  );
}
export default App;
