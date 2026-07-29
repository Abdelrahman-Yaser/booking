'use client'

import { useState } from "react";

const GuestSearch = ({ serviceType = "Hotel" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [guestCounts, setGuestCounts] = useState({
    adults: 2,
    children: 0,
    rooms: 1,
    passengers: 1,
    cars: 1,
    cabins: 1
  });

  // Get configuration based on service type
  const getGuestConfig = () => {
    const configs = {
      'Flights': {
        label: 'Passengers',
        fields: ['passengers'],
        displayText: `${guestCounts.passengers} Passenger${guestCounts.passengers !== 1 ? 's' : ''}`
      },
      'Hotel': {
        label: 'Guests & Rooms',
        fields: ['adults', 'children', 'rooms'],
        displayText: `${guestCounts.adults} Adults, ${guestCounts.children} Children, ${guestCounts.rooms} Room${guestCounts.rooms !== 1 ? 's' : ''}`
      },
      'Tour': {
        label: 'Travelers',
        fields: ['adults', 'children'],
        displayText: `${guestCounts.adults} Adults, ${guestCounts.children} Children`
      },
      'Activity': {
        label: 'Participants',
        fields: ['adults', 'children'],
        displayText: `${guestCounts.adults} Adults, ${guestCounts.children} Children`
      },
      'Car': {
        label: 'Cars Needed',
        fields: ['cars'],
        displayText: `${guestCounts.cars} Car${guestCounts.cars !== 1 ? 's' : ''}`
      },
      'Cruise': {
        label: 'Guests & Cabins',
        fields: ['adults', 'children', 'cabins'],
        displayText: `${guestCounts.adults} Adults, ${guestCounts.children} Children, ${guestCounts.cabins} Cabin${guestCounts.cabins !== 1 ? 's' : ''}`
      },
      'Holyday Rentals': {
        label: 'Guests',
        fields: ['adults', 'children'],
        displayText: `${guestCounts.adults} Adults, ${guestCounts.children} Children`
      }
    };
    return configs[serviceType] || configs['Hotel'];
  };

  const config = getGuestConfig();

  const updateCount = (field, increment) => {
    setGuestCounts(prev => ({
      ...prev,
      [field]: Math.max(increment ? prev[field] + 1 : prev[field] - 1, field === 'children' ? 0 : 1)
    }));
  };

  const getFieldLabel = (field) => {
    const labels = {
      adults: 'Adults',
      children: 'Children',
      rooms: 'Rooms',
      passengers: 'Passengers',
      cars: 'Cars',
      cabins: 'Cabins'
    };
    return labels[field];
  };

  return (
    <div className="guest-search-container position-relative">
      <div className="searchMenu-guests">
        <h4 className="text-14 fw-500 text-dark-1 mb-8">
          {config.label}
        </h4>
        <div 
          className="searchMenu-guests__field d-flex items-center justify-between w-100 h-50 px-15 rounded-8 border-light cursor-pointer"
          style={{
            border: '1px solid #e5e7eb',
            transition: 'all 0.3s ease'
          }}
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={(e) => {
            e.target.style.borderColor = '#3b82f6';
          }}
          onMouseLeave={(e) => {
            if (!isOpen) e.target.style.borderColor = '#e5e7eb';
          }}
        >
          <span className="text-14 text-dark-1">{config.displayText}</span>
          <i className={`icon-chevron-sm-down text-16 text-light-1 transition-all ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        {isOpen && (
          <div className="guest-dropdown position-absolute w-100 bg-white border rounded-8 shadow-4 mt-5 p-15" 
               style={{zIndex: 1000, minWidth: '280px'}}>
            {config.fields.map((field) => (
              <div key={field} className="d-flex items-center justify-between py-8">
                <span className="text-14 fw-500 text-dark-1">
                  {getFieldLabel(field)}
                </span>
                <div className="d-flex items-center" style={{gap: '10px'}}>
                  <button
                    className="d-flex items-center justify-center w-30 h-30 rounded-6 border-light bg-light-2 transition-all"
                    style={{border: '1px solid #e5e7eb'}}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateCount(field, false);
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#e2e8f0'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                  >
                    <i className="icon-minus text-12" />
                  </button>
                  <span className="text-14 fw-600 text-dark-1 min-w-20 text-center">
                    {guestCounts[field]}
                  </span>
                  <button
                    className="d-flex items-center justify-center w-30 h-30 rounded-6 border-light bg-light-2 transition-all"
                    style={{border: '1px solid #e5e7eb'}}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateCount(field, true);
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#e2e8f0'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                  >
                    <i className="icon-plus text-12" />
                  </button>
                </div>
              </div>
            ))}
            
            <div className="d-flex justify-end mt-10">
              <button
                className="px-15 py-6 bg-blue-1 text-white rounded-6 text-13 fw-500 transition-all"
                style={{border: 'none'}}
                onClick={() => setIsOpen(false)}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="position-fixed w-100 h-100"
          style={{top: 0, left: 0, zIndex: 999}}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default GuestSearch; 