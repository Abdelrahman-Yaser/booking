'use client'

import { useState } from "react";

const LocationSearch = ({ title, value, onChange, placeholder }) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Comprehensive Real Airports Database
  const airports = [
    // Turkey - Major Airports
    { id: 'IST', name: 'Istanbul', code: 'IST', city: 'Istanbul', country: 'Turkey', fullName: 'Istanbul Airport', region: 'Turkey' },
    { id: 'SAW', name: 'Istanbul Sabiha', code: 'SAW', city: 'Istanbul', country: 'Turkey', fullName: 'Sabiha Gökçen Airport', region: 'Turkey' },
    { id: 'AYT', name: 'Antalya', code: 'AYT', city: 'Antalya', country: 'Turkey', fullName: 'Antalya Airport', region: 'Turkey' },
    { id: 'ESB', name: 'Ankara', code: 'ESB', city: 'Ankara', country: 'Turkey', fullName: 'Ankara Esenboğa Airport', region: 'Turkey' },
    { id: 'ADB', name: 'Izmir', code: 'ADB', city: 'Izmir', country: 'Turkey', fullName: 'Izmir Adnan Menderes Airport', region: 'Turkey' },
    { id: 'TZX', name: 'Trabzon', code: 'TZX', city: 'Trabzon', country: 'Turkey', fullName: 'Trabzon Airport', region: 'Turkey' },
    { id: 'BJV', name: 'Bodrum', code: 'BJV', city: 'Bodrum', country: 'Turkey', fullName: 'Bodrum-Milas Airport', region: 'Turkey' },
    { id: 'DLM', name: 'Dalaman', code: 'DLM', city: 'Dalaman', country: 'Turkey', fullName: 'Dalaman Airport', region: 'Turkey' },
    { id: 'GZT', name: 'Gaziantep', code: 'GZT', city: 'Gaziantep', country: 'Turkey', fullName: 'Gaziantep Airport', region: 'Turkey' },
    { id: 'KYA', name: 'Konya', code: 'KYA', city: 'Konya', country: 'Turkey', fullName: 'Konya Airport', region: 'Turkey' },
    
    // Middle East - Major Hubs
    { id: 'DXB', name: 'Dubai', code: 'DXB', city: 'Dubai', country: 'UAE', fullName: 'Dubai International Airport', region: 'Middle East' },
    { id: 'DWC', name: 'Dubai Al Maktoum', code: 'DWC', city: 'Dubai', country: 'UAE', fullName: 'Al Maktoum International Airport', region: 'Middle East' },
    { id: 'DOH', name: 'Doha', code: 'DOH', city: 'Doha', country: 'Qatar', fullName: 'Hamad International Airport', region: 'Middle East' },
    { id: 'JED', name: 'Jeddah', code: 'JED', city: 'Jeddah', country: 'Saudi Arabia', fullName: 'King Abdulaziz International Airport', region: 'Middle East' },
    { id: 'RUH', name: 'Riyadh', code: 'RUH', city: 'Riyadh', country: 'Saudi Arabia', fullName: 'King Khalid International Airport', region: 'Middle East' },
    { id: 'CAI', name: 'Cairo', code: 'CAI', city: 'Cairo', country: 'Egypt', fullName: 'Cairo International Airport', region: 'Middle East' },
    { id: 'KWI', name: 'Kuwait', code: 'KWI', city: 'Kuwait City', country: 'Kuwait', fullName: 'Kuwait International Airport', region: 'Middle East' },
    { id: 'BAH', name: 'Bahrain', code: 'BAH', city: 'Manama', country: 'Bahrain', fullName: 'Bahrain International Airport', region: 'Middle East' },
    { id: 'MCT', name: 'Muscat', code: 'MCT', city: 'Muscat', country: 'Oman', fullName: 'Muscat International Airport', region: 'Middle East' },
    { id: 'AMM', name: 'Amman', code: 'AMM', city: 'Amman', country: 'Jordan', fullName: 'Queen Alia International Airport', region: 'Middle East' },
    { id: 'BEY', name: 'Beirut', code: 'BEY', city: 'Beirut', country: 'Lebanon', fullName: 'Beirut-Rafic Hariri International Airport', region: 'Middle East' },
    
    // Europe - Major Cities
    { id: 'LHR', name: 'London Heathrow', code: 'LHR', city: 'London', country: 'United Kingdom', fullName: 'London Heathrow Airport', region: 'Europe' },
    { id: 'LGW', name: 'London Gatwick', code: 'LGW', city: 'London', country: 'United Kingdom', fullName: 'London Gatwick Airport', region: 'Europe' },
    { id: 'CDG', name: 'Paris', code: 'CDG', city: 'Paris', country: 'France', fullName: 'Charles de Gaulle Airport', region: 'Europe' },
    { id: 'ORY', name: 'Paris Orly', code: 'ORY', city: 'Paris', country: 'France', fullName: 'Paris Orly Airport', region: 'Europe' },
    { id: 'FRA', name: 'Frankfurt', code: 'FRA', city: 'Frankfurt', country: 'Germany', fullName: 'Frankfurt Airport', region: 'Europe' },
    { id: 'MUC', name: 'Munich', code: 'MUC', city: 'Munich', country: 'Germany', fullName: 'Munich Airport', region: 'Europe' },
    { id: 'AMS', name: 'Amsterdam', code: 'AMS', city: 'Amsterdam', country: 'Netherlands', fullName: 'Amsterdam Schiphol Airport', region: 'Europe' },
    { id: 'FCO', name: 'Rome', code: 'FCO', city: 'Rome', country: 'Italy', fullName: 'Leonardo da Vinci–Fiumicino Airport', region: 'Europe' },
    { id: 'MAD', name: 'Madrid', code: 'MAD', city: 'Madrid', country: 'Spain', fullName: 'Adolfo Suárez Madrid–Barajas Airport', region: 'Europe' },
    { id: 'BCN', name: 'Barcelona', code: 'BCN', city: 'Barcelona', country: 'Spain', fullName: 'Barcelona–El Prat Airport', region: 'Europe' },
    { id: 'ZUR', name: 'Zurich', code: 'ZUR', city: 'Zurich', country: 'Switzerland', fullName: 'Zurich Airport', region: 'Europe' },
    { id: 'VIE', name: 'Vienna', code: 'VIE', city: 'Vienna', country: 'Austria', fullName: 'Vienna International Airport', region: 'Europe' },
    
    // North America
    { id: 'JFK', name: 'New York JFK', code: 'JFK', city: 'New York', country: 'United States', fullName: 'John F. Kennedy International Airport', region: 'North America' },
    { id: 'LAX', name: 'Los Angeles', code: 'LAX', city: 'Los Angeles', country: 'United States', fullName: 'Los Angeles International Airport', region: 'North America' },
    { id: 'ORD', name: 'Chicago', code: 'ORD', city: 'Chicago', country: 'United States', fullName: 'O\'Hare International Airport', region: 'North America' },
    { id: 'MIA', name: 'Miami', code: 'MIA', city: 'Miami', country: 'United States', fullName: 'Miami International Airport', region: 'North America' },
    { id: 'YYZ', name: 'Toronto', code: 'YYZ', city: 'Toronto', country: 'Canada', fullName: 'Toronto Pearson International Airport', region: 'North America' },
    { id: 'YVR', name: 'Vancouver', code: 'YVR', city: 'Vancouver', country: 'Canada', fullName: 'Vancouver International Airport', region: 'North America' },
    
    // Asia Pacific
    { id: 'NRT', name: 'Tokyo Narita', code: 'NRT', city: 'Tokyo', country: 'Japan', fullName: 'Narita International Airport', region: 'Asia' },
    { id: 'ICN', name: 'Seoul', code: 'ICN', city: 'Seoul', country: 'South Korea', fullName: 'Incheon International Airport', region: 'Asia' },
    { id: 'SIN', name: 'Singapore', code: 'SIN', city: 'Singapore', country: 'Singapore', fullName: 'Singapore Changi Airport', region: 'Asia' },
    { id: 'HKG', name: 'Hong Kong', code: 'HKG', city: 'Hong Kong', country: 'Hong Kong', fullName: 'Hong Kong International Airport', region: 'Asia' },
    { id: 'BKK', name: 'Bangkok', code: 'BKK', city: 'Bangkok', country: 'Thailand', fullName: 'Suvarnabhumi Airport', region: 'Asia' },
    { id: 'KUL', name: 'Kuala Lumpur', code: 'KUL', city: 'Kuala Lumpur', country: 'Malaysia', fullName: 'Kuala Lumpur International Airport', region: 'Asia' },
    { id: 'DEL', name: 'New Delhi', code: 'DEL', city: 'New Delhi', country: 'India', fullName: 'Indira Gandhi International Airport', region: 'Asia' },
    { id: 'BOM', name: 'Mumbai', code: 'BOM', city: 'Mumbai', country: 'India', fullName: 'Chhatrapati Shivaji Maharaj International Airport', region: 'Asia' },
    
    // Africa
    { id: 'JNB', name: 'Johannesburg', code: 'JNB', city: 'Johannesburg', country: 'South Africa', fullName: 'O.R. Tambo International Airport', region: 'Africa' },
    { id: 'CPT', name: 'Cape Town', code: 'CPT', city: 'Cape Town', country: 'South Africa', fullName: 'Cape Town International Airport', region: 'Africa' },
    { id: 'ADD', name: 'Addis Ababa', code: 'ADD', city: 'Addis Ababa', country: 'Ethiopia', fullName: 'Addis Ababa Bole International Airport', region: 'Africa' },
    { id: 'LOS', name: 'Lagos', code: 'LOS', city: 'Lagos', country: 'Nigeria', fullName: 'Murtala Muhammed International Airport', region: 'Africa' },
    
    // Oceania
    { id: 'SYD', name: 'Sydney', code: 'SYD', city: 'Sydney', country: 'Australia', fullName: 'Kingsford Smith Airport', region: 'Oceania' },
    { id: 'MEL', name: 'Melbourne', code: 'MEL', city: 'Melbourne', country: 'Australia', fullName: 'Melbourne Airport', region: 'Oceania' },
    { id: 'AKL', name: 'Auckland', code: 'AKL', city: 'Auckland', country: 'New Zealand', fullName: 'Auckland Airport', region: 'Oceania' }
  ];

  // Filter airports based on search with enhanced matching
  const filteredAirports = airports.filter(airport => 
    airport.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    airport.code.toLowerCase().includes(searchValue.toLowerCase()) ||
    airport.city.toLowerCase().includes(searchValue.toLowerCase()) ||
    airport.country.toLowerCase().includes(searchValue.toLowerCase()) ||
    airport.fullName.toLowerCase().includes(searchValue.toLowerCase()) ||
    airport.region.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Group airports by region for better organization
  const groupedAirports = filteredAirports.reduce((groups, airport) => {
    const region = airport.region;
    if (!groups[region]) {
      groups[region] = [];
    }
    groups[region].push(airport);
    return groups;
  }, {});

  // Get current selected airport
  const currentAirport = airports.find(airport => airport.code === value);

  // Popular destinations (most searched)
  const popularDestinations = [
    airports.find(a => a.code === 'IST'),
    airports.find(a => a.code === 'DXB'),
    airports.find(a => a.code === 'DOH'),
    airports.find(a => a.code === 'LHR'),
    airports.find(a => a.code === 'CDG'),
    airports.find(a => a.code === 'FRA'),
    airports.find(a => a.code === 'AMS'),
    airports.find(a => a.code === 'JFK')
  ].filter(Boolean);

  const handleOptionClick = (airport) => {
    setSelectedItem(airport);
    setSearchValue(airport.name);
    setIsOpen(false);
    if (onChange) {
      onChange(airport.code);
    }
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    // Delay closing to allow click on options
    setTimeout(() => {
      setIsOpen(false);
      // Reset to current selection if no valid selection made
      if (currentAirport && !searchValue) {
        setSearchValue(currentAirport.name);
      }
    }, 200);
  };

  return (
    <div className="searchMenu-loc px-30 lg:py-20 lg:px-0 js-form-dd js-liverSearch">
      <div
        data-bs-toggle="dropdown"
        data-bs-auto-close="true"
        data-bs-offset="0,22"
      >
        <h4 className="text-15 fw-500 ls-2 lh-16">{title || 'الوجهة'}</h4>
        <div className="text-15 text-light-1 ls-2 lh-16">
          <input
            autoComplete="off"
            type="search"
            placeholder={placeholder || 'ابحث عن المطار أو المدينة'}
            className="js-search js-dd-focus"
            value={searchValue || (currentAirport ? currentAirport.name : '')}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </div>
        {currentAirport && !isOpen && (
          <div className="text-12 text-blue-1 mt-2 fw-500">
            {currentAirport.code} • {currentAirport.city}, {currentAirport.country}
          </div>
        )}
      </div>

      {/* Enhanced Dropdown Menu */}
      {isOpen && (
        <div className="shadow-2 dropdown-menu min-width-400" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <div className="bg-white px-20 py-20 sm:px-0 sm:py-15 rounded-4">
            
            {/* Search Results */}
            {searchValue && filteredAirports.length > 0 && (
              <div className="mb-20">
                <div className="text-12 fw-500 text-light-1 mb-10 px-20">
                  <i className="icon-search text-blue-1 mr-5"></i>
                  نتائج البحث ({filteredAirports.length})
                </div>
                <ul className="y-gap-5 js-results">
                  {Object.entries(groupedAirports).map(([region, regionAirports]) => (
                    <div key={region}>
                      {Object.keys(groupedAirports).length > 1 && (
                        <div className="text-11 fw-600 text-blue-1 mb-5 px-20 mt-10 border-bottom-light pb-5">
                          {region === 'Turkey' ? 'تركيا' : 
                           region === 'Middle East' ? 'الشرق الأوسط' :
                           region === 'Europe' ? 'أوروبا' :
                           region === 'Asia' ? 'آسيا' : 
                           region === 'North America' ? 'أمريكا الشمالية' :
                           region === 'Africa' ? 'أفريقيا' : 'أوقيانوسيا'}
                        </div>
                      )}
                      {regionAirports.slice(0, 6).map((airport) => (
                        <li
                          className={`-link d-block col-12 text-left rounded-4 px-20 py-15 js-search-option mb-1 hover-bg-blue-1-05 ${
                            selectedItem && selectedItem.id === airport.id ? "bg-blue-1-05" : ""
                          }`}
                          key={airport.id}
                          role="button"
                          onClick={() => handleOptionClick(airport)}
                        >
                          <div className="d-flex">
                            <div className="icon-location-2 text-light-1 text-20 pt-4" />
                            <div className="ml-10">
                              <div className="text-15 lh-12 fw-500 js-search-option-target">
                                {airport.name} ({airport.code})
                              </div>
                              <div className="text-14 lh-12 text-light-1 mt-5">
                                {airport.fullName}
                              </div>
                              <div className="text-12 lh-12 text-blue-1 mt-2">
                                {airport.city}, {airport.country}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </div>
                  ))}
                </ul>
              </div>
            )}

            {/* No Results */}
            {searchValue && filteredAirports.length === 0 && (
              <div className="px-20 py-30 text-center text-light-1">
                <i className="icon-search text-30 mb-15 text-light-2"></i>
                <div className="text-16 fw-500 mb-5">لا توجد نتائج مطابقة</div>
                <div className="text-14">لـ "{searchValue}"</div>
                <div className="text-12 mt-10 text-light-2">جرب البحث باسم المدينة أو رمز المطار</div>
              </div>
            )}
            
            {/* Popular Destinations */}
            {!searchValue && (
              <div>
                <div className="text-12 fw-500 text-light-1 mb-15 px-20">
                  <i className="icon-star text-yellow-1 mr-5"></i>
                  الوجهات الشائعة
                </div>
                <ul className="y-gap-5">
                  {popularDestinations.map((airport) => (
                    <li
                      className="d-block col-12 text-left rounded-4 px-20 py-12 js-search-option hover-bg-blue-1-05"
                      key={`popular_${airport.id}`}
                      role="button"
                      onClick={() => handleOptionClick(airport)}
                    >
                      <div className="d-flex items-center">
                        <div className="icon-location-2 text-blue-1 text-16 mr-10" />
                        <div>
                          <span className="text-14 fw-500">{airport.name}</span>
                          <span className="text-12 text-light-1 ml-5">({airport.code})</span>
                          <div className="text-11 text-light-1">{airport.city}, {airport.country}</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                
                {/* Quick Regions */}
                <div className="border-top-light pt-15 mt-15">
                  <div className="text-12 fw-500 text-light-1 mb-10 px-20">تصفح حسب المنطقة</div>
                  <div className="d-flex flex-wrap px-20">
                    {[
                      { key: 'turkey', label: 'تركيا' },
                      { key: 'middle east', label: 'الشرق الأوسط' },
                      { key: 'europe', label: 'أوروبا' },
                      { key: 'asia', label: 'آسيا' },
                      { key: 'north america', label: 'أمريكا الشمالية' }
                    ].map(region => (
                      <button
                        key={region.key}
                        className="button -blue-1 bg-blue-1-05 text-blue-1 py-5 px-15 rounded-4 mr-10 mb-10 text-12 hover-bg-blue-1 hover-text-white"
                        onClick={() => setSearchValue(region.key)}
                      >
                        {region.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
