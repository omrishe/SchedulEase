import { useState, useEffect } from "react";
import { useNavigate,useParams, } from "react-router-dom";
import { getStoreServices } from "../api/store";
import { logout } from "../api/auth.js";
import { AppointmentSelection } from "../components/AppointmentSelection.jsx";
import { getAvailableAppointments } from "../api/appointments.js";

function MainPage({
  userAuthData,
  resetUserData,
}) {
  const navigatePage = useNavigate();
  const [appointmentInfo, setAppointment] = useState({
    date: new Date(),
    service: "",
    storeId:localStorage.getItem("storeId"),
  });

  const { slug } = useParams();
  const [logoutMsg, setLogoutMsg] = useState();
  const [availableTimeSlots,setAvailableTimeSlots]=useState(["loading"])
  const [services,setServices]=useState(["loading"])

  //gets store available appointments
  useEffect(()=> {
  async function getAvailableSlots(date){
  const serverResponse=await getAvailableAppointments(
    appointmentInfo.storeId ? {storeId:appointmentInfo.storeId} : {storeSlug:slug},
    date)
    if(serverResponse.isSuccess){
      setAvailableTimeSlots(serverResponse.otherData)
    }}
  if(appointmentInfo.date){
    //create a new date only with day,month and year (no hours or seconds)
  const date=new Date(appointmentInfo.date.getFullYear(),appointmentInfo.date.getMonth(),appointmentInfo.date.getDate())
  getAvailableSlots(date)
  }},[appointmentInfo.date])

  //gets store available services
  useEffect(()=> {
  async function getServices(){
  const serverResponse=await getStoreServices(appointmentInfo.storeId ? {storeId:appointmentInfo.storeId} : {storeSlug:slug})
    if(serverResponse.isSuccess){
      setServices(serverResponse.otherData)
    }}
  getServices()
  },[])

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
        {date: new Date(),service: "",storeId:null})
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
  const userIsNotLoggedInElement=
  <><button className="loginBtn" onClick={() => navigatePage(`/store/${slug}/login`)}>
        login
      </button>
      <button onClick={() => navigatePage(`/store/${slug}/register`)}>
        dont have a user? Register
      </button></>
    
    const userIsLoggedInElement=<button className="logoutBtn" onClick={() => handleLogout()}>
      logout
    </button>

  return (
    <div className="mainPageContainer">
      <div className="interactionContainer">
        {/**displays welcome msg if not logged in and welcome userName if logged in */}
        {welcomeMsg}
        <div className="navigationBtns">
        {/**displays login/register or logout depending if logged in */}
        {userAuthData["userName"] ? userIsLoggedInElement : userIsNotLoggedInElement}
        {/**logout msg to display after logging out */}
        {logoutMsg && <p>{logoutMsg}</p>}
        {userAuthData.role=="admin" && <button onClick={() => navigatePage("AdminPanel")}>admin panel</button>}
        </div>
        <div className="ContactInfoContainer">
          <button className="whatsappBtn whatsapp" onClick={openWhatsapp}></button>
          <button className="phoneBtn phone" onClick={openPhone}></button>
          <button className="wazeBtn waze" onClick={openWaze}></button>
        </div>
        </div>
      <AppointmentSelection
      appointmentInfo={appointmentInfo}
      updateAppointmentInfo={updateAppointmentInfo}
      slug={slug}
      services={services}
      availableTimeSlots={availableTimeSlots}
      setAvailableTimeSlots={setAvailableTimeSlots}
      ></AppointmentSelection>
      </div>
  );
}
export default MainPage;
