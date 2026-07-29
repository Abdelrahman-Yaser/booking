"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Header3 from "@/components/header/header-3";
import Footer3 from "@/components/footer/footer-3";
import FlightSearchEngine from "@/components/flight-list/flight-list-v1/FlightSearchEngine";
import FlightResults from "@/components/flight-list/flight-list-v1/FlightResults";
import FlightFilters from "@/components/flight-list/common/FlightFilters";
import AirlineFilter from '@/components/flight-list/common/AirlineFilter';
import TimeFilter from '@/components/flight-list/common/TimeFilter';
import FlightCard from '@/components/flight-list/common/FlightCard';
import FlightCardSkeleton from '@/components/flight-list/common/FlightCardSkeleton';

export default function FlightListPage() {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    directOnly: false,
    baggageIncluded: false,
    cabinClass: 'ECONOMY',
    airlines: [],
    timeRange: [],
    priceRange: {
      min: 0,
      max: 10000
    }
  });
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    document.title = "البحث عن الرحلات - Flymefy";
    fetchFlights();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [flights, filters]);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pkfare-flights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'search',
          params: {
            journeys: [{
              origin: 'IST',
              destination: 'DXB',
              date: '2024-03-20'
            }],
            passengers: {
              adults: 1,
              children: 0,
              infants: 0
            },
            cabinClass: filters.cabinClass,
            tripType: 'oneWay'
          }
        })
      });
      const data = await response.json();
      setFlights(data.flights || []);
    } catch (error) {
      console.error('Failed to fetch flights:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...flights];

    // Direct flights filter
    if (filters.directOnly) {
      filtered = filtered.filter(flight => flight.segments.length === 1);
    }

    // Baggage filter
    if (filters.baggageIncluded) {
      filtered = filtered.filter(flight => flight.baggage && flight.baggage.included);
    }

    // Cabin class filter
    filtered = filtered.filter(flight => flight.segments[0].cabinClass === filters.cabinClass);

    // Airline filter
    if (filters.airlines.length > 0) {
      filtered = filtered.filter(flight => 
        filters.airlines.includes(flight.segments[0].airline)
      );
    }

    // Time range filter
    if (filters.timeRange.length > 0) {
      filtered = filtered.filter(flight => {
        const departureTime = new Date(flight.segments[0].departureDate).getHours() * 60 +
                            new Date(flight.segments[0].departureDate).getMinutes();
        return filters.timeRange.some(range => {
          const [startHour, startMin] = range.start.split(':').map(Number);
          const [endHour, endMin] = range.end.split(':').map(Number);
          const rangeStart = startHour * 60 + startMin;
          const rangeEnd = endHour * 60 + endMin;
          return departureTime >= rangeStart && departureTime <= rangeEnd;
        });
      });
    }

    // Price range filter
    filtered = filtered.filter(flight => {
      const totalPrice = flight.priceInfo.adtFare + flight.priceInfo.adtTax + flight.priceInfo.tktFee;
      return totalPrice >= filters.priceRange.min && totalPrice <= filters.priceRange.max;
    });

    setFilteredFlights(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const handleSort = (type) => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('asc');
    }

    const sorted = [...filteredFlights].sort((a, b) => {
      let comparison = 0;
      
      if (type === 'price') {
        const priceA = calculateTotalPrice(a.priceInfo);
        const priceB = calculateTotalPrice(b.priceInfo);
        comparison = priceA - priceB;
      } else if (type === 'duration') {
        const durationA = calculateTotalDuration(a.segments);
        const durationB = calculateTotalDuration(b.segments);
        comparison = durationA - durationB;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredFlights(sorted);
  };

  const calculateTotalPrice = (priceInfo) => {
    const {
      adtFare = 0,
      adtTax = 0,
      tktFee = 0,
      adults = 1,
      platformServiceFee = 0,
      merchantFee = 0
    } = priceInfo || {};

    return (adtFare + adtTax + tktFee) * adults + platformServiceFee + merchantFee;
  };

  const calculateTotalDuration = (segments) => {
    return segments.reduce((total, segment) => total + segment.flightTime, 0);
  };

  return (
    <>
      <Head>
        <link rel="stylesheet" href="/css/flight-search.css" />
      </Head>
      
      <Header3 />
      
      {/* Search Engine Section */}
      <section className="py-0">
        <FlightSearchEngine onSearch={fetchFlights} loading={loading} />
      </section>

      {/* Results Section */}
      {(filteredFlights.length > 0 || loading) && (
        <section className="layout-pt-md layout-pb-lg">
          <div className="container">
            <div className="row y-gap-30">
              {/* Filters Sidebar */}
              <div className="col-xl-3">
                <div className="sidebar -mobile-filter-hidden">
                  <FlightFilters
                    onFilterChange={handleFilterChange}
                    filters={filters}
                  />
                  <TimeFilter
                    timeRange={filters.timeRange}
                    onTimeChange={(timeRange) => handleFilterChange({ timeRange })}
                  />
                  <AirlineFilter
                    airlines={flights.reduce((acc, flight) => {
                      const airline = flight.segments[0].airline;
                      if (!acc.find(a => a.code === airline)) {
                        acc.push({
                          code: airline,
                          name: flight.segments[0].airlineName
                        });
                      }
                      return acc;
                    }, [])}
                    selectedAirlines={filters.airlines}
                    onAirlineChange={(code, isSelected) => {
                      const airlines = isSelected
                        ? [...filters.airlines, code]
                        : filters.airlines.filter(a => a !== code);
                      handleFilterChange({ airlines });
                    }}
                  />
                </div>
              </div>

              {/* Results */}
              <div className="col-xl-9">
                {loading ? (
                  <div className="loading-skeleton">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="mb-20">
                        <FlightCardSkeleton />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flight-list">
                    {filteredFlights.length === 0 ? (
                      <div className="no-results text-center py-50">
                        <div className="text-18 fw-500">No flights found</div>
                        <div className="text-15 text-light-1 mt-10">Try adjusting your filters</div>
                      </div>
                    ) : (
                      <>
                        <div className="results-header d-flex justify-between items-center mb-20">
                          <div className="text-18 fw-500">
                            {filteredFlights.length} flights found
                          </div>
                          <div className="sort-options d-flex gap-10">
                            <button 
                              className="button -dark-1 px-15 py-10 rounded-4"
                              onClick={() => handleSort('price')}
                            >
                              Sort by Price
                            </button>
                            <button 
                              className="button -dark-1 px-15 py-10 rounded-4"
                              onClick={() => handleSort('duration')}
                            >
                              Sort by Duration
                            </button>
                          </div>
                        </div>
                        <div className="results-list">
                          {filteredFlights.map((flight) => (
                            <div key={flight.id} className="mb-20">
                              <FlightCard flight={flight} />
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer3 />
    </>
  );
}
