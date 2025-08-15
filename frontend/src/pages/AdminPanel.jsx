import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse } from "date-fns";
import {dateFnsLocalizer } from "react-big-calendar";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { useMemo, useState } from "react";
import ChooseTime from "../components/ChooseTime";
import ChooseDateContainer from "../components/ChooseDateContainer";

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



  return userAuthData.role === "admin" ? (
    <div className="AdminPanelMainDiv">
      <p>welcome Admin</p>
      <div className="calanderDiv">
      <ChooseDateContainer updateDate={updateDate} date={date}></ChooseDateContainer>
      <ChooseTime times={allTimes} appointmentInfo={{date : date}} maxTimeSelections={maxTimeSelections} handleSetMenuItemBtn={handleSetMenuItemBtn} /*</div>handleChooseTimeOnlick={sendDataToServer}*/></ChooseTime>
    </div>
    </div>
  ) : (
    <p>forbidden</p>
  );
}
