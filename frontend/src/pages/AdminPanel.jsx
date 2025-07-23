import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse } from "date-fns";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { useMemo, useState } from "react";

export function AdminPanel({ userAuthData, times }) {
  const { timesSelected, setTimeSelected } = [];
  const locales = {
    "en-US": enUS,
  };
  const buttons = <div>times.map()</div>;
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });
  let eventlist = [];
  const { defaultDate } = useMemo(
    () => ({
      defaultDate: new Date(),
    }),
    []
  );
  const AdminCalendar = (props) => (
    <div className="calanderDiv">
      <Calendar
        defaultDate={defaultDate}
        localizer={localizer}
        events={eventList}
        views={["month"]}
        style={{
          height: "450px",
          width: "66%",
          alignSelf: "center",
          color: "black",
        }}
        startAccessor="start"
        endAccessor="end"
      />
      <times></times>
    </div>
  );
  function handleSetMenuItemBtn() {
    return;
  }
  return userAuthData.role === "admin" ? (
    <>
      <p>welcome Admin</p>
      <AdminCalendar></AdminCalendar>
      <button onClick={handleSetMenuItemBtn}>dont click</button>
    </>
  ) : (
    <p>forbidden</p>
  );
}
