import MenuItems from "./MenuItem.jsx";
import { useState, useEffect } from "react";
import SingleChoiceCalendar from "./SingleChoiceCalendar.jsx";
import ChooseTime from "./ChooseTime.jsx";
import { createAppointment } from "../api/appointments.js";
import { sendRejectedResponse } from "../utils/responseHandler.js";
import { resetTime } from "../utils/dateHandlers";
import { getAvailableAppointmentsDates } from "../api/appointments.js";

export function AppointmentSelection({
  appointmentInfo,
  updateAppointmentInfo,
  services,
  slug,
}) {
  const [windowChooser, setWindow] = useState("items");
  const [availableTimeSlots, setAvailableTimeSlots] = useState({});

  //gets store available appointments
  useEffect(() => {
    async function getAvailableSlots() {
      const serverResponse = await getAvailableAppointmentsDates(
        { storeSlug: slug },
        new Date(appointmentInfo.date)
      );
      if (serverResponse.isSuccess) {
        setAvailableTimeSlots(serverResponse.otherData);
      }
    }
    const dateTimeStamp = resetTime(appointmentInfo.date, "timeStamp");
    //create a new date only with day,month and year (no hours or seconds)
    console.log(availableTimeSlots);
    if (!(dateTimeStamp in availableTimeSlots)) {
      setAvailableTimeSlots({});
      console.log("date is", appointmentInfo.date);
      console.log(Object.keys(availableTimeSlots));
      getAvailableSlots();
    }
  }, [appointmentInfo.date]);
  async function handleChooseTimeOnlick(time) {
    try {
      const tempDate = new Date(appointmentInfo.date);
      const [hours, minutes] = time.split(":");
      tempDate.setHours(hours, minutes);
      const response = await createAppointment(
        updateAppointmentInfo({ date: tempDate })
      ); //response contains the appointment info
      if (response.isSuccess) {
        setAvailableTimeSlots(
          availableTimeSlots.filter((slot) => slot !== time)
        );
        return response;
      }
    } catch (error) {
      response = sendRejectedResponse({
        message: "failed to create appointment",
        otherData: error,
      });
      console.error(response);
      return response;
    }
  }

  return (
    <div className="appointmentMainWindow">
      {windowChooser == "items" && (
        <>
          <MenuItems
            services={services}
            onNextServiceBtnPress={(serviceName) =>
              updateAppointmentInfo({ service: serviceName })
            }
            onClick={() => setIsClicked((prev) => !prev)}
            setWindow={setWindow}
          ></MenuItems>
        </>
      )}
      {windowChooser == "date" && (
        <div className="setDateContainer">
          <SingleChoiceCalendar
            date={appointmentInfo.date}
            updateDate={updateAppointmentInfo}
          ></SingleChoiceCalendar>
          <ChooseTime //display set appointment area
            date={appointmentInfo["date"]}
            availableTimeSlots={availableTimeSlots}
            handleChooseTimeOnlick={handleChooseTimeOnlick}
            appointmentInfo={appointmentInfo}
          ></ChooseTime>
        </div>
      )}
    </div>
  );
}
