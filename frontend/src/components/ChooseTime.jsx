import { useState } from "react";
export default function ChooseTime({
  appointmentInfo,
  times,
  handleChooseTimeOnlick,
}) {
  const [response, setResponse] = useState("");
  const [time, setTime] = useState("");

  async function submitSelectedTime() {
    serverResponse = await handleChooseTimeOnlick();
    setResponse(serverResponse);
  }

  return (
    <div className="mainChooseTimeDiv">
      <span>please choose time</span>
      <div className="timeOptions">
        {times.map(
          (
            timeInput // sets the times user can choose
          ) => (
            <button
              className="TimeOptionBtn"
              key={timeInput}
              onClick={() => setTime(timeInput)}
            >
              {timeInput}
            </button>
          )
        )}
      </div>
      {time && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>
            Date Selected:{appointmentInfo["date"].toLocaleDateString("en-GB")}{" "}
            at {time}
          </span>
          <button onClick={submitSelectedTime}>Confirm</button>
          {response && <p>{response.message}</p>}
        </div>
      )}
    </div>
  );
}
