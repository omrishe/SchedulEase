import "../App.css";


//skeleton for service cards
export default function ServiceCardSkeleton({ count = 4 }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="serviceBtn serviceSkeleton">
          <span className="skeleton skeleton-name" />
          <span className="skeleton skeleton-price" />
          <span className="skeleton skeleton-note" />
        </div>
      ))}
    </>
  );
}
