import { format, parse } from "date-fns";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

export default function ChooseDateContainer({ updateDate,date }) {
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
    <div className="dateContainerMainWindow">
      <Calendar
      date={date}
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        views={["month"]}
        style={{ height: "250px", color: "black" }}
        onSelectSlot={(slotinfo) =>
        updateDate({date:new Date(slotinfo["start"])})
        }
        selectable={true}
      />
    </div>
  );
}
