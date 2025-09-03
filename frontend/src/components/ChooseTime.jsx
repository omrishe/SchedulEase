import { useState } from "react";
export default function ChooseTime({
  date,
  availableTimeSlots,
  handleChooseTimeOnlick,
}) {
  const [response, setResponse] = useState();
  console.log("availabletimeslot is:\n",availableTimeSlots)
  const [timeSelected,SetTimeSelected]=useState("")

  async function submitSelectedTime() {
    const serverResponse = await handleChooseTimeOnlick(timeSelected);
    setResponse(serverResponse.message);
  }

  function timeBtnSelect(timeInput){
    setResponse();
    timeInput!==timeSelected ? 
      SetTimeSelected(timeInput) : SetTimeSelected("")
    }
    
  return (
    <div>
    <span>
        Date Selected:{date.toLocaleDateString("en-GB")}{timeSelected && ` at ${timeSelected}`}
      </span>
      {!timeSelected && <span> please choose time</span>}
      <div className="timeOptions">
    {availableTimeSlots.length > 0 ? (
        <>{availableTimeSlots.map((timeInput) => (
            <button
              className={`TimeOptionBtn ${
                timeSelected===timeInput ? "clicked" : ""}`}
              key={timeInput}
              onClick={() => timeBtnSelect(timeInput)}>
              {timeInput}
            </button>
          ))}</>) : 
          <label className="NoAvailableAppointmentLabel"> no available appointments</label>}
    </div>
    {timeSelected && <button onClick={submitSelectedTime}>Confirm</button>}
      {response && <p>{response}</p>}
    </div>
  );
}
