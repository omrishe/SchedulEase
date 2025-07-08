import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage.jsx';
import Login from './pages/login.jsx';
import Register from './pages/Register.jsx';
function App() {
   const [userData,setUserData]=useState(); //either uplift appointmentinfo or do this with userData
  return(
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainPage userData={userData} setUserData={setUserData}></MainPage>}></Route>
      <Route path="/login" element={<Login></Login>}></Route>
      <Route path="/register" element={<Register></Register>}></Route>
    </Routes>
    </BrowserRouter>
  
  )}
export default App;
