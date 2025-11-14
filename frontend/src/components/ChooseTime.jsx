import { useState } from "react";
export default function ChooseTime({
  date,
  availableTimeSlots,
  handleChooseTimeOnlick,
  appointmentInfo,
}) {
  const [response, setResponse] = useState();
  const [timeSelected, SetTimeSelected] = useState("");
  let todaysAvailableSlots;
  if (Object.keys(availableTimeSlots).length === 0) {
    todaysAvailableSlots =
      availableTimeSlots[appointmentInfo.date.getTime()] ?? null; //kept date.getTime() unprotected cause date should always be a date obj
  }
  async function submitSelectedTime() {
    if (appointmentInfo.storeId) {
      const serverResponse = await handleChooseTimeOnlick(timeSelected);
      setResponse(serverResponse.message);
    } else {
      setResponse("not logged in");
    }
  }

  function timeBtnSelect(timeInput) {
    setResponse();
    timeInput !== timeSelected
      ? SetTimeSelected(timeInput)
      : SetTimeSelected("");
  }

  const dateKey = date.getTime();
  const isDateLoaded = dateKey in availableTimeSlots;
  const timesForDate = isDateLoaded ? availableTimeSlots[dateKey] : [];
  const hasTimes = timesForDate.length > 0;
  const shouldShowConfirm = Boolean(timeSelected);

  const renderTimeButtons = timesForDate.map((timeInput) => (
    <button
      className={`TimeOptionBtn ${timeSelected === timeInput ? "clicked" : ""}`}
      key={timeInput}
      onClick={() => timeBtnSelect(timeInput)}
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

      {date.getTime() in availableTimeSlots ? (
        <>
          {!timeSelected && <span> please choose time</span>}
          <div className="timeOptions">
            {availableTimeSlots?.length > 0 ? (
              <>
                {availableTimeSlots.map((timeInput) => (
                  <button
                    className={`TimeOptionBtn ${
                      timeSelected === timeInput ? "clicked" : ""
                    }`}
                    key={timeInput}
                    onClick={() => timeBtnSelect(timeInput)}
                  >
                    {timeInput}
                  </button>
                ))}
              </>
            ) : (
              <label className="NoAvailableAppointmentLabel">
                {" "}
                no available appointments
              </label>
            )}
          </div>
        </>
      ) : (
        <span style={{ display: "block" }}>loading</span>
      )}
      {timeSelected && <button onClick={submitSelectedTime}>Confirm</button>}
      {response && <p>{response}</p>}
    </div>
  );
}
