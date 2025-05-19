import "./App.css";
export default function SetAppointment({
  date,
  times,
  handleTimeBtnClick,
  setWindow,
}) {
  return (
    <>
      <span>Date Selected:{date.toLocaleDateString("en-GB")}</span>
      <span>please choose time</span>
      <div className="timeOptions">
        {times.map((time) => (
          <button
            className="TimeOptionBtn"
            key={time}
            onClick={() => handleTimeBtnClick(time)}
          >
            {time}
          </button>
        ))}
      </div>
      <button className="backBtn" onClick={() => setWindow("date")}>
        Back
      </button>
    </>
  );
}
