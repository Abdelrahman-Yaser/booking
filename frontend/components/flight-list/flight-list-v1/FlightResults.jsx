"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const FlightResults = ({ results, loading, error, filters }) => {
  const [filteredResults, setFilteredResults] = useState([]);
  const [sortBy, setSortBy] = useState('price');
  const [selectedFlight, setSelectedFlight] = useState(null);

  // Airline logos mapping
  const airlineLogos = {
    'TK': '/img/airlines/tk.png',
    'EK': '/img/airlines/ek.png',
    'QR': '/img/airlines/qr.png',
    'SV': '/img/airlines/sv.png',
    'MS': '/img/airlines/ms.png',
    'RJ': '/img/airlines/rj.png',
    'ME': '/img/airlines/me.png',
    'FZ': '/img/airlines/fz.png'
  };

  // Filter and sort results
  useEffect(() => {
    if (!results?.solutions) {
      setFilteredResults([]);
      return;
    }

    let filtered = results.solutions.filter(flight => {
      // Price filter
      if (filters.priceRange.min && flight.totalPrice < filters.priceRange.min) return false;
      if (filters.priceRange.max && flight.totalPrice > filters.priceRange.max) return false;

      // Airlines filter
      if (filters.airlines.length > 0) {
        const flightAirlines = flight.journeys[0].segments.map(s => s.airline);
        if (!filters.airlines.some(airline => flightAirlines.includes(airline))) return false;
      }

      // Stops filter
      if (filters.stops !== 'any') {
        const stops = flight.journeys[0].segments.length - 1;
        if (filters.stops === 'direct' && stops > 0) return false;
        if (filters.stops === '1stop' && stops !== 1) return false;
        if (filters.stops === '2+stops' && stops < 2) return false;
      }

      return true;
    });

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.totalPrice - b.totalPrice;
        case 'duration':
          return getDuration(a) - getDuration(b);
        case 'departure':
          return new Date(`2024-01-01 ${a.journeys[0].segments[0].departureTime}`) - 
                 new Date(`2024-01-01 ${b.journeys[0].segments[0].departureTime}`);
        case 'arrival':
          const aLastSegment = a.journeys[0].segments[a.journeys[0].segments.length - 1];
          const bLastSegment = b.journeys[0].segments[b.journeys[0].segments.length - 1];
          return new Date(`2024-01-01 ${aLastSegment.arrivalTime}`) - 
                 new Date(`2024-01-01 ${bLastSegment.arrivalTime}`);
        default:
          return 0;
      }
    });

    setFilteredResults(filtered);
  }, [results, filters, sortBy]);

  const getDuration = (flight) => {
    const firstSegment = flight.journeys[0].segments[0];
    const lastSegment = flight.journeys[0].segments[flight.journeys[0].segments.length - 1];
    
    const departure = new Date(`${firstSegment.departureDate} ${firstSegment.departureTime}`);
    const arrival = new Date(`${lastSegment.arrivalDate} ${lastSegment.arrivalTime}`);
    
    return arrival - departure;
  };

  const formatDuration = (flight) => {
    const duration = getDuration(flight);
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}س ${minutes}د`;
  };

  const formatTime = (time) => {
    return time.substring(0, 5);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStopsText = (segments) => {
    const stops = segments.length - 1;
    if (stops === 0) return 'مباشر';
    if (stops === 1) return 'توقف واحد';
    return `${stops} توقفات`;
  };

  const handleBookFlight = async (flight) => {
    setSelectedFlight(flight);
    
    try {
      // Get precise pricing first
      const pricingResponse = await fetch('/api/pkfare-flights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'pricing',
          solutionId: flight.solutionId,
          bookingCode: flight.bookingCode,
          passengers: { adults: 1, children: 0, infants: 0 }
        })
      });

      const pricingData = await pricingResponse.json();
      
      if (pricingData.success) {
        // Redirect to booking page with flight data
        const bookingData = {
          flight: flight,
          pricing: pricingData.data
        };
        
        localStorage.setItem('selectedFlight', JSON.stringify(bookingData));
        window.location.href = '/booking/flight/' + flight.solutionId;
      } else {
        alert('فشل في الحصول على السعر الدقيق. يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('حدث خطأ. يرجى المحاولة مرة أخرى.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">جاري البحث...</span>
        </div>
        <h4>جاري البحث عن أفضل الرحلات...</h4>
        <p className="text-muted">يرجى الانتظار بينما نبحث في أكثر من 600 شركة طيران</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center py-4">
        <i className="icon-alert-circle text-24 mb-2"></i>
        <h5>حدث خطأ في البحث</h5>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="text-center py-5">
        <i className="icon-search text-60 text-muted mb-3"></i>
        <h4>ابدأ البحث عن رحلتك</h4>
        <p className="text-muted">استخدم نموذج البحث أعلاه للعثور على أفضل الرحلات</p>
      </div>
    );
  }

  return (
    <div className="flight-results">
      <style jsx>{`
        .results-header {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }
        
        .sort-options {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        .sort-btn {
          padding: 8px 16px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .sort-btn.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }
        
        .flight-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-bottom: 20px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .flight-card:hover {
          box-shadow: 0 5px 20px rgba(0,0,0,0.15);
          transform: translateY(-2px);
        }
        
        .flight-header {
          padding: 20px;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .flight-route {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 20px;
          margin-bottom: 15px;
        }
        
        .route-point {
          text-align: center;
        }
        
        .route-time {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
        }
        
        .route-airport {
          font-size: 14px;
          color: #6b7280;
          margin-top: 5px;
        }
        
        .route-line {
          display: flex;
          align-items: center;
          flex-direction: column;
          gap: 5px;
        }
        
        .duration {
          font-size: 12px;
          color: #6b7280;
        }
        
        .stops-info {
          font-size: 12px;
          color: #ef4444;
        }
        
        .flight-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .airline-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .airline-logo {
          width: 32px;
          height: 32px;
          border-radius: 4px;
        }
        
        .price-section {
          text-align: right;
        }
        
        .price {
          font-size: 28px;
          font-weight: 700;
          color: #059669;
        }
        
        .price-note {
          font-size: 12px;
          color: #6b7280;
        }
        
        .book-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .book-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }
        
        .segments-details {
          padding: 20px;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }
        
        .segment {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .segment:last-child {
          border-bottom: none;
        }
        
        @media (max-width: 768px) {
          .flight-route {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          
          .route-line {
            transform: rotate(90deg);
          }
          
          .flight-details {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
          }
        }
      `}</style>

      {/* Results Header */}
      <div className="results-header">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">
            {filteredResults.length} رحلة متاحة
            {results.searchParams && (
              <span className="text-muted ms-2">
                من {results.searchParams.from} إلى {results.searchParams.to}
              </span>
            )}
          </h4>
          <div className="sort-options">
            <button
              className={`sort-btn ${sortBy === 'price' ? 'active' : ''}`}
              onClick={() => setSortBy('price')}
            >
              السعر
            </button>
            <button
              className={`sort-btn ${sortBy === 'duration' ? 'active' : ''}`}
              onClick={() => setSortBy('duration')}
            >
              المدة
            </button>
            <button
              className={`sort-btn ${sortBy === 'departure' ? 'active' : ''}`}
              onClick={() => setSortBy('departure')}
            >
              وقت المغادرة
            </button>
            <button
              className={`sort-btn ${sortBy === 'arrival' ? 'active' : ''}`}
              onClick={() => setSortBy('arrival')}
            >
              وقت الوصول
            </button>
          </div>
        </div>
      </div>

      {/* Flight Cards */}
      {filteredResults.length === 0 ? (
        <div className="text-center py-5">
          <i className="icon-search text-60 text-muted mb-3"></i>
          <h4>لا توجد رحلات متاحة</h4>
          <p className="text-muted">جرب تعديل معايير البحث أو الفلاتر</p>
        </div>
      ) : (
        filteredResults.map((flight, index) => (
          <div key={index} className="flight-card">
            <div className="flight-header">
              {/* Flight Route */}
              <div className="flight-route">
                <div className="route-point">
                  <div className="route-time">
                    {formatTime(flight.journeys[0].segments[0].departureTime)}
                  </div>
                  <div className="route-airport">
                    {flight.journeys[0].segments[0].departure}
                  </div>
                </div>
                
                <div className="route-line">
                  <div className="duration">{formatDuration(flight)}</div>
                  <div style={{ width: '100px', height: '2px', background: '#e5e7eb', position: 'relative' }}>
                    <div style={{ 
                      position: 'absolute', 
                      right: '0', 
                      top: '-4px', 
                      width: '0', 
                      height: '0', 
                      borderLeft: '8px solid #e5e7eb',
                      borderTop: '5px solid transparent',
                      borderBottom: '5px solid transparent'
                    }}></div>
                  </div>
                  <div className="stops-info">
                    {getStopsText(flight.journeys[0].segments)}
                  </div>
                </div>
                
                <div className="route-point">
                  <div className="route-time">
                    {formatTime(flight.journeys[0].segments[flight.journeys[0].segments.length - 1].arrivalTime)}
                  </div>
                  <div className="route-airport">
                    {flight.journeys[0].segments[flight.journeys[0].segments.length - 1].arrival}
                  </div>
                </div>
              </div>

              {/* Flight Details */}
              <div className="flight-details">
                <div className="airline-info">
                  <Image
                    src={airlineLogos[flight.journeys[0].segments[0].airline] || '/img/airlines/default.png'}
                    alt={flight.journeys[0].segments[0].airline}
                    width={32}
                    height={32}
                    className="airline-logo"
                  />
                  <div>
                    <div className="fw-bold">
                      {flight.journeys[0].segments[0].airline} {flight.journeys[0].segments[0].flightNum}
                    </div>
                    <div className="text-muted small">
                      {flight.journeys[0].segments[0].cabinClass}
                    </div>
                  </div>
                </div>

                <div className="price-section">
                  <div className="price">{formatPrice(flight.totalPrice)}</div>
                  <div className="price-note">شامل الضرائب</div>
                  <button
                    className="book-btn mt-2"
                    onClick={() => handleBookFlight(flight)}
                    disabled={selectedFlight?.solutionId === flight.solutionId}
                  >
                    {selectedFlight?.solutionId === flight.solutionId ? 'جاري التحميل...' : 'احجز الآن'}
                  </button>
                </div>
              </div>
            </div>

            {/* Segments Details */}
            {flight.journeys[0].segments.length > 1 && (
              <div className="segments-details">
                <h6 className="mb-3">تفاصيل الرحلة</h6>
                {flight.journeys[0].segments.map((segment, segIndex) => (
                  <div key={segIndex} className="segment">
                    <div>
                      <strong>{segment.airline} {segment.flightNum}</strong>
                      <div className="text-muted small">
                        {segment.departure} → {segment.arrival}
                      </div>
                    </div>
                    <div className="text-end">
                      <div>{formatTime(segment.departureTime)} - {formatTime(segment.arrivalTime)}</div>
                      <div className="text-muted small">{segment.departureDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default FlightResults; 