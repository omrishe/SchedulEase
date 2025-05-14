import "./App.css";
import MenuItems from "./MenuItem";
import { useState } from "react";
import DateContainer from "./DateContainer.jsx";

function App() {
  const menuItemsList = [
    { name: "A", price: "10" },
    { name: "B", price: "20" },
    { name: "C", price: "30" },
    { name: "D", price: "40" },
    { name: "E", price: "50" },
    { name: "F", price: "60" },
  ];
  const [isClicked, setIsClicked] = useState(false);
  function openWaze() {
    const latitude = 32.051403;
    const longitude = 34.811563;
    const wazeurl = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
    window.open(wazeurl, "_blank");
  }
  function openWhatsapp() {
    const whatsappUrl = `https://wa.me/00000000`;
    window.open(whatsappUrl, "_blank");
  }
  function openPhone() {
    window.location.href = "tel:+00000000";
  }
  function setDate() {
    setIsClicked((prev) => !prev);
    if (isClicked) {
    }
    return;
  }
  return (
    <>
      <div className="mainWindow">
        <p className="welcomeParagraph">welcome</p>
        <button className="loginBtn">already have a user? log in</button>
        <div className="ContactInfoContainer">
          <button className="whatsappBtn" onClick={openWhatsapp}></button>
          <button className="phoneBtn" onClick={openPhone}></button>
          <button className="wazeBtn" onClick={openWaze}></button>
        </div>
        <MenuItems
          menuItemsList={menuItemsList}
          onClick={() => setIsClicked((prev) => !prev)}
        ></MenuItems>
        <DateContainer></DateContainer>
        <button className="NextBtn" hidden={!isClicked}>
          Next
        </button>
      </div>
    </>
  );
}

export default App;
