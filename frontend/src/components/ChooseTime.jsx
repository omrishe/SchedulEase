import { useState } from "react";
export default function ChooseTime({
  appointmentInfo,
  updateAppointmentInfo,
  times,
  SendObjToServer,
  setWindow,
}) {
  const [time, setTime] = useState("");

  async function handleOnlick(){
    const tempDate=new Date(appointmentInfo.date);
                const [hours,minutes]=time.split(":");
                tempDate.setHours(hours,minutes);
                updateAppointmentInfo({date:tempDate})
                const tempAppointmentInfo={...appointmentInfo,date : tempDate};
                const serverResponse=await SendObjToServer(tempAppointmentInfo)
                setResponse(serverResponse);
  }

  return (
    <>
      <span>please choose time</span>
      <div className="timeOptions">
        {times.map((timeInput) => ( // sets the times user can choose
          <button
            className="TimeOptionBtn"
            key={timeInput}
            onClick={() => setTime(timeInput)}
          >
            {timeInput}
          </button>
        ))}
      </div>
      {time && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>
            Date Selected:{appointmentInfo["date"].toLocaleDateString("en-GB")}{" "}
            at {time}
          </span>
          <button
            onClick={() => {
                handleOnlick()
            }}
          >
            Confirm
          </button>
          {response && <p>{response.message}</p>}
        </div>
      )}
      <button className="backBtn" onClick={() => setWindow("date")}>
        Back
      </button>
    </>
  );
}
