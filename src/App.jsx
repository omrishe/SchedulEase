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
  const [dateObject, setDate] = useState(new Date());
  const [windowChooser, setWindow] = useState("items");

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
  function handleDayClick(dateObj) {
    setDate(new Date(dateObj["start"]));
  }
  function handleTimeBtnClick(event, time) {}
  const times = [
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ];
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
        {windowChooser == "items" && (
          <MenuItems
            menuItemsList={menuItemsList}
            onClick={() => setIsClicked((prev) => !prev)}
          ></MenuItems>
        )}
        <button className="NextBtn" hidden={!isClicked}>
          Next
        </button>
        <DateContainer handleDayClick={handleDayClick}></DateContainer>
        <div className="chooseTimeContainer">
          <button className="backBtn">Back</button>
          <span>Date Selected:{dateObject.toLocaleDateString("en-GB")}</span>
          <span>please choose time</span>
          <div className="timeOptions">
            {times.map((time) => (
              <button
                className="TimeOptionBtn"
                key={time}
                onClick={() => handleTimeBtnClick(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
