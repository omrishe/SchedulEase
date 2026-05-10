import ToggleSwitch from "./ToggleSwitch";
import AppointmentDetails from "./AppointmentDetails";
import { useState, useCallback } from "react";
import DatePickerInput from "./DatePickerInput";
import { addDaysToDate } from "../utils/dateHandlers";
import { getErrorMessage } from "../utils/errorHandling.js";

//a component to overview all appointments
export default function AppointmentSearchPanel({
  fetchAppointmentsFunc,
  adminMode,
}) {
  const [startDate, setStartDate] = useState(new Date());
  //defaults the date for tomorrow
  const [endDate, setEndDate] = useState(addDaysToDate(new Date(), 1));
  const [includeFreeAppointments, setIncludeFreeAppointments] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [pageState, setPageState] = useState("");

  /*
  this fetches the data using the parent given fetching function and saves it
  used useCallback so it wont fetch unless one of the dates changed
  also we send the next day of endDate to show booking of the same day also
  */
  const loadAppointments = useCallback(async () => {
    if (startDate >= endDate) {
      setPageState("error");
      setErrorText("start date must be equal or before end date");
      return;
    } else {
      setPageState("loading");
      const data = await fetchAppointmentsFunc(
        startDate,
        addDaysToDate(endDate, 1),
      );
      if (data.isSuccess) {
        setPageState("success");
        setAppointments(data.otherData);
      } else if (data.type === "loginRequired") {
        setPageState("error");
        setErrorText("please log in");
      } else {
        setPageState("error");
        setErrorText(getErrorMessage(data.code));
      }
    }
  }, [startDate, endDate, fetchAppointmentsFunc]);

  return (
    <div className="appointmentViewerContainer">
      <label>View Your Appointments</label>
      <div className="datePickerRow">
        <div className="dateGroup">
          <label>Start Date</label>
          <DatePickerInput
            setDate={(date) => {
              setPageState("");
              setStartDate(date);
            }}
          ></DatePickerInput>
        </div>
        <div className="dateGroup">
          <label>End Date</label>
          <DatePickerInput
            setDate={(date) => {
              setPageState("");
              setEndDate(date);
            }}
          ></DatePickerInput>
        </div>
        <div className="dateGroup">
          <button
            className="loadAppointmentsBtn"
            onClick={() => loadAppointments()}
          >
            Confirm
          </button>
        </div>
      </div>
      {adminMode && (
        <ToggleSwitch
          label={"Show free appointments?"}
          onToggle={(state) => setIncludeFreeAppointments(state)}
        ></ToggleSwitch>
      )}
      {pageState === "loading" ? (
        <div className="loadingSpinner">
          <div className="loadingSpinnerInner"></div>
          <span>Loading appointments...</span>
        </div>
      ) : pageState === "error" ? (
        <div className="viewerErrorMsg"> {errorText}</div>
      ) : pageState === "success" ? (
        <AppointmentDetails
          adminMode={adminMode}
          includeFreeAppointments={includeFreeAppointments}
          appointments={appointments}
        ></AppointmentDetails>
      ) : (
        <></>
      )}
    </div>
  );
}
