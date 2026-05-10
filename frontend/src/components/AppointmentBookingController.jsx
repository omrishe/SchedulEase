import ServiceSelector from "./ServiceSelector.jsx";
import AppointmentCalendar from "./AppointmentCalendar.jsx";
import TimePicker from "./TimePicker.jsx";

import { useAppointmentBooking } from "../hooks/useAppointmentBooking.js";

export function AppointmentBookingController({
  appointmentInfo,
  updateAppointmentInfo,
  userName,
  slug,
}) {
  const {
    windowChooser,
    setWindow,
    services,
    availableTimeSlots,
    handleChooseTimeOnClick,
  } = useAppointmentBooking({
    appointmentInfo,
    updateAppointmentInfo,
    userName,
    slug,
  });

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
        />
      )}

      {windowChooser === "date" && (
        <div className="setDateContainer">
          <AppointmentCalendar
            date={appointmentInfo.date}
            updateDate={updateAppointmentInfo}
          />

          <TimePicker
            date={appointmentInfo.date}
            availableTimeSlots={availableTimeSlots}
            handleChooseTimeOnlick={handleChooseTimeOnClick}
            appointmentInfo={appointmentInfo}
          />
        </div>
      )}
    </div>
  );
}
