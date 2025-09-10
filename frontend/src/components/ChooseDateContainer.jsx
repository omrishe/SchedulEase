import { format, parse } from "date-fns";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

export default function ChooseDateContainer({ updateDate,date }) {
  const locales = {"en-US": enUS,};
  const localizer = dateFnsLocalizer({format,parse,startOfWeek,getDay,locales,});

  return (
    <div className="dateContainerMainWindow">
      <Calendar
      date={date}
        localizer={localizer}
        events={[]}
        startAccessor="start"
        endAccessor="end"
        views={["month"]}
        style={{ height: "250px", color: "black" }}
        selected={date}
        onSelectSlot={(slotinfo) =>{
        updateDate({date:new Date(slotinfo["start"])})}}
        dayPropGetter={(calendarDate)=>({className: calendarDate.getTime() === date.getTime() ? "rbc-date-cell daySelected": "rbc-date-cell"})}
        selectable={true}
      />
    </div>
  );
}
