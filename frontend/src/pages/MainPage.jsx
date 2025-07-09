import "../App.css";
import MenuItems from "../components/MenuItem.jsx";
import { useState } from "react";
import ChooseDateContainer from "../components/ChooseDateContainer.jsx";
import ChooseTime from "../components/ChooseTime.jsx";
import * as appointmentsAPI from "../api/appointments.js";
import params from "../params.json";
import { useNavigate } from "react-router-dom";

//todo uplift the appointmentinfo or do a new auth object containing the user info
const { menuItemsList, times } = params;
function MainPage(userAuthData) {
  const navigatePage = useNavigate();
  const [appointmentInfo, setAppointment] = useState({
    date: new Date(),
    service: "",
    name: "test",
    additionalRequests: "",
    email: "test@test.com",
  });
  const [windowChooser, setWindow] = useState("items");
  const [userName, setUserName] = useState();
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
      const resolve = await appointmentsAPI.createAppointment(data); //resolve contains the appointment info
      if (resolve) {
        console.log("successfully created appointment");
        setUserName(resolve.name);
        return { ...resolve, message: "successfully created appointment" };
      }
    } catch (error) {
      console.error("failed to create appointment");
      return { message: "failed to create appointment" };
    }
  }
  return (
    <>
      <div className="mainWindow">
        <p className="welcomeParagraph">
          {userAuthData && `welcome ${userAuthData.userName}`}
        </p>
        <button className="loginBtn" onClick={() => navigatePage("/login")}>
          login
        </button>
        <button onClick={() => navigatePage("register")}>
          dont have a user? Register
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
export default MainPage;
