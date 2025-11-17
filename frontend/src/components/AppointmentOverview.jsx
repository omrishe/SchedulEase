import ToggleSwitch from "./ToggleSwitch";
import ShowAppointmentsInfo from "./ShowAppointmentsInfo";
import { useState, useCallback } from "react";
import PopupDatePicker from "./PopupDatePicker";
import { addDaysToDate } from "../utils/dateHandlers";

//a component to overview all appointments
export default function AppointmentOverview({
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
      addDaysToDate(endDate, 1)
    );
    if (data.isSuccess) {
      setRenderAppointments(true);
      setAppointments(data.otherData);
    } else if (data.type === "loginRequired") {
      setRenderAppointments(false);
      setErrorText("please log in");
    }
  }, [startDate, endDate, fetchAppointmentsFunc]);

  return (
    <div>
      <label>start date </label>
      <PopupDatePicker setDate={setStartDate}></PopupDatePicker>
      <label>end date </label>
      <PopupDatePicker setDate={(date) => setEndDate(date)}></PopupDatePicker>
      <button onClick={() => loadAppointments()}>confirm</button>
      {adminMode && (
        <ToggleSwitch
          label={"show free appointments?"}
          onToggle={(state) => setIncludeFreeAppointments(state)}
        ></ToggleSwitch>
      )}
      {renderAppointments ? (
        <ShowAppointmentsInfo
          adminMode={adminMode}
          includeFreeAppointments={includeFreeAppointments}
          appointments={appointments}
        ></ShowAppointmentsInfo>
      ) : (
        <span style={{ display: "block" }}>{errorText}</span>
      )}
    </div>
  );
}
