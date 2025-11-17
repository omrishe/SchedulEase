import { useState } from "react";
export default function ChooseTime({
  date,
  availableTimeSlots,
  handleChooseTimeOnlick,
  appointmentInfo,
}) {
  const [response, setResponse] = useState(null);
  const [timeSelected, setTimeSelected] = useState("");
  const [isError, setIsError] = useState(false);

  async function submitSelectedTime() {
    if (appointmentInfo.storeId) {
      const serverResponse = await handleChooseTimeOnlick(timeSelected);
      if (!serverResponse.isSuccess) {
        setResponse(serverResponse.message);
        setIsError(true);
      } else {
        setIsError(false);
        setResponse(
          serverResponse.message || "Appointment created successfully"
        );
      }
    } else {
      setResponse("not logged in");
    }
  }

  function handleTimeSelect(timeInput) {
    setResponse(null);
    setTimeSelected(timeInput === timeSelected ? "" : timeInput);
  }
  const dateKey = date.getTime();
  const isDateLoaded = dateKey in availableTimeSlots;
  const timesForDate = isDateLoaded ? availableTimeSlots[dateKey] : [];
  const renderNoAvailableAppointment = (
    <label className="NoAvailableAppointmentLabel">
      {" "}
      no available appointments
    </label>
  );
  const renderTimeButtons = timesForDate.map((timeInput) => (
    <button
      className={`TimeOptionBtn ${timeSelected === timeInput ? "clicked" : ""}`}
      key={timeInput}
      onClick={() => handleTimeSelect(timeInput)}
    >
      {timeInput}
    </button>
  ));

  return (
    <div className="chooseTimeContainer">
      <span>
        Date Selected:{date.toLocaleDateString("en-GB")}
        {timeSelected && ` at ${timeSelected}`}
      </span>
      {!isError ? (
        <>
          {!timeSelected && <span> please choose time</span>}
          <div className="timeOptions">
            {timesForDate.length > 0
              ? renderTimeButtons
              : renderNoAvailableAppointment}
          </div>
        </>
      ) : (
        <span style={{ display: "block" }}>an error occured</span>
      )}
      {timeSelected && <button onClick={submitSelectedTime}>Confirm</button>}
      {response && <p>{response}</p>}
    </div>
  );
}
