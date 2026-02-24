import { format } from "date-fns";

export default function ShowAppointmentsInfo({
  adminMode,
  appointments,
  includeFreeAppointments,
}) {
  const visibleAppointments =
    appointments?.filter(
      (appointment) => includeFreeAppointments || appointment.userName
    ) || [];
  return (
    <div>
      {visibleAppointments.length > 0 ? (
        visibleAppointments.map((appointment) => (
          <button key={appointment.appointmentId} className="appointmentCard">
            <span>
              Date: {format(new Date(appointment.date), "dd/MM/yy")}
            </span>
            <span>
              Time: {format(new Date(appointment.date), "HH:mm")}
            </span>
            {adminMode && (
              <span>
                {appointment.userName
                  ? `Taken by: ${appointment.userName}`
                  : "Not taken"}
              </span>
            )}
          </button>
        ))
      ) : (
        <span>No appointments to display</span>
      )}
    </div>
  );
}
