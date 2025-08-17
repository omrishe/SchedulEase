import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse } from "date-fns";
import {dateFnsLocalizer } from "react-big-calendar";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { useMemo, useState } from "react";
import ChooseTime from "../components/ChooseTime";
import ChooseDateContainer from "../components/ChooseDateContainer";
import { setStoreOwnerAvailability } from "../api/store";

export function AdminPanel({ userAuthData, allTimes, _id }) {
  const [formData,setFormaData]=useState({
    serviceName:"",
    servicePrice:"",
    serviceNote:""
  })
  const [amtServices,setAmtServices]=useState(1);
  const [date,setDate]=useState(new Date());
  const maxTimeSelections=24;
  const locales = {
    "en-US": enUS,
  };
  console.log("in admin panel",userAuthData)
  
  const buttons = <div>times.map()</div>;
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });
  //runs only on component mounts and init the value for date to current date
  const  defaultDate  = useMemo(() => new Date(),[]);

  //a helper function to set date
  async function updateDate(dateClicked){
    setDate(dateClicked["date"]);
  }

  //handles sending store owner time available
  async function handleSetMenuItemBtn(timeArray) {
    const dateObjects = timeArray.map(time => createDateWithTime(time));
    const response=await setStoreOwnerAvailability(dateObjects,userAuthData.storeID)
    //add status label
  }

  //function to create a new date
  function createDateWithTime(time){
    const [hours, minutes] = time.split(":").map(Number);
    return new Date(date.getFullYear(),date.getMonth(),date.getDate(),hours,minutes)
  }

  //function to add service to the store
  function addService(){
    return;
  }
function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return userAuthData.role === "admin" ? (
    <div className="AdminPanelMainDiv">
      <p>welcome Admin</p>
      <div className="calanderDiv">
      <ChooseDateContainer updateDate={updateDate} date={date}></ChooseDateContainer>
      <ChooseTime times={allTimes} appointmentInfo={{date : date}} maxTimeSelections={maxTimeSelections} handleChooseTimeOnlick={handleSetMenuItemBtn}></ChooseTime>
    </div>
    <form>
        <label htmlFor="serviceName">service name </label>
        <input name="serviceName" onChange={handleChange} value={formData["serviceName"]}/>
        <label htmlFor="serviceNote">service note </label>
        <input name="serviceNote" onChange={handleChange} value={formData["serviceNote"]}/>
        <label htmlFor="servicePrice">service price </label>
        <input name="servicePrice" onChange={handleChange} value={formData["servicePrice"]}/>
        <button type="submit" onClick={addService}>add new service</button>
    </form>
    <button onClick={()=>setAmtServices((prev)=>prev+1)}>Add service</button>
    </div>
  ) : (
    <p>forbidden</p>
  );
}
