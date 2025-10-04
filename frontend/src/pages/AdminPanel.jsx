import "react-big-calendar/lib/css/react-big-calendar.css";
import {  useState,useEffect } from "react";
import ShowTime from "../components/ShowTime";
import ChooseDateContainer from "../components/ChooseDateContainer";
import { setStoreOwnerAvailability,addServiceToStore,getStoreServices,adminDelService } from "../api/store";
import { ServiceForm } from "../components/serviceForm";
import { v4 as uuidv4 } from "uuid"
import config from "../config.json"

export function AdminPanel({ userAuthData }) {
  const [formData,setFormaData]=useState([{
    formId:uuidv4(),
    name:"",
    price:"",
    serviceNote:""
  }])
  
  const storeOpenHours=config.storeOpenHours;
  const [message,setMessage]=useState("")
  const [date,setDate]=useState(new Date());
  const [storeSrv,setStoreSvc]=useState([])
  const [serviceSelected,setServiceSelected]=useState()
  const [serviceBtnText,setServiceBtnText]=useState("")
  const maxTimeSelections=24;

  //a helper function to set date
  async function updateDate(dateClicked){
    setDate(dateClicked["date"]);
  }

  useEffect(()=> {
    async function getServices(){
      console.log("storeid is:",userAuthData.storeId)
    const serverResponse=await getStoreServices(userAuthData)
      if(serverResponse.isSuccess){
        setStoreSvc(serverResponse.otherData)
      }}
    getServices()
    },[])

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

  function onServiceClicked(service){
    if(serviceSelected?.srvId === service.srvId){
    setServiceSelected()
    }else{
    setServiceSelected(service)
    }
  }

function handleInputChange(e,formId) {
    setFormaData((prev) => prev.map((svc)=> svc.formId===formId ? {...svc, [e.target.name] : e.target.value} : svc));
  }
async function deleteSelectedService(){
  console.log("sending delete with: serviceId:",serviceSelected.srvId,"storeid:",userAuthData.storeId)
  const serverResponse=await adminDelService(serviceSelected.srvId,userAuthData.storeId)
  console.log(serverResponse)
  if(serverResponse.isSuccess){
    console.log("in")
        setStoreSvc(serverResponse.otherData)
        setMessage(serverResponse.message)
      }}


  return userAuthData.role !== "admin" ? <p>forbidden</p> :
    <div className="AdminPanelMainDiv">
      <p>welcome Admin</p>
      <div className="calanderDiv">
      <ChooseDateContainer updateDate={updateDate} date={date}></ChooseDateContainer>
      <ShowTime times={storeOpenHours} date={{date : date}} maxTimeSelections={maxTimeSelections} handleChooseTimeOnlick={handleSetMenuItemBtn}></ShowTime>
    </div>
    <label>Store Services</label>
    <div className="adminPanelServicesContainer">
    <div className="scrollableMenu">
        {storeSrv.map((service) => (
            <button key={service.srvId}
              className="serviceBtn"
              onClick={() => onServiceClicked((service))}>
              <span className="serviceName">{service.name}</span>
              <span className="servicePrice">{service.price}</span>
              <span className="serviceNote">{service.serviceNote}</span>
            </button>
        ))}
      </div>
      {serviceSelected && <button onClick={deleteSelectedService}>delete service</button>}
      <div>
    
    <form className="form" onSubmit={addService}>
      {formData.map((formValues)=>(<ServiceForm key={formValues.formId} className={"singleForm"} formValues={formValues}
       handleInputChange={handleInputChange}></ServiceForm>)
        )}
    <button type="button" style={{display:"block"}} onClick={addAnotherServiceForm}>+</button>
    <button type="submit">{`add new service${formData.length > 1 ? "s" :""} to store`}</button>
    </form>
    
    {message?? <label style={{display:"block"}}>{message}</label>}
    </div>
    </div>  
    </div>
}
