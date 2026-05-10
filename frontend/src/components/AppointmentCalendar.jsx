import { format, parse } from "date-fns";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

export default function AppointmentCalendar({ updateDate, date }) {
  const locales = { "en-US": enUS };
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });
  //sets a custom toolbar to the calendar
  function CustomToolbar({ label, onNavigate }) {
    return (
      <div className="calendarToolbar">
        <button onClick={() => onNavigate("PREV")}>←</button>
        <span>{label}</span>
        <button onClick={() => onNavigate("NEXT")}>→</button>
        <button
          className="calendarTodayBtn"
          onClick={() => onNavigate("TODAY")}
        >
          Today
        </button>
      </div>
    );
  }

  return (
    <>
      <label>Choose Date</label>
      <Calendar
        className="calendarClass"
        date={date}
        localizer={localizer}
        events={[]}
        startAccessor="start"
        endAccessor="end"
        views={["month"]}
        style={{ height: "250px", width: "100%", color: "black" }}
        selected={date}
        onSelectSlot={(slotinfo) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (slotinfo["start"] >= today) {
            updateDate({ date: new Date(slotinfo["start"]) });
          }
        }}
        //highlights the selected day
        dayPropGetter={(calendarDate) => ({
          className:
            calendarDate.getTime() === date.getTime()
              ? "rbc-date-cell daySelected"
              : "rbc-date-cell",
        })}
        selectable={true}
        /*customizes the calendar buttons */
        components={{ toolbar: CustomToolbar }}
        /*sets so when clicking on button it also moves the calendar and saved date */
        onNavigate={(newDate) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (newDate >= today) {
            updateDate({ date: newDate });
          }
        }}
      />
    </>
  );
}
