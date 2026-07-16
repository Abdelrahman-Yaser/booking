"use client";
import { useState } from "react";

const FlightSearchEngine = ({ onSearch, loading }) => {
  const [searchParams, setSearchParams] = useState({
    journeys: [
      {
        departure: '',
        arrival: '',
        departureDate: new Date().toISOString().split('T')[0]
      }
    ],
    passengers: {
      adults: 1,
      children: 0,
      infants: 0
    },
    cabinClass: 'ECONOMY',
    tripType: 'oneWay'
  });

  const [errors, setErrors] = useState({});

  // Major airports data
  const airports = [
    { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey' },
    { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE' },
    { code: 'DOH', name: 'Hamad International', city: 'Doha', country: 'Qatar' },
    { code: 'CAI', name: 'Cairo International', city: 'Cairo', country: 'Egypt' },
    { code: 'JED', name: 'King Abdulaziz International', city: 'Jeddah', country: 'Saudi Arabia' },
    { code: 'RUH', name: 'King Khalid International', city: 'Riyadh', country: 'Saudi Arabia' },
    { code: 'KWI', name: 'Kuwait International', city: 'Kuwait City', country: 'Kuwait' },
    { code: 'BAH', name: 'Bahrain International', city: 'Manama', country: 'Bahrain' },
    { code: 'AUH', name: 'Abu Dhabi International', city: 'Abu Dhabi', country: 'UAE' },
    { code: 'AMM', name: 'Queen Alia International', city: 'Amman', country: 'Jordan' },
    { code: 'BEY', name: 'Beirut Airport', city: 'Beirut', country: 'Lebanon' },
    { code: 'LHR', name: 'London Heathrow', city: 'London', country: 'UK' },
    { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France' },
    { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
    { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
    { code: 'SIN', name: 'Singapore Changi', city: 'Singapore', country: 'Singapore' },
    { code: 'JFK', name: 'John F. Kennedy', city: 'New York', country: 'USA' },
    { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA' }
  ];

  const validateSearch = () => {
    const newErrors = {};

    if (!searchParams.journeys[0].departure) {
      newErrors.departure = 'يرجى اختيار مطار المغادرة';
    }

    if (!searchParams.journeys[0].arrival) {
      newErrors.arrival = 'يرجى اختيار مطار الوصول';
    }

    if (searchParams.journeys[0].departure === searchParams.journeys[0].arrival) {
      newErrors.general = 'يجب أن يكون مطار المغادرة مختلف عن مطار الوصول';
    }

    if (!searchParams.journeys[0].departureDate) {
      newErrors.departureDate = 'يرجى اختيار تاريخ المغادرة';
    }

    const today = new Date().toISOString().split('T')[0];
    if (searchParams.journeys[0].departureDate < today) {
      newErrors.departureDate = 'لا يمكن اختيار تاريخ في الماضي';
    }

    if (searchParams.tripType === 'roundTrip' && searchParams.journeys.length < 2) {
      newErrors.returnDate = 'يرجى اختيار تاريخ العودة';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = () => {
    if (!validateSearch()) {
      return;
    }

    onSearch(searchParams);
  };

  const updateSearchParam = (key, value) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      setSearchParams(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (key === 'departure' || key === 'arrival' || key === 'departureDate') {
      setSearchParams(prev => ({
        ...prev,
        journeys: [{
          ...prev.journeys[0],
          [key]: value
        }]
      }));
    } else {
      setSearchParams(prev => ({
        ...prev,
        [key]: value
      }));
    }

    // Clear related errors
    if (errors[key]) {
      setErrors(prev => ({
        ...prev,
        [key]: undefined
      }));
    }
  };

  const swapAirports = () => {
    setSearchParams(prev => ({
      ...prev,
      journeys: [{
        ...prev.journeys[0],
        departure: prev.journeys[0].arrival,
        arrival: prev.journeys[0].departure
      }]
    }));
  };

  const addReturnDate = () => {
    if (searchParams.journeys.length === 1) {
      const returnDate = new Date(searchParams.journeys[0].departureDate);
      returnDate.setDate(returnDate.getDate() + 7);
      
      setSearchParams(prev => ({
        ...prev,
        tripType: 'roundTrip',
        journeys: [
          ...prev.journeys,
          {
            departure: prev.journeys[0].arrival,
            arrival: prev.journeys[0].departure,
            departureDate: returnDate.toISOString().split('T')[0]
          }
        ]
      }));
    }
  };

  const removeReturnDate = () => {
    setSearchParams(prev => ({
      ...prev,
      tripType: 'oneWay',
      journeys: [prev.journeys[0]]
    }));
  };

  return (
    <div className="search-engine-container">
      <style jsx>{`
        .search-engine-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 0;
          position: relative;
          overflow: hidden;
        }
        
        .search-engine-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('/img/misc/pattern.png') repeat;
          opacity: 0.1;
        }
        
        .search-box {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.1);
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .trip-type-tabs {
          display: flex;
          margin-bottom: 30px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .trip-tab {
          padding: 12px 24px;
          border: none;
          background: none;
          color: #6b7280;
          font-weight: 500;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.3s ease;
        }
        
        .trip-tab.active {
          color: #667eea;
          border-bottom-color: #667eea;
        }
        
        .search-fields {
          display: grid;
          grid-template-columns: 2fr 2fr 1.5fr 1.5fr 1fr;
          gap: 20px;
          align-items: end;
          margin-bottom: 20px;
        }
        
        .field-group {
          position: relative;
        }
        
        .field-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }
        
        .field-input {
          width: 100%;
          height: 60px;
          padding: 0 20px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: white;
        }
        
        .field-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .field-input.error {
          border-color: #ef4444;
        }
        
        .swap-button {
          position: absolute;
          top: 50%;
          right: -15px;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid #e5e7eb;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 3;
        }
        
        .swap-button:hover {
          border-color: #667eea;
          background: #667eea;
          color: white;
        }
        
        .passengers-selector {
          display: flex;
          align-items: center;
          gap: 10px;
          height: 60px;
          padding: 0 20px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: white;
          cursor: pointer;
        }
        
        .search-button {
          height: 60px;
          padding: 0 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        
        .search-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }
        
        .search-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .error-message {
          color: #ef4444;
          font-size: 12px;
          margin-top: 5px;
        }
        
        .return-date-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 20px;
        }
        
        .checkbox {
          width: 18px;
          height: 18px;
          accent-color: #667eea;
        }
        
        @media (max-width: 768px) {
          .search-fields {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          
          .search-box {
            padding: 20px;
            margin: 0 15px;
          }
          
          .swap-button {
            display: none;
          }
        }
      `}</style>

      <div className="container">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-white mb-2">
            ابحث عن رحلتك المثالية
          </h1>
          <p className="text-xl text-white opacity-90">
            أكثر من 600 شركة طيران حول العالم
          </p>
        </div>

        <div className="search-box">
          {/* Trip Type Tabs */}
          <div className="trip-type-tabs">
            <button
              className={`trip-tab ${searchParams.tripType === 'oneWay' ? 'active' : ''}`}
              onClick={() => updateSearchParam('tripType', 'oneWay')}
            >
              <i className="icon-arrow-right me-2"></i>
              ذهاب فقط
            </button>
            <button
              className={`trip-tab ${searchParams.tripType === 'roundTrip' ? 'active' : ''}`}
              onClick={() => updateSearchParam('tripType', 'roundTrip')}
            >
              <i className="icon-arrow-left-right me-2"></i>
              ذهاب وإياب
            </button>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="alert alert-danger mb-3">
              {errors.general}
            </div>
          )}

          {/* Search Fields */}
          <div className="search-fields">
            {/* From */}
            <div className="field-group">
              <label className="field-label">من</label>
              <select
                className={`field-input ${errors.departure ? 'error' : ''}`}
                value={searchParams.journeys[0].departure}
                onChange={(e) => updateSearchParam('departure', e.target.value)}
              >
                <option value="">اختر مطار المغادرة</option>
                {airports.map(airport => (
                  <option key={airport.code} value={airport.code}>
                    {airport.code} - {airport.city}
                  </option>
                ))}
              </select>
              {errors.departure && (
                <div className="error-message">{errors.departure}</div>
              )}
            </div>

            {/* To */}
            <div className="field-group" style={{ position: 'relative' }}>
              <label className="field-label">إلى</label>
              <select
                className={`field-input ${errors.arrival ? 'error' : ''}`}
                value={searchParams.journeys[0].arrival}
                onChange={(e) => updateSearchParam('arrival', e.target.value)}
              >
                <option value="">اختر مطار الوصول</option>
                {airports.map(airport => (
                  <option key={airport.code} value={airport.code}>
                    {airport.code} - {airport.city}
                  </option>
                ))}
              </select>
              {errors.arrival && (
                <div className="error-message">{errors.arrival}</div>
              )}
              
              {/* Swap Button */}
              <button
                type="button"
                className="swap-button"
                onClick={swapAirports}
                title="تبديل المطارات"
              >
                <i className="icon-arrow-left-right"></i>
              </button>
            </div>

            {/* Departure Date */}
            <div className="field-group">
              <label className="field-label">تاريخ المغادرة</label>
              <input
                type="date"
                className={`field-input ${errors.departureDate ? 'error' : ''}`}
                value={searchParams.journeys[0].departureDate}
                onChange={(e) => updateSearchParam('departureDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.departureDate && (
                <div className="error-message">{errors.departureDate}</div>
              )}
            </div>

            {/* Return Date (if round trip) */}
            {searchParams.tripType === 'roundTrip' && (
              <div className="field-group">
                <label className="field-label">تاريخ العودة</label>
                <input
                  type="date"
                  className={`field-input ${errors.returnDate ? 'error' : ''}`}
                  value={searchParams.journeys[1]?.departureDate || ''}
                  onChange={(e) => {
                    const newJourneys = [...searchParams.journeys];
                    if (newJourneys.length < 2) {
                      newJourneys.push({
                        departure: searchParams.journeys[0].arrival,
                        arrival: searchParams.journeys[0].departure,
                        departureDate: e.target.value
                      });
                    } else {
                      newJourneys[1].departureDate = e.target.value;
                    }
                    setSearchParams(prev => ({ ...prev, journeys: newJourneys }));
                  }}
                  min={searchParams.journeys[0].departureDate}
                />
                {errors.returnDate && (
                  <div className="error-message">{errors.returnDate}</div>
                )}
              </div>
            )}

            {/* Passengers */}
            <div className="field-group">
              <label className="field-label">المسافرون</label>
              <div className="passengers-selector">
                <i className="icon-user me-2"></i>
                <span>
                  {searchParams.passengers.adults} بالغ
                  {searchParams.passengers.children > 0 && `, ${searchParams.passengers.children} طفل`}
                  {searchParams.passengers.infants > 0 && `, ${searchParams.passengers.infants} رضيع`}
                </span>
              </div>
            </div>

            {/* Search Button */}
            <button
              className="search-button"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2"></div>
                  جاري البحث...
                </>
              ) : (
                <>
                  <i className="icon-search me-2"></i>
                  ابحث
                </>
              )}
            </button>
          </div>

          {/* Trip Type Toggle for Mobile */}
          {searchParams.tripType === 'oneWay' && (
            <div className="return-date-toggle">
              <input
                type="checkbox"
                className="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    addReturnDate();
                  }
                }}
              />
              <label>إضافة تاريخ العودة</label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightSearchEngine; 