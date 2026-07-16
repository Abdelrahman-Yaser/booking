import React from 'react';

const TimeFilter = ({ timeRange, onTimeChange }) => {
  const timeSlots = [
    { label: 'Early Morning', start: '00:00', end: '06:00' },
    { label: 'Morning', start: '06:00', end: '12:00' },
    { label: 'Afternoon', start: '12:00', end: '18:00' },
    { label: 'Evening', start: '18:00', end: '23:59' }
  ];

  return (
    <div className="timeFilter">
      <h5 className="text-18 fw-500 mb-10">Departure Time</h5>
      <div className="d-flex flex-column gap-15">
        {timeSlots.map((slot) => (
          <div key={slot.label} className="form-checkbox">
            <input
              type="checkbox"
              id={`time-${slot.label}`}
              checked={timeRange.some(r => r.start === slot.start && r.end === slot.end)}
              onChange={(e) => {
                if (e.target.checked) {
                  onTimeChange([...timeRange, slot]);
                } else {
                  onTimeChange(timeRange.filter(r => 
                    r.start !== slot.start || r.end !== slot.end
                  ));
                }
              }}
            />
            <label htmlFor={`time-${slot.label}`}>
              <span className="text-15">{slot.label}</span>
              <span className="text-14 text-light-1 ml-5">
                ({slot.start} - {slot.end})
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeFilter; 