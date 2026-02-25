import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ShowTime from "../components/ShowTime";
import SingleChoiceCalendar from "../components/SingleChoiceCalendar";
import { getAllStoreAppointments } from "../api/appointments";
import AppointmentViewer from "../components/AppointmentViewer";
import {
  setStoreOwnerAvailability,
  addServiceToStore,
  getStoreServices,
  adminDelService,
} from "../api/store";
import { ServiceForm } from "../components/ServiceForm";
//for setting unique keys
import { v4 as uuidv4 } from "uuid";
import config from "../config.json";

export function AdminPanel({ userAuthData }) {
  const [formData, setFormaData] = useState([
    {
      formId: uuidv4(),
      name: "",
      price: "",
      serviceNote: "",
    },
  ]);

  const storeOpenHours = config.storeOpenHours;
  const [message, setMessage] = useState("");
  const [date, setDate] = useState(new Date());
  const [storeSrv, setStoreSvc] = useState([]);
  const [serviceSelected, setServiceSelected] = useState();
  const maxTimeSelections = 24;
  const navigatePage = useNavigate();
  const { slug } = useParams();

  //a helper function to set date
  function updateDate(dateClicked) {
    setDate(dateClicked["date"]);
  }

  //function for fetching services
  useEffect(() => {
    async function getServices() {
      const serverResponse = await getStoreServices(userAuthData);
      if (serverResponse.isSuccess) {
        setStoreSvc(serverResponse.otherData);
      }
    }
    getServices();
  }, []);

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

  //function to add service to the store
  async function addService(e) {
    e.preventDefault();
    const response = await addServiceToStore(
      userAuthData,
      formData.map((svc) => ({
        price: svc.price,
        name: svc.name,
        serviceNote: svc.serviceNote,
      }))
    );
    setMessage(response.message);
    return;
  }

  //function to add another service form to the page
  function addAnotherServiceForm() {
    setFormaData((prev) => [
      ...prev,
      {
        formId: uuidv4(),
        name: "",
        price: "",
        serviceNote: "",
      },
    ]);
  }

  //function to handle service clicked
  function onServiceClicked(service) {
    if (serviceSelected?.srvId === service.srvId) {
      setServiceSelected();
    } else {
      setServiceSelected(service);
    }
  }

  //function to handle form input component change
  function handleInputChange(e, formId) {
    setFormaData((prev) =>
      prev.map((svc) =>
        svc.formId === formId
          ? { ...svc, [e.target.name]: e.target.value }
          : svc
      )
    );
  }

  //function to tell component showAppointmentInfo how to fetch the appointments
  async function fetchAppointmentsFunc(startDate, endDate) {
    // Fetch appointments
    const response = await getAllStoreAppointments(startDate, endDate);
    return response;
  }

  //function to handle deleting service
  async function deleteSelectedService() {
    const serverResponse = await adminDelService(
      serviceSelected.srvId,
      userAuthData.storeId
    );
    if (serverResponse.isSuccess) {
      setStoreSvc(serverResponse.otherData);
      setMessage(serverResponse.message);
    }
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
      <section className="admin-section">
        <div className="admin-section-header">
          <span className="admin-section-icon">✂️</span>
          <h2 className="admin-section-title">Store Services</h2>
        </div>
        <p className="admin-section-desc">View, add, or remove services offered at your store.</p>
        <div className="admin-services-layout">
          {/* Existing services list */}
          <div className="admin-services-list">
            <h3 className="admin-subsection-title">Current Services</h3>
            <div className="scrollableMenu">
              {storeSrv.map((service) => (
                <button
                  key={service.srvId}
                  className={`serviceBtn${serviceSelected?.srvId === service.srvId ? " selected" : ""}`}
                  onClick={() => onServiceClicked(service)}
                >
                  <span className="serviceName">{service.name}</span>
                  <span className="servicePrice">{service.price}</span>
                  <span className="serviceNote">{service.serviceNote}</span>
                </button>
              ))}
              {storeSrv.length === 0 && (
                <span className="admin-empty-state">No services added yet.</span>
              )}
            </div>
            {serviceSelected && (
              <div className="admin-service-actions">
                <button className="admin-edit-btn" onClick={() => {}}>
                  ✏️ Edit "{serviceSelected.name}"
                </button>
                <button className="admin-delete-btn" onClick={deleteSelectedService}>
                  🗑 Delete "{serviceSelected.name}"
                </button>
              </div>
            )}
          </div>

          {/* Add new service form */}
          <div className="admin-services-form-wrapper">
            <h3 className="admin-subsection-title">Add New Service</h3>
            <form className="form" onSubmit={addService}>
              {formData.map((formValues) => (
                <ServiceForm
                  key={formValues.formId}
                  className={"singleForm"}
                  formValues={formValues}
                  handleInputChange={handleInputChange}
                ></ServiceForm>
              ))}
              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-add-form-btn"
                  onClick={addAnotherServiceForm}
                  title="Add another service"
                >
                  +
                </button>
                <button className="admin-submit-btn" type="submit">{`Add service${
                  formData.length > 1 ? "s" : ""
                }`}</button>
              </div>
            </form>
            {message && (
              <div className="admin-message">{message}</div>
            )}
          </div>
        </div>
      </section>

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
