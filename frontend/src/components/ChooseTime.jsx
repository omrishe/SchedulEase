import { useState } from "react";
export default function ChooseTime({
  appointmentInfo: date={date:new Date()},
  times,
  handleChooseTimeOnlick,
  maxTimeSelections,
}) {
  const [response, setResponse] = useState();
  const [timeArray, setTimeArray] = useState([]);

  async function submitSelectedTime() {
    const serverResponse = await handleChooseTimeOnlick(timeArray);
    setResponse(serverResponse);
  }

  function resetResponse(){
    if(response){
    setResponse();
    }
  }

  function timeBtnSelect(timeInput){
    resetResponse();
    const index = timeArray.indexOf(timeInput);
    //time wasnt chosen yet
    if(index === -1){
      //add new time in the array if max selection set is less than amount of chosen times
      if(timeArray.length<maxTimeSelections){
        setTimeArray([...timeArray,timeInput]);
      }
      //amount of chosen times is greater than the allowed set in max selection
      else{
      setResponse({message:`maximum amount of choices ${maxTimeSelections===1 ? "is 1": ` are ${maxTimeSelections}`}`})
      }}
    //time was chosen already->remove the selection
    else{
      const tempTimeArray=[...timeArray]
      tempTimeArray.splice(index,1);
      setTimeArray(tempTimeArray);
    }}
    
  return (
    <div className="mainChooseTimeDiv">
      <span>please choose time</span>
      <div className="timeOptions">
        {times.map(
          (
            timeInput // sets the times user can choose
          ) => (
            <button
              className={`TimeOptionBtn ${timeArray.includes(timeInput) ?"clicked" : ""}`}
              key={timeInput}
              onClick={() => timeBtnSelect(timeInput)}
            >
              {timeInput}
            </button>
          )
        )}
      </div>
      {timeArray && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>
            Date Selected:{date["date"].toLocaleDateString("en-GB")}{" "}
            {(maxTimeSelections===1 && timeArray[0]) ? `at ${timeArray[0]}`:""}
          </span>
          <button onClick={submitSelectedTime}>Confirm</button>
          {response && <p>{response.message}</p>}
        </div>
      )}
    </div>
  );
}
