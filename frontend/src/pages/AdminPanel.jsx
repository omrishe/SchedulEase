import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ShowTime from "../components/ShowTime";
import SingleChoiceCalendar from "../components/SingleChoiceCalendar";
import { getAllStoreAppointments } from "../api/appointments";
import AppointmentViewer from "../components/AppointmentViewer";
import { setStoreOwnerAvailability } from "../api/store";
import ServicesSection from "../components/ServicesSection";
import config from "../config.json";

export function AdminPanel({ userAuthData }) {
  const storeOpenHours = config.storeOpenHours;
  const [date, setDate] = useState(new Date());
  const maxTimeSelections = 24;
  const navigatePage = useNavigate();
  const { slug } = useParams();

  //a helper function to set date
  function updateDate(dateClicked) {
    setDate(dateClicked["date"]);
  }

  //handles sending store owner time available
  async function handleSetMenuItemBtn(timeArray) {
    const dateObjects = timeArray.map((time) => createDateWithTime(time));
    const response = await setStoreOwnerAvailability(
      dateObjects,
      userAuthData.storeId
    );
    return response;
  }

  //function to create a new date js object
  function createDateWithTime(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes
    );
  }

  //function to tell component showAppointmentInfo how to fetch the appointments
  async function fetchAppointmentsFunc(startDate, endDate) {
    // Fetch appointments
    const response = await getAllStoreAppointments(startDate, endDate);
    return response;
  }

  if (userAuthData.role !== "admin") {
    return (
      <div className="admin-forbidden">
        <div className="admin-forbidden-icon">🔒</div>
        <h2>Access Denied</h2>
        <p>You don't have permission to view this page.</p>
        <button
          className="admin-back-btn"
          onClick={() => navigatePage(`/store/${slug}`)}
        >
          ← Back to Store
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-left">
          <h1 className="admin-title">Admin Dashboard</h1>
          <span className="admin-subtitle">Manage your store settings and appointments</span>
        </div>
        <button
          className="admin-back-btn"
          onClick={() => navigatePage(`/store/${slug}`)}
        >
          ← Back to Store
        </button>
      </div>

      {/* Section 1: Availability */}
      <section className="admin-section">
        <div className="admin-section-header">
          <span className="admin-section-icon">📅</span>
          <h2 className="admin-section-title">Set Availability</h2>
        </div>
        <p className="admin-section-desc">Pick a date and select the time slots you're available.</p>
        <div className="admin-availability-grid">
          <div className="admin-calendar-wrapper">
            <SingleChoiceCalendar
              updateDate={updateDate}
              date={date}
            ></SingleChoiceCalendar>
          </div>
          <ShowTime
            times={storeOpenHours}
            date={{ date: date }}
            maxTimeSelections={maxTimeSelections}
            handleChooseTimeOnlick={handleSetMenuItemBtn}
          ></ShowTime>
        </div>
      </section>

      {/* Section 2: Services */}
      <ServicesSection userAuthData={userAuthData} />

      {/* Section 3: Appointments */}
      <section className="admin-section">
        <div className="admin-section-header">
          <span className="admin-section-icon">📋</span>
          <h2 className="admin-section-title">Appointments</h2>
        </div>
        <p className="admin-section-desc">View and manage all booked appointments.</p>
        <AppointmentViewer
          fetchAppointmentsFunc={fetchAppointmentsFunc}
          adminMode={true}
        ></AppointmentViewer>
      </section>
    </div>
  );
}

