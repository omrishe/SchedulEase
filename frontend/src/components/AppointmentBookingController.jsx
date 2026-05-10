import ServiceSelector from "./ServiceSelector.jsx";
import { useState, useEffect } from "react";
import AppointmentCalendar from "./AppointmentCalendar.jsx";
import TimePicker from "./TimePicker.jsx";
import { createAppointment } from "../services/appointmentsService.js";
import { sendRejectedResponse } from "../utils/responseHandler.js";
import { resetTime } from "../utils/dateHandlers.js";
import { getAvailableAppointmentsDates } from "../services/appointmentsService.js";
import { getStoreServices } from "../services/storeService.js";

export function AppointmentBookingController({
  appointmentInfo,
  updateAppointmentInfo,
  userName,
  slug,
}) {
  const [windowChooser, setWindow] = useState("items");
  const [availableTimeSlots, setAvailableTimeSlots] = useState({});
  const [services, setServices] = useState(["loading"]);

  //gets store available appointments
  useEffect(() => {
    // Create a controller to abort incase multiple dates change
    const controller = new AbortController();
    const signal = controller.signal;

    async function getAvailableSlots() {
      try {
        if (userName) {
          const serverResponse = await getAvailableAppointmentsDates(
            { storeSlug: slug },
            new Date(appointmentInfo.date),
            signal, // Pass signal,
            undefined,
          );
          if (serverResponse.isSuccess) {
            setAvailableTimeSlots((prev) => ({
              ...prev,
              ...serverResponse.otherData,
            }));
          } else {
            const response = sendRejectedResponse({
              message: "Failed to fetch slots",
              otherData: serverResponse.message,
            });
            return response;
          }
        }
      } catch (error) {
        if (error.name === "AbortError") {
          // do nothing request was aborted
          return;
        }
        if (import.meta.env.DEV) {
          console.error("Error fetching available slots:", error);
        }
        return sendRejectedResponse({
          message: "Failed to fetch slots",
          otherData: error.message || "",
        });
      }
    }
    const dateTimeStamp = resetTime(appointmentInfo.date, "timeStamp");
    if (!(dateTimeStamp in availableTimeSlots)) {
      getAvailableSlots();
    }
    /*
    a returned function is the cleanup function that runs
    when the component unmounts or date changes
    so here its to cancel the request if component unmounts or date changes
     */
    return () => controller.abort();
  }, [appointmentInfo.date]);
  //gets store available services
  useEffect(() => {
    async function getServices() {
      const serverResponse = await getStoreServices({ storeSlug: slug });
      if (serverResponse.isSuccess) {
        setServices(serverResponse.otherData);
      }
    }
    getServices();
  }, []);

  async function handleChooseTimeOnClick(time) {
    try {
      const tempDate = new Date(appointmentInfo.date);
      const [hours, minutes] = time.split(":");
      tempDate.setHours(hours, minutes);
      const response = await createAppointment(
        await updateAppointmentInfo({ date: tempDate }),
      ); //response contains the appointment info
      if (response.isSuccess) {
        const dateTimeStamp = resetTime(tempDate, "timeStamp");
        //remove the time from the available time slots
        setAvailableTimeSlots((prev) => ({
          ...prev,
          [dateTimeStamp]:
            prev[dateTimeStamp]?.filter((slot) => slot !== time) || [],
        }));
        return response;
      } else {
        return sendRejectedResponse({
          message: "failed to create appointment",
          otherData: new Error("network failed"),
        });
      }
    } catch (error) {
      const response = sendRejectedResponse({
        message: "failed to create appointment",
        otherData: error,
      });
      if (import.meta.env.DEV) {
        console.error(response);
      }
      return response;
    }
  }
  return (
    <div className="appointmentMainWindow">
      {windowChooser === "items" && (
        <ServiceSelector
          appointmentInfo={appointmentInfo}
          services={services}
          onNextServiceBtnPress={(serviceName) =>
            updateAppointmentInfo({ service: serviceName })
          }
          setWindow={setWindow}
        ></ServiceSelector>
      )}
      {windowChooser === "date" && (
        <div className="setDateContainer">
          <AppointmentCalendar
            date={appointmentInfo.date}
            updateDate={updateAppointmentInfo}
          ></AppointmentCalendar>
          <TimePicker //display set appointment area
            date={appointmentInfo.date}
            availableTimeSlots={availableTimeSlots}
            handleChooseTimeOnlick={handleChooseTimeOnClick}
            appointmentInfo={appointmentInfo}
          ></TimePicker>
        </div>
      )}
    </div>
  );
}
