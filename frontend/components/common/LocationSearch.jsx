'use client'

import { useState } from "react";

const LocationSearch = ({ serviceType = "Hotel" }) => {
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Get placeholder and suggestions based on service type
  const getLocationConfig = () => {
    const configs = {
      'Flights': {
        placeholder: 'From - To',
        label: 'Flight Route',
        suggestions: [
          { name: 'New York (NYC) → London (LHR)', code: 'NYC-LHR' },
          { name: 'Dubai (DXB) → Paris (CDG)', code: 'DXB-CDG' },
          { name: 'Los Angeles (LAX) → Tokyo (NRT)', code: 'LAX-NRT' },
          { name: 'London (LHR) → Sydney (SYD)', code: 'LHR-SYD' },
          { name: 'Paris (CDG) → New York (JFK)', code: 'CDG-JFK' }
        ]
      },
      'Hotel': {
        placeholder: 'Where are you going?',
        label: 'Destination',
        suggestions: [
          { name: 'Paris, France', code: 'PAR' },
          { name: 'London, United Kingdom', code: 'LON' },
          { name: 'New York, USA', code: 'NYC' },
          { name: 'Dubai, UAE', code: 'DXB' },
          { name: 'Tokyo, Japan', code: 'TYO' }
        ]
      },
      'Tour': {
        placeholder: 'Tour destination',
        label: 'Tour Location',
        suggestions: [
          { name: 'Paris City Tour', code: 'PAR-TOUR' },
          { name: 'Rome Historical Tour', code: 'ROM-TOUR' },
          { name: 'Egypt Pyramids Tour', code: 'EGY-TOUR' },
          { name: 'Bali Adventure Tour', code: 'BAL-TOUR' },
          { name: 'Iceland Northern Lights', code: 'ICE-TOUR' }
        ]
      },
      'Activity': {
        placeholder: 'Activity location',
        label: 'Activity Destination',
        suggestions: [
          { name: 'Skydiving in Dubai', code: 'DXB-SKY' },
          { name: 'Scuba Diving in Maldives', code: 'MDV-DIVE' },
          { name: 'Safari in Kenya', code: 'KEN-SAF' },
          { name: 'Hiking in Switzerland', code: 'SWI-HIKE' },
          { name: 'Surfing in Hawaii', code: 'HAW-SURF' }
        ]
      },
      'Car': {
        placeholder: 'Pick-up location',
        label: 'Pick-up Location',
        suggestions: [
          { name: 'Dubai International Airport', code: 'DXB-AIRPORT' },
          { name: 'London Heathrow Airport', code: 'LHR-AIRPORT' },
          { name: 'Paris City Center', code: 'PAR-CITY' },
          { name: 'New York JFK Airport', code: 'JFK-AIRPORT' },
          { name: 'Los Angeles Downtown', code: 'LAX-CITY' }
        ]
      },
      'Cruise': {
        placeholder: 'Departure port',
        label: 'Cruise Port',
        suggestions: [
          { name: 'Miami, Florida', code: 'MIA-PORT' },
          { name: 'Barcelona, Spain', code: 'BCN-PORT' },
          { name: 'Venice, Italy', code: 'VEN-PORT' },
          { name: 'Southampton, UK', code: 'SOU-PORT' },
          { name: 'Sydney, Australia', code: 'SYD-PORT' }
        ]
      },
      'Holyday Rentals': {
        placeholder: 'Rental destination',
        label: 'Rental Location',
        suggestions: [
          { name: 'Santorini, Greece', code: 'SAN-RENT' },
          { name: 'Tuscany, Italy', code: 'TUS-RENT' },
          { name: 'Bali, Indonesia', code: 'BAL-RENT' },
          { name: 'Maldives Resort', code: 'MDV-RENT' },
          { name: 'Swiss Alps Chalet', code: 'SWI-RENT' }
        ]
      }
    };
    return configs[serviceType] || configs['Hotel'];
  };

  const config = getLocationConfig();

  const handleSuggestionClick = (suggestion) => {
    setSearchValue(suggestion.name);
    setIsOpen(false);
  };

  return (
    <div className="location-search-container position-relative">
      <div className="searchMenu-location">
        <label style={{
          display: 'block',
          fontSize: '18px',
          fontWeight: '700',
          color: '#374151',
          marginBottom: '15px'
        }}>
          {config.label}
        </label>
        <div className="searchMenu-location__field position-relative">
          <div style={{
            border: '3px solid #e5e7eb',
            borderRadius: '16px',
            height: '75px',
            position: 'relative',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.borderColor = '#6366f1'}
          onMouseLeave={(e) => {
            if (!isOpen) e.target.style.borderColor = '#e5e7eb';
          }}
          >
            <input
              type="text"
              placeholder={config.placeholder}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '16px',
                padding: '0 60px 0 25px',
                fontSize: '18px',
                fontWeight: '600',
                outline: 'none',
                backgroundColor: 'transparent'
              }}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={(e) => {
                setIsOpen(true);
                e.target.parentElement.style.borderColor = '#6366f1';
                e.target.parentElement.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
              }}
              onBlur={(e) => {
                setTimeout(() => setIsOpen(false), 200);
                e.target.parentElement.style.borderColor = '#e5e7eb';
                e.target.parentElement.style.boxShadow = 'none';
              }}
            />
            <i className="icon-location-2" style={{
              position: 'absolute',
              right: '25px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '20px',
              color: '#9ca3af'
            }} />
          </div>
          
          {isOpen && (
            <div style={{
              position: 'absolute',
              width: '100%',
              backgroundColor: 'white',
              border: '3px solid #e5e7eb',
              borderRadius: '16px',
              boxShadow: '0 15px 50px rgba(0,0,0,0.2)',
              marginTop: '10px',
              zIndex: 1000,
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {config.suggestions
                .filter(item => 
                  item.name.toLowerCase().includes(searchValue.toLowerCase())
                )
                .map((suggestion, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '18px 25px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      borderBottom: index < config.suggestions.length - 1 ? '1px solid #f3f4f6' : 'none'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <i className="icon-location-2" style={{
                        fontSize: '18px',
                        color: '#6366f1',
                        marginRight: '15px'
                      }} />
                      <span style={{
                        fontSize: '16px',
                        color: '#374151',
                        fontWeight: '600'
                      }}>
                        {suggestion.name}
                      </span>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationSearch; 