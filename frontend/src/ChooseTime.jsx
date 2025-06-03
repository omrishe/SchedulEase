import "./App.css";
import { useState } from "react";
export default function ChooseTime({
  appointmentInfo,
  updateAppointmentInfo,
  times,
  SendObjToServer,
  setWindow,
}) {
  const [time, setTime] = useState("Null");
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
              const tempAppointmentInfo={...appointmentInfo,time};
              updateAppointmentInfo({"time" :time})
              SendObjToServer(tempAppointmentInfo);
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
