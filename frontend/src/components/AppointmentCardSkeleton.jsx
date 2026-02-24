import "../App.css";


//skeleton for appointment cards
export default function AppointmentCardSkeleton({ count = 3 }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="appointmentCard appointmentSkeleton">
          <span className="skeleton skeleton-date" />
          <span className="skeleton skeleton-time" />
          <span className="skeleton skeleton-status" />
        </div>
      ))}
    </>
  );
}
