'use client'

import { useSelector, useDispatch } from "react-redux";
import { addCurrentTab } from "../../features/hero/findPlaceSlice";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const UnifiedSearchBox = () => {
  const { tabs, currentTab } = useSelector((state) => state.hero) || { tabs: [], currentTab: 'Flights' };
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [activeService, setActiveService] = useState(currentTab || 'Flights');

  const pathToService = {
    '/home_2': 'Flights',
    '/home_3': 'Hotel',
    '/home_4': 'Tour',
    '/home_5': 'Tour',
    '/home_6': 'Cruise',
    '/home_7': 'Activity',
    '/home_8': 'Car',
    '/home_9': 'Holyday Rentals',
    '/home_10': 'Hotel'
  };

  useEffect(() => {
    const service = pathToService[pathname] || 'Flights';
    setActiveService(service);
    dispatch(addCurrentTab(service));
  }, [pathname, dispatch]);

  const handleTabChange = (tabName) => {
    dispatch(addCurrentTab(tabName));
    setActiveService(tabName);
    
    const serviceToPath = {
      'Flights': '/home_2',
      'Hotel': '/home_3',
      'Tour': '/home_5',
      'Activity': '/home_7',
      'Holyday Rentals': '/home_9',
      'Car': '/home_8',
      'Cruise': '/home_6'
    };
    
    const targetPath = serviceToPath[tabName] || '/home_2';
    if (pathname !== targetPath) {
      router.push(targetPath);
    }
  };

  const defaultTabs = [
    { id: 1, name: 'Flights', icon: 'icon-plane' },
    { id: 2, name: 'Hotel', icon: 'icon-hotel' },
    { id: 3, name: 'Car', icon: 'icon-car' },
    { id: 4, name: 'Cruise', icon: 'icon-cruise' },
    { id: 5, name: 'Tour', icon: 'icon-tour' },
  ];

  return (
    <div className="unified-search-full-width">
      <div className="professional-search-inner">
        {/* Service Tabs */}
        <div className="trip-tabs-wide">
          {(tabs.length > 0 ? tabs : defaultTabs).map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn-wide ${tab.name === activeService ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.name)}
            >
              <i className={tab.icon} style={{ marginRight: '8px', fontSize: '16px' }} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Service-Specific Content */}
        {activeService === 'Flights' && (
          <div>
            <div className="trip-type-options">
              <label>
                <input type="radio" name="tripType" defaultChecked style={{ marginRight: '8px', accentColor: '#6366f1' }} /> Oneway
              </label>
              <label>
                <input type="radio" name="tripType" style={{ marginRight: '8px', accentColor: '#6366f1' }} /> Round Trip
              </label>
              <label>
                <input type="radio" name="tripType" style={{ marginRight: '8px', accentColor: '#6366f1' }} /> Multi Trip
              </label>
            </div>
            <div className="search-row-wide">
              <div className="search-field-wide location-input-wide">
                <div className="field-label-wide">From</div>
                <div>Search Origin (e.g., Cairo)</div>
              </div>
              <div className="swap-btn-container-wide">
                <button className="swap-btn-wide">
                  <i className="icon-swap" />
                </button>
              </div>
              <div className="search-field-wide location-input-wide">
                <div className="field-label-wide">To</div>
                <div>Search Destination (e.g., Cairo)</div>
              </div>
              <div className="search-field-wide date-input-wide">
                <div className="field-label-wide">Departure</div>
                <div>15-06-2025, Sunday</div>
              </div>
              <div className="search-field-wide date-input-wide">
                <div className="field-label-wide">Travellers</div>
                <div>1 Person, 1 Adult, Economy</div>
              </div>
              <div className="search-btn-container-wide">
                <button className="search-btn-wide" onClick={() => router.push('/flight-list-v1')}>
                  <i className="icon-search" /> Search
                </button>
              </div>
            </div>
            <div className="quick-filters-row">
              <label className="filter-checkbox-wide">
                <input type="checkbox" />
                <span className="checkmark-wide"></span>
                <span className="filter-text-wide">Show Pricing Calendar</span>
              </label>
              <label className="filter-checkbox-wide">
                <input type="checkbox" />
                <span className="checkmark-wide"></span>
                <span className="filter-text-wide">Direct Flights Only</span>
              </label>
              <label className="filter-checkbox-wide">
                <input type="checkbox" />
                <span className="checkmark-wide"></span>
                <span className="filter-text-wide">Include Checked Baggage</span>
              </label>
            </div>
          </div>
        )}

        {activeService === 'Hotel' && (
          <div>
            <div className="search-row-wide">
              <div className="search-field-wide location-input-wide">
                <div className="field-label-wide">City, Property name or Location</div>
                <div>New York, United States of Am</div>
              </div>
              <div className="search-field-wide date-input-wide">
                <div className="field-label-wide">Check In</div>
                <div>Mar 15, 2025, Saturday</div>
              </div>
              <div className="search-field-wide date-input-wide">
                <div className="field-label-wide">Check Out</div>
                <div>Mar 16, 2025, Sunday</div>
              </div>
              <div className="search-field-wide date-input-wide">
                <div className="field-label-wide">Guests</div>
                <div>2 Guests, 1 Room for 2 Adults</div>
              </div>
              <div className="search-btn-container-wide">
                <button className="search-btn-wide" onClick={() => router.push('/hotel-list-v1')}>
                  <i className="icon-search" /> Search
                </button>
              </div>
            </div>
            <div className="quick-filters-row">
              <label className="filter-checkbox-wide">
                <input type="checkbox" />
                <span className="checkmark-wide"></span>
                <span className="filter-text-wide">Free Cancellation</span>
              </label>
              <div>
                <div className="field-label-wide">Star Rating</div>
                <select className="location-input-wide" style={{ height: '80px', padding: '16px 20px' }}>
                  <option>No</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </select>
              </div>
              <div>
                <div className="field-label-wide">Meal Plan</div>
                <select className="location-input-wide" style={{ height: '80px', padding: '16px 20px' }}>
                  <option>RO</option>
                  <option>BB</option>
                  <option>HB</option>
                  <option>FB</option>
                  <option>AI</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeService === 'Car' && (
          <div>
            <div className="search-row-wide">
              <div className="search-field-wide location-input-wide">
                <div className="field-label-wide">From</div>
                <div>New York, USA</div>
              </div>
              <div className="search-field-wide date-input-wide">
                <div className="field-label-wide">Pick-up Date</div>
                <div>15-06-2025, Monday</div>
              </div>
              <div className="search-field-wide date-input-wide">
                <div className="field-label-wide">Drop-off Date</div>
                <div>15-06-2025, Monday</div>
              </div>
              <div className="search-field-wide date-input-wide">
                <div className="field-label-wide">Pick-up Time</div>
                <div>10:30 AM</div>
              </div>
              <div className="search-btn-container-wide">
                <button className="search-btn-wide" onClick={() => router.push('/car-list-v1')}>
                  <i className="icon-search" /> Search
                </button>
              </div>
            </div>
            <div className="trip-type-options">
              <label>
                <input type="radio" name="carType" defaultChecked style={{ marginRight: '8px', accentColor: '#6366f1' }} /> Same drop-off
              </label>
              <label>
                <input type="radio" name="carType" style={{ marginRight: '8px', accentColor: '#6366f1' }} /> Different Drop off
              </label>
              <label>
                <input type="radio" name="carType" style={{ marginRight: '8px', accentColor: '#6366f1' }} /> Airport
              </label>
              <label>
                <input type="radio" name="carType" style={{ marginRight: '8px', accentColor: '#6366f1' }} /> Hourly Package
              </label>
            </div>
          </div>
        )}

        {activeService === 'Cruise' && (
          <div className="search-row-wide">
            <div className="search-field-wide location-input-wide">
              <div className="field-label-wide">Destination</div>
              <div>New York, USA</div>
            </div>
            <div className="search-field-wide date-input-wide">
              <div className="field-label-wide">Start Date</div>
              <div>15-06-2025, Monday</div>
            </div>
            <div className="search-field-wide date-input-wide">
              <div className="field-label-wide">End Date</div>
              <div>15-06-2025, Monday</div>
            </div>
            <div className="search-field-wide date-input-wide">
              <div className="field-label-wide">Travellers & Cabin</div>
              <div>4 Persons, 2 Adults, 2 Rooms</div>
            </div>
            <div className="search-btn-container-wide">
              <button className="search-btn-wide" onClick={() => router.push('/cruise-list-v1')}>
                <i className="icon-search" /> Search
              </button>
            </div>
          </div>
        )}

        {activeService === 'Tour' && (
          <div className="search-row-wide">
            <div className="search-field-wide location-input-wide">
              <div className="field-label-wide">Search holiday packages & trips</div>
              <div>New York, USA</div>
            </div>
            <div className="search-field-wide date-input-wide">
              <div className="field-label-wide">Dates</div>
              <div>15-06-2025, Monday</div>
            </div>
            <div className="search-field-wide date-input-wide">
              <div className="field-label-wide">Check Out</div>
              <div>15-06-2025, Wednesday</div>
            </div>
            <div className="search-field-wide date-input-wide">
              <div className="field-label-wide">Travellers</div>
              <div>4 Persons, 2 Adults</div>
            </div>
            <div className="search-btn-container-wide">
              <button className="search-btn-wide" onClick={() => router.push('/tour-list-v1')}>
                <i className="icon-search" /> Search
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedSearchBox;