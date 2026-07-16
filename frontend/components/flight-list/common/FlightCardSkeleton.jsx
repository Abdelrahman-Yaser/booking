const FlightCardSkeleton = () => {
  return (
    <div className="flight-card-skeleton px-30 py-20 rounded-4 bg-white shadow-1">
      <div className="d-flex justify-between items-center">
        <div className="d-flex items-center gap-15">
          <div className="skeleton-box size-40 rounded-4"></div>
          <div>
            <div className="skeleton-box h-15 w-120 mb-5"></div>
            <div className="skeleton-box h-12 w-80"></div>
          </div>
        </div>
        <div className="text-right">
          <div className="skeleton-box h-20 w-80 mb-5"></div>
          <div className="skeleton-box h-12 w-60"></div>
        </div>
      </div>

      <div className="mt-20">
        <div className="d-flex justify-between items-center">
          <div>
            <div className="skeleton-box h-15 w-60 mb-5"></div>
            <div className="skeleton-box h-12 w-100"></div>
          </div>
          <div className="text-center">
            <div className="skeleton-box h-12 w-80 mb-10"></div>
            <div className="skeleton-box h-2 w-150"></div>
          </div>
          <div className="text-right">
            <div className="skeleton-box h-15 w-60 mb-5"></div>
            <div className="skeleton-box h-12 w-100"></div>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="skeleton-box h-40 w-full rounded-4"></div>
      </div>
    </div>
  );
};

export default FlightCardSkeleton; 