import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse } from "date-fns";
import {dateFnsLocalizer } from "react-big-calendar";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { useMemo, useState } from "react";
import ChooseTime from "../components/ChooseTime";
import ChooseDateContainer from "../components/ChooseDateContainer";
import { createStore } from "../api/store";

export function AdminPanel({ userAuthData, allTimes }) {
  const maxTimeSelections=24;
  const locales = {
    "en-US": enUS,
  };
  const [date,setDate]=useState(new Date());
  const buttons = <div>times.map()</div>;
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });
  let eventList = [];
  const { defaultDate } = useMemo(
    () => ({
      defaultDate: new Date(),
    }),
    []
  );
  async function updateDate(dateClicked){
    setDate(dateClicked["date"]);
  }

  //handles sending store owner time available
  function handleSetMenuItemBtn(timeArray,maxSelections) {
    return "hi";
  }

  //temp function to create a testing store - delete after
  async function createNewStore(){
  const tempStore={
  "storeName": "Omri's Barbershop",
  "storeNote": "Walk-ins welcome",
  "announcement": "Holiday discounts available",
  services: [
    { name: "Haircut", price: "20", serviceNote: "Includes wash" }
  ]
}
    const response = await createStore(tempStore);
    return response.message;
  }

  return userAuthData.role === "admin" ? (
    <div className="AdminPanelMainDiv">
      <p>welcome Admin</p>
      <div className="calanderDiv">
      <ChooseDateContainer updateDate={updateDate} date={date}></ChooseDateContainer>
      <ChooseTime times={allTimes} appointmentInfo={{date : date}} maxTimeSelections={maxTimeSelections} handleSetMenuItemBtn={handleSetMenuItemBtn} /*</div>handleChooseTimeOnlick={sendDataToServer}*/></ChooseTime>
    </div>
      <button onClick={createNewStore}>temp create store button</button>
    </div>
  ) : (
    <p>forbidden</p>
  );
}
