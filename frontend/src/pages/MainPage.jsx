import MenuItems from "../components/MenuItem.jsx";
import { useState, useEffect } from "react";
import ChooseDateContainer from "../components/ChooseDateContainer.jsx";
import ChooseTime from "../components/ChooseTime.jsx";
import {createAppointment,getAvailableAppointments} from "../api/appointments.js";
import params from "../params.json";
import { useNavigate, useLocation,useParams, } from "react-router-dom";
import { logout } from "../api/auth.js";
import { sendRejectedResponse } from "../utils/responseHandler.js";

function MainPage({
  menuItemsList,
  times,
  userAuthData,
  resetUserData,
  updateAuthData,
  resetlocalStorage,
}) {
  const navigatePage = useNavigate();
  const [appointmentInfo, setAppointment] = useState({
    date: new Date(),
    service: "",
    userName: localStorage.getItem("userName"),
    additionalRequests: "",
    email: localStorage.getItem("userEmail"),
    storeID:localStorage.getItem("storeID"),
  });
  const { slug } = useParams();
  const [logoutMsg, setLogoutMsg] = useState();
  const [windowChooser, setWindow] = useState("items");
  console.log("in mainpage appointmentinfo is:",appointmentInfo)
  
  //synchronize the email and userName with appointment info on change
  useEffect(()=> {
    updateAppointmentInfo({email:userAuthData["email"],userName:userAuthData["userName"]})
    console.log("runs useEffect - updateAppointmentInfo")
  },[userAuthData.email,userAuthData.userName])

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
  //gets available appointments WIP
  getAvailableAppointments(appointmentInfo.storeID ? {storeId:appointmentInfo.storeID} : {storeSlug:slug}).then((availableAppointments)=>
  console.log("availableAppointments are:\n",availableAppointments))
  
  async function handleChooseTimeOnlick(timeArray) {
    try{
    const tempDate = new Date(appointmentInfo.date);
    const [hours, minutes] = timeArray[0].split(":");
    tempDate.setHours(hours, minutes);
      const response = await createAppointment(updateAppointmentInfo({ date: tempDate })); //response contains the appointment info
      if (response) {
        return response;
      }
    } catch (error) {
      response=sendRejectedResponse({message:"failed to create appointment",otherData:error})
      console.error(response);
      return response;
    }
  }

  //helper function that updates appointmentinfo with the new field and returns a copy of the resulting appointmentinfo
  function updateAppointmentInfo(newInfo) {
    setAppointment((prev) => ({
      ...prev, // keep all old fields
      ...newInfo, // overwrite with new fields
    }));
    return {...appointmentInfo,...newInfo};
  }

  function handleLogout() {
    if (logout()) {
      console.log("logged out sucessfully");
      setLogoutMsg("logged out sucessfully");
      resetUserData();
      setAppointment(
        {date: "",service: "",
        userName: "", additionalRequests: "",
        email: ""})
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
      <button className="loginBtn" onClick={() => navigatePage(`/store/${slug}/login`)}>
        login
      </button>
      <button onClick={() => navigatePage(`/store/${slug}/register`)}>
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
          <>
            <ChooseDateContainer
              updateDate={updateAppointmentInfo}
            ></ChooseDateContainer>
            <button
              onClick={() => {
                setWindow("setAppointment");
              }}
            >
              Next
            </button>
          </>
        )}

        <div className="chooseTimeContainer">
          {windowChooser == "setAppointment" && (
            <>
              <ChooseTime //display set appointment area
                appointmentInfo={appointmentInfo}
                times={times}
                maxTimeSelections={1}
                handleChooseTimeOnlick={handleChooseTimeOnlick}
              ></ChooseTime>
              <button className="backBtn" onClick={() => setWindow("date")}>
                Back
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
export default MainPage;
