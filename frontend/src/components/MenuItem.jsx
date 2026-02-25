import {  useState } from "react";
import ServiceCardSkeleton from "./ServiceCardSkeleton";

export default function MenuItems({ setWindow,services,onNextServiceBtnPress,appointmentInfo }) {
  const [serviceSelected,setServiceSelected]=useState("")
  const isLoading = !services || services.length === 0 || services[0] === "loading";
const [errorText,setErrorText]=useState("")
  function onSelectedServiceBtn(serviceName){
    serviceName===serviceSelected ? setServiceSelected("") : setServiceSelected(serviceName)
  }

  function onNextBtnPress(){
      if(appointmentInfo.storeId){
        setWindow("date")
      }
      else{
        setErrorText("please login first")
    }
    onNextServiceBtnPress(serviceSelected)
    setServiceSelected("")
  }

  return (
    <>
    <label>Services</label>
    <div>
      {errorText && <label>{errorText}</label>}
      <div className="scrollableMenu">
        {isLoading ? (
          <ServiceCardSkeleton count={4} />
        ) : (
          services.map((service) => (
            <button key={`${service.name}${service.price}${service.serviceNote}`}
              className={`serviceBtn ${serviceSelected === service.name ? "selected" : ""}`}
              onClick={() => onSelectedServiceBtn(service.name)}>
              <span className="serviceName">{service.name}</span>
              <span className="servicePrice">{service.price}</span>
              <span className="serviceNote">{service.serviceNote}</span>
            </button>
          ))
        )}
      </div>
      <button
        className="nextServiceBtn"
        style={{ visibility: serviceSelected ? "visible" : "hidden" }}
        onClick={() => {
          onNextBtnPress()
          setServiceSelected("");
        }}>
        Next
      </button>
    </div>
    </>
  );
}
