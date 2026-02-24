import {  useState } from "react";
import ServiceCardSkeleton from "./ServiceCardSkeleton";

export default function MenuItems({ setWindow,services,onNextServiceBtnPress }) {
  const [serviceSelected,setServiceSelected]=useState("")
  const isLoading = !services || services.length === 0 || services[0] === "loading";

  function onSelectedServiceBtn(serviceName){
    serviceName===serviceSelected ? setServiceSelected("") : setServiceSelected(serviceName)
  }

  return (
    <div>
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
        hidden={!serviceSelected}
        onClick={() => {
          setWindow("date");
          setServiceSelected("");
          onNextServiceBtnPress(serviceSelected)
        }}>
        Next
      </button>
    </div>
  );
}
