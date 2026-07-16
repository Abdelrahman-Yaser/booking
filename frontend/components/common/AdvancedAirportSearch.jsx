"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaPlane, FaMapMarkerAlt, FaExchangeAlt } from "react-icons/fa";
import airportsData from "../../data/airports.json";

// Debounce utility
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const AdvancedAirportSearch = ({ 
  originValue, 
  destinationValue, 
  onOriginChange, 
  onDestinationChange,
  onSwap 
}) => {
  const [originQuery, setOriginQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [originResults, setOriginResults] = useState([]);
  const [destinationResults, setDestinationResults] = useState([]);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [popularAirports, setPopularAirports] = useState([]);

  const originRef = useRef(null);
  const destinationRef = useRef(null);

  // Load popular airports on component mount
  useEffect(() => {
    const popular = airportsData.airports.slice(0, 8); // First 8 airports as popular
    setPopularAirports(popular);
  }, []);

  // Advanced search function
  const searchAirports = useCallback((query) => {
    if (!query || query.length < 1) {
      return popularAirports;
    }

    const searchTerm = query.toLowerCase();
    const results = [];

    // Search in airports
    airportsData.airports.forEach(airport => {
      const score = calculateRelevanceScore(airport, searchTerm);
      if (score > 0) {
        results.push({ ...airport, score, type: 'airport' });
      }
    });

    // Search in cities (for multi-airport cities)
    Object.entries(airportsData.cities).forEach(([cityName, cityData]) => {
      const cityScore = calculateCityRelevanceScore(cityName, cityData, searchTerm);
      if (cityScore > 0) {
        results.push({
          name: `${cityName} - All Airports`,
          nameAr: `${cityData.nameAr} - جميع المطارات`,
          city: cityName,
          cityAr: cityData.nameAr,
          country: cityData.country,
          countryAr: cityData.countryAr,
          airports: cityData.airports,
          score: cityScore,
          type: 'city'
        });
      }
    });

    // Sort by relevance score
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 10); // Return top 10 results
  }, [popularAirports]);

  // Calculate relevance score for airports
  const calculateRelevanceScore = (airport, searchTerm) => {
    let score = 0;
    
    // IATA code exact match (highest priority)
    if (airport.iata.toLowerCase() === searchTerm) score += 100;
    else if (airport.iata.toLowerCase().includes(searchTerm)) score += 80;
    
    // Airport name matches
    if (airport.name.toLowerCase().includes(searchTerm)) score += 60;
    if (airport.nameAr && airport.nameAr.includes(searchTerm)) score += 60;
    
    // City matches
    if (airport.city.toLowerCase().includes(searchTerm)) score += 40;
    if (airport.cityAr && airport.cityAr.includes(searchTerm)) score += 40;
    
    // Country matches
    if (airport.country.toLowerCase().includes(searchTerm)) score += 20;
    if (airport.countryAr && airport.countryAr.includes(searchTerm)) score += 20;

    return score;
  };

  // Calculate relevance score for cities
  const calculateCityRelevanceScore = (cityName, cityData, searchTerm) => {
    let score = 0;
    
    if (cityName.toLowerCase().includes(searchTerm)) score += 70;
    if (cityData.nameAr && cityData.nameAr.includes(searchTerm)) score += 70;
    if (cityData.country.toLowerCase().includes(searchTerm)) score += 30;
    if (cityData.countryAr && cityData.countryAr.includes(searchTerm)) score += 30;

    return score;
  };

  // Debounced search functions
  const debouncedOriginSearch = useCallback(
    debounce((query) => {
      const results = searchAirports(query);
      setOriginResults(results);
    }, 200),
    [searchAirports]
  );

  const debouncedDestinationSearch = useCallback(
    debounce((query) => {
      const results = searchAirports(query);
      setDestinationResults(results);
    }, 200),
    [searchAirports]
  );

  // Handle input changes
  const handleOriginInputChange = (e) => {
    const value = e.target.value;
    setOriginQuery(value);
    setShowOriginDropdown(true);
    debouncedOriginSearch(value);
  };

  const handleDestinationInputChange = (e) => {
    const value = e.target.value;
    setDestinationQuery(value);
    setShowDestinationDropdown(true);
    debouncedDestinationSearch(value);
  };

  // Handle selection
  const handleOriginSelect = (item) => {
    if (item.type === 'airport') {
      setOriginQuery(`${item.city} (${item.iata})`);
      onOriginChange(item);
    } else {
      setOriginQuery(`${item.city} - All Airports`);
      onOriginChange(item);
    }
    setShowOriginDropdown(false);
  };

  const handleDestinationSelect = (item) => {
    if (item.type === 'airport') {
      setDestinationQuery(`${item.city} (${item.iata})`);
      onDestinationChange(item);
    } else {
      setDestinationQuery(`${item.city} - All Airports`);
      onDestinationChange(item);
    }
    setShowDestinationDropdown(false);
  };

  // Handle focus
  const handleOriginFocus = () => {
    setShowOriginDropdown(true);
    if (originResults.length === 0) {
      setOriginResults(popularAirports);
    }
  };

  const handleDestinationFocus = () => {
    setShowDestinationDropdown(true);
    if (destinationResults.length === 0) {
      setDestinationResults(popularAirports);
    }
  };

  // Handle swap
  const handleSwap = () => {
    const tempQuery = originQuery;
    setOriginQuery(destinationQuery);
    setDestinationQuery(tempQuery);
    onSwap();
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (originRef.current && !originRef.current.contains(event.target)) {
        setShowOriginDropdown(false);
      }
      if (destinationRef.current && !destinationRef.current.contains(event.target)) {
        setShowDestinationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="advanced-airport-search">
      <style jsx>{`
        .advanced-airport-search {
          display: flex;
          align-items: center;
          gap: 0;
          position: relative;
        }

        .airport-input-container {
          position: relative;
          flex: 1;
        }

        .airport-input {
          width: 100%;
          border: none;
          background: transparent;
          font-size: 16px;
          font-weight: 600;
          color: #333;
          padding: 0;
          outline: none;
        }

        .airport-input::placeholder {
          color: #999;
          font-weight: 400;
        }

        .airport-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          z-index: 9999;
          max-height: 300px;
          overflow-y: auto;
          margin-top: 5px;
        }

        .airport-dropdown::-webkit-scrollbar {
          width: 6px;
        }

        .airport-dropdown::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .airport-dropdown::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }

        .airport-dropdown::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        .dropdown-item {
          padding: 12px 16px;
          cursor: pointer;
          border-bottom: 1px solid #f5f5f5;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s;
        }

        .dropdown-item:hover {
          background: #f8f9fa;
        }

        .dropdown-item:last-child {
          border-bottom: none;
        }

        .airport-icon {
          width: 40px;
          height: 40px;
          background: rgba(83, 10, 166, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgb(83, 10, 166);
          font-size: 18px;
        }

        .city-icon {
          width: 40px;
          height: 40px;
          background: rgba(255, 81, 0, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgb(255, 81, 0);
          font-size: 18px;
        }

        .airport-code {
          background: rgba(83, 10, 166, 0.1);
          color: rgb(83, 10, 166);
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 12px;
          min-width: 40px;
          text-align: center;
        }

        .airport-info {
          flex: 1;
        }

        .airport-name {
          font-weight: 600;
          font-size: 14px;
          color: #333;
          margin-bottom: 2px;
        }

        .airport-location {
          font-size: 12px;
          color: #666;
        }

        .swap-button {
          width: 40px;
          height: 40px;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          margin: 0 10px;
          z-index: 10;
          position: relative;
        }

        .swap-button:hover {
          border-color: rgb(83, 10, 166);
          background: rgb(83, 10, 166);
          color: white;
          transform: rotate(180deg);
        }

        .popular-header {
          padding: 12px 16px;
          background: #f8f9fa;
          border-bottom: 1px solid #e0e0e0;
          font-size: 12px;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
        }
      `}</style>

      {/* Origin Input */}
      <div className="airport-input-container" ref={originRef}>
        <input
          type="text"
          className="airport-input"
          placeholder="Search Origin (e.g., Cairo, CAI)"
          value={originQuery}
          onChange={handleOriginInputChange}
          onFocus={handleOriginFocus}
        />
        
        {showOriginDropdown && (
          <div className="airport-dropdown">
            {originQuery.length === 0 && (
              <div className="popular-header">Popular Destinations</div>
            )}
            {originResults.map((item, index) => (
              <div
                key={`${item.iata || item.city}-${index}`}
                className="dropdown-item"
                onClick={() => handleOriginSelect(item)}
              >
                <div className={item.type === 'airport' ? 'airport-icon' : 'city-icon'}>
                  {item.type === 'airport' ? <FaPlane /> : <FaMapMarkerAlt />}
                </div>
                <div className="airport-info">
                  <div className="airport-name">
                    {item.type === 'airport' ? item.name : item.name}
                  </div>
                  <div className="airport-location">
                    {item.type === 'airport' 
                      ? `${item.city}, ${item.country}`
                      : `${item.country} - ${item.airports?.length || 0} airports`
                    }
                  </div>
                </div>
                {item.type === 'airport' && (
                  <div className="airport-code">{item.iata}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Swap Button */}
      <button className="swap-button" onClick={handleSwap} type="button">
        <FaExchangeAlt />
      </button>

      {/* Destination Input */}
      <div className="airport-input-container" ref={destinationRef}>
        <input
          type="text"
          className="airport-input"
          placeholder="Search Destination (e.g., Dubai, DXB)"
          value={destinationQuery}
          onChange={handleDestinationInputChange}
          onFocus={handleDestinationFocus}
        />
        
        {showDestinationDropdown && (
          <div className="airport-dropdown">
            {destinationQuery.length === 0 && (
              <div className="popular-header">Popular Destinations</div>
            )}
            {destinationResults.map((item, index) => (
              <div
                key={`${item.iata || item.city}-${index}`}
                className="dropdown-item"
                onClick={() => handleDestinationSelect(item)}
              >
                <div className={item.type === 'airport' ? 'airport-icon' : 'city-icon'}>
                  {item.type === 'airport' ? <FaPlane /> : <FaMapMarkerAlt />}
                </div>
                <div className="airport-info">
                  <div className="airport-name">
                    {item.type === 'airport' ? item.name : item.name}
                  </div>
                  <div className="airport-location">
                    {item.type === 'airport' 
                      ? `${item.city}, ${item.country}`
                      : `${item.country} - ${item.airports?.length || 0} airports`
                    }
                  </div>
                </div>
                {item.type === 'airport' && (
                  <div className="airport-code">{item.iata}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedAirportSearch; 