import { format } from "date-fns";

//a component to show appointments
export default function AppointmentDetails({
  adminMode,
  appointments,
  includeFreeAppointments,
}) {
  //show only appointments that are not free if includeFreeAppointments is false
  const visibleAppointments =
    appointments?.filter(
      (appointment) => includeFreeAppointments || appointment.userName,
    ) || [];
  return (
    <div>
      {visibleAppointments.length > 0 ? (
        visibleAppointments.map((appointment) => (
          <button key={appointment.appointmentId} className="appointmentCard">
            <span>Date: {format(new Date(appointment.date), "dd/MM/yy")}</span>
            <span>Time: {format(new Date(appointment.date), "HH:mm")}</span>
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
