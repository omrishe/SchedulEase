import { useState } from "react";

export default function MenuItems({
  setWindow,
  services,
  onNextServiceBtnPress,
}) {
  const [serviceSelected, setServiceSelected] = useState("");

  function onSelectedServiceBtn(serviceName) {
    serviceName === serviceSelected
      ? setServiceSelected("")
      : setServiceSelected(serviceName);
  }

  return (
    <div>
      <div className="scrollableMenu">
        {services.map((service) => (
          <button
            key={`${service.name}${service.price}${service.serviceNote}`}
            className="serviceBtn"
            onClick={() => onSelectedServiceBtn(service.name)}
          >
            <span className="serviceName">{service.name}</span>
            <span className="servicePrice">{service.price}</span>
            <span className="serviceNote">{service.serviceNote}</span>
          </button>
        ))}
      </div>
      <button
        hidden={!serviceSelected}
        onClick={() => {
          setWindow("date");
          setServiceSelected("");
          onNextServiceBtnPress(serviceSelected);
        }}
      >
        Next
      </button>
    </div>
  );
}
