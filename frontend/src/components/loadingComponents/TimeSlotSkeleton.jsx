import "../App.css";


//skeleton for time slots
export default function TimeSlotSkeleton({ count = 8 }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton skeleton-pill" />
      ))}
    </>
  );
}
