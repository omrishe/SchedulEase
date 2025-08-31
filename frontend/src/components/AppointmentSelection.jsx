import MenuItems from "./MenuItem.jsx";
import { useState } from "react"
import ChooseDateContainer from "./ChooseDateContainer.jsx";
import ChooseTime from "./ChooseTime.jsx";
import {createAppointment} from "../api/appointments.js";
import { sendRejectedResponse } from "../utils/responseHandler.js";

export function AppointmentSelection({
    appointmentInfo,
    updateAppointmentInfo,
    availableTimeSlots,
    services
})
{
    const [windowChooser, setWindow] = useState("items");
    console.log("in appointmentSelection appointmentInfo is:\n",appointmentInfo)

    async function handleChooseTimeOnlick(timeArray) {
        try{
        const tempDate = new Date(appointmentInfo.date);
        const [hours, minutes] = timeArray[0].split(":");
        tempDate.setHours(hours, minutes);
          const response = await createAppointment(updateAppointmentInfo({ date: tempDate })); //response contains the appointment info
          if (response) {
            return response;
          }
        } catch (error) {
          response=sendRejectedResponse({message:"failed to create appointment",otherData:error})
          console.error(response);
          return response;
        }
      }

    return (
        <>
          <div className="mainWindow">
            {windowChooser == "items" && (
              <>
                <MenuItems
                  services={services}
                  onNextServiceBtnPress={(serviceName)=>updateAppointmentInfo({service:serviceName})}
                  onClick={() => setIsClicked((prev) => !prev)}
                  setWindow={setWindow}
                ></MenuItems>
              </>
            )}
    
            {windowChooser == "date" && (
              <>
                <ChooseDateContainer
                  updateDate={updateAppointmentInfo}
                ></ChooseDateContainer>
                <button
                  onClick={() => {
                    setWindow("setAppointment");
                  }}
                >
                  Next
                </button>
              </>
            )}
    
            <div className="chooseTimeContainer">
              {windowChooser == "setAppointment" && (
                <>
                  <ChooseTime //display set appointment area
                    date={appointmentInfo["date"]}
                    availableTimeSlots={availableTimeSlots}
                    maxTimeSelections={1}
                    handleChooseTimeOnlick={handleChooseTimeOnlick}
                  ></ChooseTime>
                  <button className="backBtn" onClick={() => setWindow("date")}>
                    Back
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      );

}