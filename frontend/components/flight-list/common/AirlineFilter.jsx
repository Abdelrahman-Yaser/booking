import React from 'react';
import Image from 'next/image';

const AirlineFilter = ({ airlines, selectedAirlines, onAirlineChange }) => {
  return (
    <div className="airlineFilter">
      {airlines.map((airline) => (
        <div key={airline.code} className="form-checkbox d-flex items-center gap-10">
          <input
            type="checkbox"
            id={`airline-${airline.code}`}
            checked={selectedAirlines.includes(airline.code)}
            onChange={(e) => {
              const isChecked = e.target.checked;
              onAirlineChange(airline.code, isChecked);
            }}
          />
          <label htmlFor={`airline-${airline.code}`} className="d-flex items-center gap-10">
            <div className="size-30 rounded-4 overflow-hidden">
              <Image
                src={`/img/airlines/${airline.code.toLowerCase()}.png`}
                alt={airline.name}
                width={30}
                height={30}
                className="size-full object-fit-cover"
              />
            </div>
            <span className="text-15">{airline.name}</span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default AirlineFilter; 