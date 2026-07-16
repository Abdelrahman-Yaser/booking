import React, { useState } from 'react';

const FlightFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    directOnly: false,
    baggageIncluded: false,
    cabinClass: 'ECONOMY',
    airlines: [],
    priceRange: {
      min: 0,
      max: 10000
    }
  });

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flight-filters px-30 py-30 rounded-4 bg-white shadow-1">
      <div className="mb-20">
        <h5 className="text-18 fw-500 mb-10">Flight Options</h5>
        <div className="d-flex flex-column gap-15">
          <div className="form-checkbox">
            <input
              type="checkbox"
              id="directOnly"
              checked={filters.directOnly}
              onChange={(e) => handleFilterChange('directOnly', e.target.checked)}
            />
            <label htmlFor="directOnly">Direct flights only</label>
          </div>
          <div className="form-checkbox">
            <input
              type="checkbox"
              id="baggageIncluded"
              checked={filters.baggageIncluded}
              onChange={(e) => handleFilterChange('baggageIncluded', e.target.checked)}
            />
            <label htmlFor="baggageIncluded">Include baggage</label>
          </div>
        </div>
      </div>

      <div className="mb-20">
        <h5 className="text-18 fw-500 mb-10">Cabin Class</h5>
        <div className="d-flex flex-column gap-15">
          {['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST'].map((cabinClass) => (
            <div className="form-radio" key={cabinClass}>
              <input
                type="radio"
                id={cabinClass}
                name="cabinClass"
                checked={filters.cabinClass === cabinClass}
                onChange={() => handleFilterChange('cabinClass', cabinClass)}
              />
              <label htmlFor={cabinClass}>
                {cabinClass.replace('_', ' ')}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-20">
        <h5 className="text-18 fw-500 mb-10">Price Range</h5>
        <div className="js-price-rangeSlider">
          <div className="d-flex justify-between mb-20">
            <div className="text-15 text-dark-1">
              <span className="js-lower mr-10">${filters.priceRange.min}</span>
              -
              <span className="js-upper ml-10">${filters.priceRange.max}</span>
            </div>
          </div>
          <div className="px-5">
            <input
              type="range"
              className="js-range-slider"
              min="0"
              max="10000"
              value={filters.priceRange.max}
              onChange={(e) => handleFilterChange('priceRange', {
                ...filters.priceRange,
                max: parseInt(e.target.value)
              })}
            />
          </div>
        </div>
      </div>

      <div>
        <h5 className="text-18 fw-500 mb-10">Airlines</h5>
        <div className="airlineFilter">
          {/* Airlines will be populated dynamically */}
        </div>
      </div>
    </div>
  );
};

export default FlightFilters; 