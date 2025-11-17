import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useEffect } from "react";
import ShowTime from "../components/ShowTime";
import SingleChoiceCalendar from "../components/SingleChoiceCalendar";
import { getAllStoreAppointments } from "../api/appointments";
import AppointmentOverview from "../components/AppointmentOverview";
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
    return <p>forbidden</p>;
  } else {
    return (
      <div className="AdminPanelMainDiv">
        <p>welcome Admin</p>
        <div className="calanderDiv">
          <SingleChoiceCalendar
            updateDate={updateDate}
            date={date}
          ></SingleChoiceCalendar>
          <ShowTime
            times={storeOpenHours}
            date={{ date: date }}
            maxTimeSelections={maxTimeSelections}
            handleChooseTimeOnlick={handleSetMenuItemBtn}
          ></ShowTime>
        </div>
        <label>Store Services</label>
        <div className="adminPanelServicesContainer">
          <div className="scrollableMenu">
            {storeSrv.map((service) => (
              <button
                key={service.srvId}
                className="serviceBtn"
                onClick={() => onServiceClicked(service)}
              >
                <span className="serviceName">{service.name}</span>
                <span className="servicePrice">{service.price}</span>
                <span className="serviceNote">{service.serviceNote}</span>
              </button>
            ))}
          </div>
          {serviceSelected && (
            <button onClick={deleteSelectedService}>delete service</button>
          )}
          <div>
            <form className="form" onSubmit={addService}>
              {formData.map((formValues) => (
                <ServiceForm
                  key={formValues.formId}
                  className={"singleForm"}
                  formValues={formValues}
                  handleInputChange={handleInputChange}
                ></ServiceForm>
              ))}
              <button
                type="button"
                style={{ display: "block" }}
                onClick={addAnotherServiceForm}
              >
                +
              </button>
              <button type="submit">{`add new service${
                formData.length > 1 ? "s" : ""
              } to store`}</button>
            </form>
            {message && (
              <label
                style={{
                  display: "block",
                  visibility: message ? "visible" : "hidden",
                }}
              >
                {message}
              </label>
            )}
          </div>
        </div>
        <div>
          <AppointmentOverview
            fetchAppointmentsFunc={fetchAppointmentsFunc}
            adminMode={true}
          ></AppointmentOverview>
        </div>
      </div>
    );
  }
}
