import { useState } from "react";
export default function ChooseTime({
  date,
  availableTimeSlots,
  handleChooseTimeOnlick,
  appointmentInfo,
}) {
  const [response, setResponse] = useState();
  const [timeSelected, SetTimeSelected] = useState("");

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

  return (
    <div className="chooseTimeContainer">
      <span>
        Date Selected:{date.toLocaleDateString("en-GB")}
        {timeSelected && ` at ${timeSelected}`}
      </span>
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
      {timeSelected && <button onClick={submitSelectedTime}>Confirm</button>}
      {response && <p>{response}</p>}
    </div>
  );
}
