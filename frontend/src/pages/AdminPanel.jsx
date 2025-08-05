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
  const { timesSelected, setTimeSelected } = [];
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

  function handleSetMenuItemBtn() {
    return;
  }
  return userAuthData.role === "admin" ? (
    <div className="AdminPanelMainDiv">
      <p>welcome Admin</p>
      <div className="calanderDiv">
      <ChooseDateContainer updateDate={updateDate} date={date}></ChooseDateContainer>
      <ChooseTime times={allTimes} appointmentInfo={{date : date}} maxTimeSelections={24} /*</div>handleChooseTimeOnlick={sendDataToServer}*/></ChooseTime>
    </div>
      <button onClick={handleSetMenuItemBtn}>dont click</button>
    </div>
  ) : (
    <p>forbidden</p>
  );
}
