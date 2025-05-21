import "./App.css";
import MenuItems from "./MenuItem";
import { useEffect, useState } from "react";
import ChooseDateContainer from "./ChooseDateContainer.jsx";
import ChooseTime from "./ChooseTime.jsx";

function App() {
  const menuItemsList = [
    { name: "צילום תמונה", price: "100" },
    { name: "וידאו", price: "150" },
    { name: "פוטושופ", price: "250" },
    { name: "צילום תמונה+פוטושופ", price: "300" },
    { name: "וידאו + עריכה", price: "350" },
    { name: "הכל", price: "500" },
  ];

  const [appointmentInfo, setAppointment] = useState({
    date: new Date(),
    service: "",
    additionalRequests: "",
    email: "",
  });
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
    setAppointment((prev) => ({
      ...prev,
      date: new Date(dateObj["start"]),
    }));
  }
  function handleTimeBtnClick(event, time) {
    useEffect(() => {
      fetch(inhere, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: appointmentInfo["date"],
          time: appointmentInfo["time"],
          additionalRequests: appointmentInfo["additionalRequests"],
          email: appointmentInfo["email"],
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }, []);
  }
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
          <>
            <MenuItems
              menuItemsList={menuItemsList}
              onClick={() => setIsClicked((prev) => !prev)}
              setWindow={setWindow}
            ></MenuItems>
          </>
        )}

        {windowChooser == "date" && (
          <ChooseDateContainer
            handleDayClick={handleDayClick}
            setWindow={setWindow}
          ></ChooseDateContainer>
        )}
        <div className="chooseTimeContainer">
          {windowChooser == "setAppointment" && (
            <>
              <ChooseTime /*display set appointment area*/
                date={appointmentInfo}
                setAppointment={setAppointment}
                times={times}
                setWindow={setWindow}
                handleTimeBtnClick={handleTimeBtnClick}
              ></ChooseTime>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
