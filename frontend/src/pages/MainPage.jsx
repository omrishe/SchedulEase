import "../App.css";
import MenuItems from "../components/MenuItem.jsx";
import { useState, useEffect } from "react";
import ChooseDateContainer from "../components/ChooseDateContainer.jsx";
import ChooseTime from "../components/ChooseTime.jsx";
import * as appointmentsAPI from "../api/appointments.js";
import params from "../params.json";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../api/auth.js";

//todo uplift the appointmentinfo or do a new auth object containing the user info
const { menuItemsList, times } = params;
function MainPage({
  userAuthData,
  resetUserData,
  resetlocalStorage,
  setUserAuthData,
}) {
  const navigatePage = useNavigate();
  const location = useLocation();
  const [appointmentInfo, setAppointment] = useState({
    date: new Date(),
    service: "",
    name: "",
    additionalRequests: "",
    email: "",
  });
  const [logoutMsg, setLogoutMsg] = useState();
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

  function handleLogout() {
    if (logout()) {
      console.log("logged out sucessfully");
      setLogoutMsg("logged out sucessfully");
      resetUserData();
      resetlocalStorage();
    } else {
      console.log("an error occured");
      setLogoutMsg("an Error occured see log for more info");
    }
  }
  const welcomeMsg = (
    <p className="welcomeParagraph">
      {userAuthData.userName ? `welcome ${userAuthData.userName}` : "welcome"}
    </p>
  );
  const authControls = userAuthData["userName"] ? (
    <button className="logoutBtn" onClick={() => handleLogout()}>
      logout
    </button>
  ) : (
    <>
      <button className="loginBtn" onClick={() => navigatePage("/login")}>
        login
      </button>
      <button onClick={() => navigatePage("register")}>
        dont have a user? Register
      </button>
    </>
  );

  return (
    <>
      <div className="mainWindow">
        {welcomeMsg}
        {/**displays welcome msg if not logged in and welcome userName if logged in */}
        {authControls}
        {/**displays login/register or logout depending if logged in */}
        {logoutMsg && <p>{logoutMsg}</p>}
        {/**logout msg to display after logging out */}
        {
          <button onClick={() => navigatePage("AdminPanel")}>
            admin panel
          </button>
        }
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
