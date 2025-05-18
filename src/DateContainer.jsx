import "./App.css";
import format from "date-fns/format";
import parse from "date-fns/parse";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
export default function DateContainer({
  menuItemsList,
  onClick,
  handleDayClick,
}) {
  const locales = {
    "en-US": enUS,
  };
  const myEventsList = [];
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });
  return (
    <Calendar
      localizer={localizer}
      events={myEventsList}
      startAccessor="start"
      endAccessor="end"
      views={["month"]}
      style={{ height: "250px", color: "black" }}
      //onSelectSlot={({ start }) => handleDayClick(start)}
      onSelectSlot={handleDayClick}
      selectable={true}
    />
  );
}
