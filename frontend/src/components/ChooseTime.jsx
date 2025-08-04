import { useState } from "react";
export default function ChooseTime({
  appointmentInfo,
  times,
  handleChooseTimeOnlick,
  maxTimeSelections,
}) {
  const [response, setResponse] = useState();
  const [timeArray, setTimeArray] = useState([]);

  async function submitSelectedTime() {
    const serverResponse = await handleChooseTimeOnlick(timeArray,maxTimeSelections);
    setResponse(serverResponse);
  }

  function resetResponse(){
    if(response){
    setResponse();
    }
  }

  function timeBtnSelect(timeInput){
    resetResponse();
    //add new time in the array
    if(timeArray.length<maxTimeSelections){
      if(! timeArray.includes(timeInput)){
        setTimeArray([...timeArray,timeInput]);
      }
      else{
        setResponse({message : "time already chosen"})
      }
    }
    //replace the last selected time
    else{
      let tempTimeArray=[...timeArray];
      tempTimeArray[tempTimeArray.length - 1]=timeInput
      setTimeArray(tempTimeArray);
    }
    console.log(timeArray)
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
            Date Selected:{appointmentInfo["date"].toLocaleDateString("en-GB")}{" "}
            at {timeArray.map((time)=> `${time} ,`)}
          </span>
          <button onClick={submitSelectedTime}>Confirm</button>
          {response && <p>{response.message}</p>}
        </div>
      )}
    </div>
  );
}
