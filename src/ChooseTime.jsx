import "./App.css";
import { useState } from "react";
export default function ChooseTime({
  date: appointmentInfo,
  times,
  handleTimeBtnClick,
  setWindow,
}) {
  const [time, setTime] = useState("Null");
  function handleTimeBtnClick(time) {}
  return (
    <>
      <span>please choose time</span>
      <div className="timeOptions">
        {times.map((timeInput) => (
          <button
            className="TimeOptionBtn"
            key={timeInput}
            onClick={() => setTime(timeInput)}
          >
            {timeInput}
          </button>
        ))}
      </div>
      {time != "Null" && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>
            Date Selected:{appointmentInfo["date"].toLocaleDateString("en-GB")}{" "}
            at {time}
          </span>
          <button
            onClick={() => {
              appointmentInfo["time"] = time;
              handleTimeBtnClick(appointmentInfo);
            }}
          >
            Confirm
          </button>
        </div>
      )}
      <button className="backBtn" onClick={() => setWindow("date")}>
        Back
      </button>
    </>
  );
}
