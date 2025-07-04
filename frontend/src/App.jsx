import "./App.css";
import MenuItems from "./MenuItem";
import { useEffect, useState } from "react";
import ChooseDateContainer from "./ChooseDateContainer.jsx";
import ChooseTime from "./ChooseTime.jsx";
import * as appointmentsAPI from "./api/appointments.js";
import params from "./params.json";
import LoginPopUp from "./components/LoginPopUp.jsx";
const { menuItemsList, times } = params;
//todo
//apperently i forgot js date can contain date and time,so todo combine them into 1 object
function App() {
  const [appointmentInfo, setAppointment] = useState({
    date: new Date(),
    service: "",
    name: "test",
    additionalRequests: "",
    email: "test@test.com",
  });
  const [windowChooser, setWindow] = useState("items");
  const [token, setToken] = useState("");
  const [isLoginBtnClicked, setLoginBtnClicked] = useState(false);

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

  function updateAppointmentInfo(newInfo) {
    setAppointment((prev) => ({
      ...prev, // keep all old fields
      ...newInfo, // overwrite with new fields
    }));
  }

  async function SendObjToServer(data) {
    try {
      const resolve = await appointmentsAPI.createAppointment(data);//resolve contains the appointment info
      if (resolve) {
        console.log("successfully created appointment");
      }
    } catch (error) {
      console.error("failed to create appointment");
    }
  }

  return (
    <>
      <div className="mainWindow">
        <p className="welcomeParagraph">welcome</p>
        <button
          className="loginBtn"
          onClick={() =>
            setLoginBtnClicked((prev)=>!prev)
          }
        >
          already have a user? log in
        </button>
        <LoginPopUp setToken={setToken}
          className={`LoginPopUp${isLoginBtnClicked ? " show" : ""}`}//can also use "LoginPopUp" + (isLoginBtnClicked ? " show" : "")
        ></LoginPopUp>
        <button
          className="GetAllAppointments"
          onClick={appointmentsAPI.fetchAllAppointment}
        >
          login?
        </button>
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
            updateAppointmentInfo={updateAppointmentInfo}
            setWindow={setWindow}
          ></ChooseDateContainer>
        )}
        <div className="chooseTimeContainer">
          {windowChooser == "setAppointment" && (
            <>
              <ChooseTime //display set appointment area
                appointmentInfo={appointmentInfo}
                updateAppointmentInfo={updateAppointmentInfo}
                times={times}
                setWindow={setWindow}
                SendObjToServer={SendObjToServer}
              ></ChooseTime>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
