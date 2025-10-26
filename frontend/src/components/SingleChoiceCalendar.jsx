import { format, parse } from "date-fns";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

export default function SingleChoiceCalendar({ updateDate, date }) {
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "8px",
          marginTop: "8px",
        }}
      >
        <button style={{ width: "5%" }} onClick={() => onNavigate("PREV")}>
          ←
        </button>
        <span style={{ fontWeight: "bold" }}>{label}</span>
        <button style={{ width: "5%" }} onClick={() => onNavigate("NEXT")}>
          →
        </button>
        <button style={{ width: "10%" }} onClick={() => onNavigate("TODAY")}>
          Today
        </button>
      </div>
    );
  }

  return (
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
        updateDate({ date: new Date(slotinfo["start"]) });
      }}
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
      onNavigate={(newDate) => updateDate({ date: newDate })}
    />
  );
}
