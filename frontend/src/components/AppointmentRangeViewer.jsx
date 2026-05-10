import ToggleSwitch from "./ToggleSwitch";
import AppointmentDetails from "./AppointmentDetails";
import { useState, useCallback } from "react";
import DatePickerInput from "./DatePickerInput";
import { addDaysToDate } from "../utils/dateHandlers";
import { getErrorMessage } from "../utils/errorHandling.js";

//a component to overview all appointments
export default function AppointmentRangeViewer({
  fetchAppointmentsFunc,
  adminMode,
}) {
  const [startDate, setStartDate] = useState(new Date());
  //defaults the date for tomorrow
  const [endDate, setEndDate] = useState(addDaysToDate(new Date(), 1));
  const [includeFreeAppointments, setIncludeFreeAppointments] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [renderAppointments, setRenderAppointments] = useState(false);
  const [errorText, setErrorText] = useState("");
  /*
  this fetches the data using the parent given fetching function and saves it
  used useCallback so it wont fetch unless one of the dates changed
  also we send the next day of endDate to show booking of the same day also
  */
  const loadAppointments = useCallback(async () => {
    const data = await fetchAppointmentsFunc(
      startDate,
      addDaysToDate(endDate, 1),
    );
    if (data.isSuccess) {
      setRenderAppointments(true);
      setAppointments(data.otherData);
    } else if (data.type === "loginRequired") {
      setRenderAppointments(false);
      setErrorText("please log in");
    } else {
      setRenderAppointments(false);
      setErrorText(getErrorMessage(data.code));
    }
  }, [startDate, endDate, fetchAppointmentsFunc]);

  return (
    <div className="appointmentOverviewContainer">
      <label>View Your Appointments</label>
      <div className="datePickerRow">
        <label>Start Date</label>
        <DatePickerInput setDate={setStartDate}></DatePickerInput>
        <label>End Date</label>
        <DatePickerInput setDate={(date) => setEndDate(date)}></DatePickerInput>
        <button
          className="loadAppointmentsBtn"
          onClick={() => loadAppointments()}
        >
          Confirm
        </button>
      </div>
      {adminMode && (
        <ToggleSwitch
          label={"Show free appointments?"}
          onToggle={(state) => setIncludeFreeAppointments(state)}
        ></ToggleSwitch>
      )}
      {renderAppointments ? (
        <AppointmentDetails
          adminMode={adminMode}
          includeFreeAppointments={includeFreeAppointments}
          appointments={appointments}
        ></AppointmentDetails>
      ) : (
        <span>{errorText}</span>
      )}
    </div>
  );
}
