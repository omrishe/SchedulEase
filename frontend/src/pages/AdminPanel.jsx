import "react-big-calendar/lib/css/react-big-calendar.css";
import { useMemo, useState } from "react";
import ShowTime from "../components/ShowTime";
import ChooseDateContainer from "../components/ChooseDateContainer";
import { setStoreOwnerAvailability,addServiceToStore } from "../api/store";
import { ServiceForm } from "../components/serviceForm";
import { v4 as uuidv4 } from "uuid";
export function AdminPanel({ userAuthData, allTimes, _id }) {
  const [formData,setFormaData]=useState([{
    formId:uuidv4(),
    name:"",
    price:"",
    serviceNote:""
  }])

  const [message,setMessage]=useState("")
  const [date,setDate]=useState(new Date());
  const maxTimeSelections=24;

  //runs only on component mounts and init the value for date to current date
  const  defaultDate  = useMemo(() => new Date(),[]);
  //a helper function to set date
  async function updateDate(dateClicked){
    setDate(dateClicked["date"]);
  }

  //handles sending store owner time available
  async function handleSetMenuItemBtn(timeArray) {
    const dateObjects = timeArray.map(time => createDateWithTime(time));
    const response=await setStoreOwnerAvailability(dateObjects,userAuthData.storeId)
    return response;
  }

  //function to create a new date js object
  function createDateWithTime(time){
    const [hours, minutes] = time.split(":").map(Number);
    return new Date(date.getFullYear(),date.getMonth(),date.getDate(),hours,minutes)
  }

  //function to add service to the store
  async function addService(e){
    e.preventDefault();
    const response=await addServiceToStore(userAuthData,formData.map(svc=> ({price:svc.price,name:svc.name,serviceNote:svc.serviceNote})))
    setMessage(response.message)
    return;
  }
  function addAnotherServiceForm(){
    setFormaData((prev)=>[...prev,{
    formId:uuidv4(),
    serviceName:"",
    servicePrice:"",
    serviceNote:""
  }])
  }

function handleInputChange(e,formId) {
    setFormaData((prev) => prev.map((svc)=> svc.formId===formId ? {...svc, [e.target.name] : e.target.value} : svc));
  }

  return userAuthData.role === "admin" ? (
    <div className="AdminPanelMainDiv">
      <p>welcome Admin</p>
      <div className="calanderDiv">
      <ChooseDateContainer updateDate={updateDate} date={date}></ChooseDateContainer>
      <ShowTime times={allTimes} date={{date : date}} maxTimeSelections={maxTimeSelections} handleChooseTimeOnlick={handleSetMenuItemBtn}></ShowTime>
    </div>
    <form className="form" onSubmit={addService}>
      {formData.map((formValues)=>(<ServiceForm key={formValues.formId} className={"singleForm"} formValues={formValues} handleInputChange={handleInputChange}></ServiceForm>)
        )}
        <button type="submit">add new service</button>
    </form>
    <button onClick={addAnotherServiceForm}>Add service</button>
    {message?? <label>{message}</label>}
    </div>
  ) : (
    <p>forbidden</p>
  );
}
