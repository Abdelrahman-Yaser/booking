"use client";
import { useState, useEffect } from "react";

const FlightFilters = ({ filters, onFilterChange, searchResults }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [airlines, setAirlines] = useState([]);

  // Extract airlines dynamically from searchResults
  useEffect(() => {
    if (searchResults?.solutions) {
      const airlineSet = new Set();
      searchResults.solutions.forEach(flight => {
        flight.journeys.forEach(journey => {
          journey.segments.forEach(segment => {
            airlineSet.add(segment.airline);
          });
        });
      });
      setAirlines(Array.from(airlineSet));
    }
  }, [searchResults]);

  // Update price range based on search results
  useEffect(() => {
    if (searchResults?.solutions) {
      const prices = searchResults.solutions.map(flight => flight.totalPrice);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange({
        min: Math.floor(minPrice / 10) * 10,
        max: Math.ceil(maxPrice / 10) * 10
      });
      if (!localFilters.priceRange.min && !localFilters.priceRange.max) {
        setLocalFilters(prev => ({
          ...prev,
          priceRange: {
            min: Math.floor(minPrice / 10) * 10,
            max: Math.ceil(maxPrice / 10) * 10
          }
        }));
      }
    }
  }, [searchResults]);

  // Update filters when local filters change
  useEffect(() => {
    onFilterChange(localFilters);
  }, [localFilters, onFilterChange]);

  const updateFilter = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleAirline = (airlineCode) => {
    setLocalFilters(prev => ({
      ...prev,
      airlines: prev.airlines.includes(airlineCode)
        ? prev.airlines.filter(code => code !== airlineCode)
        : [...prev.airlines, airlineCode]
    }));
  };

  const resetFilters = () => {
    setLocalFilters({
      direct: false,
      baggage: false,
      cabinClass: 'ECONOMY',
      adults: 1,
      children: 0,
      infants: 0,
      priceRange: { min: priceRange.min, max: priceRange.max },
      airlines: [],
      stops: 'any',
      departureTime: 'any',
      arrivalTime: 'any'
    });
  };

  const getAirlineCount = (airlineCode) => {
    if (!searchResults?.solutions) return 0;
    return searchResults.solutions.filter(flight =>
      flight.journeys[0].segments.some(segment => segment.airline === airlineCode)
    ).length;
  };

  const getStopsCount = (stopsType) => {
    if (!searchResults?.solutions) return 0;
    return searchResults.solutions.filter(flight => {
      const stops = flight.journeys[0].segments.length - 1;
      switch (stopsType) {
        case 'direct': return stops === 0;
        case '1stop': return stops === 1;
        case '2+stops': return stops >= 2;
        default: return true;
      }
    }).length;
  };

  return (
    <div className="flight-filters">
      <style jsx>{`
        .flight-filters {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.08);
          padding: 24px 18px;
          margin-bottom: 24px;
        }
        .filter-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 18px;
          color: #222;
        }
        .filter-section {
          margin-bottom: 22px;
        }
        .filter-label {
          font-size: 15px;
          font-weight: 500;
          margin-bottom: 8px;
          color: #444;
        }
        .checkbox {
          margin-right: 8px;
        }
        .airline-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .airline-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .airline-logo {
          width: 28px;
          height: 28px;
          object-fit: contain;
          border-radius: 4px;
          background: #f3f4f6;
        }
        .range-inputs {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .number-input {
          width: 48px;
          padding: 4px 8px;
          border: 1px solid #ddd;
          border-radius: 6px;
        }
        .select {
          width: 100%;
          padding: 8px;
          border-radius: 6px;
          border: 1px solid #ddd;
          font-size: 15px;
        }
        .reset-btn {
          width: 100%;
          padding: 10px;
          background: #f3f4f6;
          border: none;
          border-radius: 8px;
          color: #6b7280;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .reset-btn:hover {
          background: #e5e7eb;
          color: #374151;
        }
      `}</style>
      <div className="filter-title">Filters</div>
      {/* Direct flights & Baggage */}
      <div className="filter-section">
        <label className="filter-label">
          <input
            type="checkbox"
            className="checkbox"
            checked={localFilters.direct}
            onChange={e => updateFilter('direct', e.target.checked)}
          />
          Direct flights only
        </label>
        <label className="filter-label" style={{marginLeft: 12}}>
          <input
            type="checkbox"
            className="checkbox"
            checked={localFilters.baggage}
            onChange={e => updateFilter('baggage', e.target.checked)}
          />
          Baggage included
        </label>
      </div>
      {/* Cabin class */}
      <div className="filter-section">
        <label className="filter-label">Cabin class</label>
        <select
          className="select"
          value={localFilters.cabinClass}
          onChange={e => updateFilter('cabinClass', e.target.value)}
        >
          <option value="ECONOMY">Economy</option>
          <option value="PREMIUM ECONOMY">Premium Economy</option>
          <option value="BUSINESS">Business</option>
          <option value="FIRST">First</option>
        </select>
      </div>
      {/* Passengers */}
      <div className="filter-section">
        <label className="filter-label">Passengers</label>
        <div className="range-inputs">
          <span>Adults</span>
          <input
            type="number"
            className="number-input"
            min={1}
            max={9}
            value={localFilters.adults}
            onChange={e => updateFilter('adults', Math.max(1, Math.min(9, Number(e.target.value))))}
          />
          <span>Children</span>
          <input
            type="number"
            className="number-input"
            min={0}
            max={6}
            value={localFilters.children}
            onChange={e => updateFilter('children', Math.max(0, Math.min(6, Number(e.target.value))))}
          />
          <span>Infants</span>
          <input
            type="number"
            className="number-input"
            min={0}
            max={4}
            value={localFilters.infants}
            onChange={e => updateFilter('infants', Math.max(0, Math.min(4, Number(e.target.value))))}
          />
        </div>
      </div>
      {/* Airlines */}
      <div className="filter-section">
        <label className="filter-label">Airlines</label>
        <div className="airline-list">
          {airlines.map(code => (
            <label key={code} className="airline-item">
              <input
                type="checkbox"
                checked={localFilters.airlines.includes(code)}
                onChange={() => toggleAirline(code)}
              />
              <span>{code}</span>
            </label>
          ))}
        </div>
      </div>
      {/* Price range */}
      <div className="filter-section">
        <label className="filter-label">Price range (USD)</label>
        <div className="range-inputs">
          <input
            type="number"
            className="number-input"
            min={priceRange.min}
            max={localFilters.priceRange.max}
            value={localFilters.priceRange.min}
            onChange={e => updateFilter('priceRange', {
              ...localFilters.priceRange,
              min: Number(e.target.value)
            })}
          />
          <span>-</span>
          <input
            type="number"
            className="number-input"
            min={localFilters.priceRange.min}
            max={priceRange.max}
            value={localFilters.priceRange.max}
            onChange={e => updateFilter('priceRange', {
              ...localFilters.priceRange,
              max: Number(e.target.value)
            })}
          />
        </div>
      </div>
      {/* Stops */}
      <div className="filter-section">
        <label className="filter-label">Stops</label>
        <select
          className="select"
          value={localFilters.stops}
          onChange={e => updateFilter('stops', e.target.value)}
        >
          <option value="any">Any</option>
          <option value="direct">Direct</option>
          <option value="1stop">1 Stop</option>
          <option value="2+stops">2+ Stops</option>
        </select>
      </div>
      {/* Departure/Arrival time */}
      <div className="filter-section">
        <label className="filter-label">Departure time</label>
        <select
          className="select"
          value={localFilters.departureTime}
          onChange={e => updateFilter('departureTime', e.target.value)}
        >
          <option value="any">Any</option>
          <option value="morning">Morning (6-12)</option>
          <option value="afternoon">Afternoon (12-18)</option>
          <option value="evening">Evening (18-24)</option>
          <option value="night">Night (0-6)</option>
        </select>
        <label className="filter-label" style={{marginTop: 10}}>Arrival time</label>
        <select
          className="select"
          value={localFilters.arrivalTime}
          onChange={e => updateFilter('arrivalTime', e.target.value)}
        >
          <option value="any">Any</option>
          <option value="morning">Morning (6-12)</option>
          <option value="afternoon">Afternoon (12-18)</option>
          <option value="evening">Evening (18-24)</option>
          <option value="night">Night (0-6)</option>
        </select>
      </div>
      {/* Reset button */}
      <div className="filter-section">
        <button className="reset-btn" onClick={resetFilters}>
          Reset all filters
        </button>
      </div>
    </div>
  );
};

export default FlightFilters; 