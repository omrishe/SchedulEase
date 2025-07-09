import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/Register.jsx";
function App() {
  const [userAuthData, setUserAuthData] = useState({
    id: null,
    userName: "",
    email: "",
  });
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
