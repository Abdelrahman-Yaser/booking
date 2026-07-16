import { FaClock } from 'react-icons/fa';

const LayoverInfo = ({ segments }) => {
  if (segments.length <= 1) return null;

  const calculateLayoverDuration = (arrival, departure) => {
    const arrivalTime = new Date(arrival);
    const departureTime = new Date(departure);
    const duration = (departureTime - arrivalTime) / (1000 * 60); // in minutes
    
    if (duration < 60) {
      return `${Math.round(duration)}m`;
    }
    
    const hours = Math.floor(duration / 60);
    const minutes = Math.round(duration % 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="layover-info mt-15">
      {segments.slice(0, -1).map((segment, index) => {
        const nextSegment = segments[index + 1];
        const duration = calculateLayoverDuration(
          segment.arrivalDate,
          nextSegment.departureDate
        );

        return (
          <div key={index} className="layover-item">
            <div className="d-flex items-center gap-10 py-10 border-dashed-t border-dashed-b">
              <FaClock className="text-15 text-light-1" />
              <div>
                <span className="text-14 text-light-1">Layover in </span>
                <span className="text-14 fw-500">{segment.arrival}</span>
                <span className="text-14 text-light-1"> · </span>
                <span className="text-14 fw-500">{duration}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LayoverInfo; 