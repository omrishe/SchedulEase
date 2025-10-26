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
          <button key={appointment.appointmentId} className="serviceBtn">
            <span className="">
              date: {format(new Date(appointment.date), "dd/MM/yy")}
            </span>
            <span className="">
              time: {format(new Date(appointment.date), "HH:mm")}
            </span>
            {adminMode && (
              <span className="">
                {appointment.userName
                  ? `taken by: ${appointment.userName}`
                  : "not taken"}
              </span>
            )}
          </button>
        ))
      ) : (
        <span>no appointment to display</span>
      )}
    </div>
  );
}
