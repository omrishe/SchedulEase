import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { logout } from "../services/authService.js";
import { AppointmentSelection } from "../components/AppointmentSelection.jsx";
import { getUserBookingInfo } from "../services/appointmentsService.js";
import AppointmentViewer from "../components/AppointmentViewer.jsx";

function MainPage({ userAuthData, resetUserData }) {
  const navigatePage = useNavigate();
  const [appointmentInfo, setAppointment] = useState({
    date: new Date(),
    service: "",
    storeId: localStorage.getItem("storeId"),
  });

  const { slug } = useParams();
  const [logoutMsg, setLogoutMsg] = useState();

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
    return new Promise((resolve) => {
      setAppointment((prev) => {
        const updated = { ...prev, ...newInfo };
        resolve(updated);
        return updated;
      });
    });
  }

  async function handleLogout() {
    setLogoutMsg("logged out successfully");
    resetUserData();
    setAppointment({ date: new Date(), service: "", storeId: null });
    await logout();
  }

  async function fetchUserAppointments(startDate, endDate) {
    const response = await getUserBookingInfo(startDate, endDate);
    if (!response.isSuccess) {
      if (import.meta.env.DEV) {
        console.error(response);
      }
      return response;
    }
    return response;
  }

  const welcomeMsg = (
    <p className="welcomeParagraph">
      {userAuthData.userName ? `welcome ${userAuthData.userName}` : "welcome"}
    </p>
  );
  const userIsNotLoggedInElement = (
    <>
      <button
        className="loginBtn"
        onClick={() => navigatePage(`/store/${slug}/login`)}
      >
        Login
      </button>
      <button
        className="registerBtn"
        onClick={() => navigatePage(`/store/${slug}/register`)}
      >
        Don't have an account? Register
      </button>
    </>
  );

  const userIsLoggedInElement = (
    <button className="logoutBtn" onClick={() => handleLogout()}>
      Logout
    </button>
  );

  return (
    <div className="mainPageContainer">
      <div className="interactionContainer">
        {/**displays welcome msg if not logged in and welcome userName if logged in */}
        {welcomeMsg}
        <div className="navigationBtns">
          {/**displays login/register or logout depending if logged in */}
          {userAuthData["userName"]
            ? userIsLoggedInElement
            : userIsNotLoggedInElement}
          {/**logout msg to display after logging out */}
          {logoutMsg && <p>{logoutMsg}</p>}
          {userAuthData.role === "admin" && (
            <button
              className="adminPanelBtn"
              onClick={() => navigatePage(`/store/${slug}/adminPanel`)}
            >
              Admin Panel
            </button>
          )}
        </div>
        <div className="ContactInfoContainer">
          <button
            className="whatsappBtn whatsapp"
            onClick={openWhatsapp}
          ></button>
          <button className="phoneBtn phone" onClick={openPhone}></button>
          <button className="wazeBtn waze" onClick={openWaze}></button>
        </div>
      </div>
      <AppointmentSelection
        userName={userAuthData.userName}
        appointmentInfo={appointmentInfo}
        updateAppointmentInfo={updateAppointmentInfo}
        slug={slug}
      ></AppointmentSelection>
      {userAuthData.userName ? (
        <AppointmentViewer
          fetchAppointmentsFunc={fetchUserAppointments}
          adminMode={false}
        ></AppointmentViewer>
      ) : (
        <label>Please log in to view your appointments</label>
      )}
    </div>
  );
}
export default MainPage;
