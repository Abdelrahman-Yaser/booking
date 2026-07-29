'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const FlightProperties = () => {
  const [searchParams, setSearchParams] = useState({
    from: 'IST',
    to: 'DXB',
    departDate: '2024-01-15',
    returnDate: '',
    passengers: 1,
    cabinClass: 'economy'
  });

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showAncillaryServices, setShowAncillaryServices] = useState(false);
  const [ancillaryData, setAncillaryData] = useState({});

  // Flymefy Statistics
  const flymefyStats = {
    flights: 'آلاف',
    destinations: '100+',
    bookings: '2000+',
    features: ['بحث متقدم', 'أسعار حقيقية', 'حجز فوري']
  };

  // Major airports for search
  const majorAirports = {
    'IST': 'Istanbul Airport',
    'DXB': 'Dubai International',
    'DOH': 'Hamad International',
    'CAI': 'Cairo International',
    'JED': 'King Abdulaziz International',
    'RUH': 'King Khalid International',
    'KWI': 'Kuwait International',
    'BAH': 'Bahrain International',
    'AUH': 'Abu Dhabi International',
    'AMM': 'Queen Alia International',
    'BKK': 'Suvarnabhumi Airport',
    'SIN': 'Singapore Changi',
    'LHR': 'London Heathrow',
    'CDG': 'Charles de Gaulle',
    'FRA': 'Frankfurt Airport'
  };

  const searchFlights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams({
        from: searchParams.from,
        to: searchParams.to,
        departDate: searchParams.departDate,
        passengers: searchParams.passengers.toString(),
        cabinClass: searchParams.cabinClass,
        ...(searchParams.returnDate && { returnDate: searchParams.returnDate })
      });

      console.log('🔍 Searching flights...', searchParams);

      const response = await fetch(`/api/pkfare-flights?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setFlights(data.flights || []);
        console.log('✅ Flight search successful:', {
          totalResults: data.totalResults,
          provider: 'Flymefy'
        });
      } else {
        throw new Error(data.message || 'Search failed');
      }
    } catch (err) {
      console.error('❌ Flight search error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAncillaryServices = async (flightId) => {
    try {
      const [seatsRes, baggageRes, mealsRes] = await Promise.all([
        fetch('/api/pkfare-flights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'getSeats', flightId })
        }),
        fetch('/api/pkfare-flights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'getBaggage', flightId })
        }),
        fetch('/api/pkfare-flights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'getMeals', flightId })
        })
      ]);

      const [seats, baggage, meals] = await Promise.all([
        seatsRes.json(),
        baggageRes.json(),
        mealsRes.json()
      ]);

      setAncillaryData({ seats, baggage, meals });
      setShowAncillaryServices(true);
    } catch (err) {
      console.error('Error loading ancillary services:', err);
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return '';
    const match = duration.match(/PT(\d+)H(\d+)M/);
    if (match) {
      return `${match[1]}h ${match[2]}m`;
    }
    return duration;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  useEffect(() => {
    searchFlights();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Flymefy Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Flymefy Flight Search</h1>
            <p className="text-xl mb-4">محرك البحث المتقدم للرحلات الجوية</p>
            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="flex items-center">
                <span className="font-semibold">{flymefyStats.flights}</span>
                <span className="ml-1">رحلة</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold">{flymefyStats.destinations}</span>
                <span className="ml-1">وجهة</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold">{flymefyStats.bookings}</span>
                <span className="ml-1">حجز</span>
              </div>
            </div>
            <div className="mt-2 text-sm opacity-90">
              مدعوم بـ: {flymefyStats.features.join(' • ')}
            </div>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">من</label>
              <select
                value={searchParams.from}
                onChange={(e) => setSearchParams({...searchParams, from: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(majorAirports).map(([code, name]) => (
                  <option key={code} value={code}>{code} - {name}</option>
                ))}
              </select>
            </div>

            {/* To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">إلى</label>
              <select
                value={searchParams.to}
                onChange={(e) => setSearchParams({...searchParams, to: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(majorAirports).map(([code, name]) => (
                  <option key={code} value={code}>{code} - {name}</option>
                ))}
              </select>
            </div>

            {/* Departure Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ المغادرة</label>
              <input
                type="date"
                value={searchParams.departDate}
                onChange={(e) => setSearchParams({...searchParams, departDate: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Return Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الإيقاف (اختياري)</label>
              <input
                type="date"
                value={searchParams.returnDate}
                onChange={(e) => setSearchParams({...searchParams, returnDate: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Passengers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">عدد الركاب</label>
              <select
                value={searchParams.passengers}
                onChange={(e) => setSearchParams({...searchParams, passengers: parseInt(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {[1,2,3,4,5,6,7,8,9].map(num => (
                  <option key={num} value={num}>{num} راكب{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={searchFlights}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50"
              >
                {loading ? 'جاري البحث...' : 'بحث عن رحلات'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>خطأ:</strong> {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">جاري البحث على منصة Flymefy...</p>
          </div>
        )}

        {/* Flight Results */}
        {flights.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {flights.length} رحلات موجودة
              </h2>
              <div className="text-sm text-gray-600">
                مدعوم بـ Flymefy API
              </div>
            </div>

            {flights.map((flight, index) => (
              <div key={flight.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  {/* Flight Info */}
                  <div className="flex items-center space-x-6">
                    {/* Airline Logo */}
                    <div className="flex-shrink-0">
                      <img
                        src={flight.segments[0].airline.logo}
                        alt={flight.segments[0].airline.name}
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                          e.target.src = '/img/airlines/default.png';
                        }}
                      />
                      <div className="text-xs text-center mt-1 text-gray-600">
                        {flight.segments[0].airline.code}
                      </div>
                    </div>

                    {/* Flight Details */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold">
                            {new Date(flight.segments[0].departure.dateTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <div className="text-sm text-gray-600">{flight.segments[0].departure.airport}</div>
                        </div>

                        <div className="flex-1 text-center">
                          <div className="text-sm text-gray-600">{formatDuration(flight.totalDuration)}</div>
                          <div className="flex items-center justify-center my-2">
                            <div className="h-px bg-gray-300 flex-1"></div>
                            <div className="mx-2 text-xs text-gray-500">
                              {flight.stops === 0 ? 'مباشر' : `${flight.stops} متوقف${flight.stops > 1 ? 's' : ''}`}
                            </div>
                            <div className="h-px bg-gray-300 flex-1"></div>
                          </div>
                          <div className="text-xs text-gray-500">{flight.segments[0].flightNumber}</div>
                        </div>

                        <div className="text-center">
                          <div className="text-lg font-semibold">
                            {new Date(flight.segments[0].arrival.dateTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <div className="text-sm text-gray-600">{flight.segments[0].arrival.airport}</div>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="flex items-center space-x-2 mt-3">
                        {flight.amenities.map((amenity, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {amenity.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {formatPrice(flight.pricing.totalPrice)}
                    </div>
                    <div className="text-sm text-gray-600">للشخص</div>
                    
                    {/* Fare Rules */}
                    <div className="mt-2 text-xs text-gray-500">
                      {flight.fareRules.refundable ? '✅ مسترد' : '❌ غير مسترد'}
                      {flight.fareRules.changeable && ' • ✅ قابل للتغيير'}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 space-y-2">
                      <button
                        onClick={() => {
                          setSelectedFlight(flight);
                          loadAncillaryServices(flight.id);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
                      >
                        اختيار الرحلة
                      </button>
                      <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition duration-200">
                        عرض التفاصيل
                      </button>
                    </div>
                  </div>
                </div>

                {/* Baggage Info */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div>
                      <span className="font-medium">جوازات:</span> {flight.baggage.checked.weight} جواز متضمن
                    </div>
                    <div>
                      <span className="font-medium">المكيف:</span> {flight.baggage.cabin.weight} • {flight.baggage.cabin.dimensions}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ancillary Services Modal */}
        {showAncillaryServices && selectedFlight && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Customize Your Flight</h3>
                  <button
                    onClick={() => setShowAncillaryServices(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Selected Flight Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{selectedFlight.segments[0].airline.name}</h4>
                      <p className="text-sm text-gray-600">
                        {selectedFlight.segments[0].departure.airport} → {selectedFlight.segments[0].arrival.airport}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">{formatPrice(selectedFlight.pricing.totalPrice)}</div>
                      <div className="text-sm text-gray-600">سعر القاعة</div>
                    </div>
                  </div>
                </div>

                {/* Ancillary Services Tabs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Seat Selection */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3 flex items-center">
                      🪑 اختيار المقعد
                    </h4>
                    {ancillaryData.seats && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          {ancillaryData.seats.aircraft.type}
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>معتمد</span>
                            <span>مجاني</span>
                          </div>
                          <div className="flex justify-between">
                            <span>مفضل</span>
                            <span>$15</span>
                          </div>
                          <div className="flex justify-between">
                            <span>مقعد إضافي</span>
                            <span>$25</span>
                          </div>
                        </div>
                        <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                          Choose Seats
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Baggage */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3 flex items-center">
                      🧳 جواز إضافي
                    </h4>
                    {ancillaryData.baggage && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          23kg متضمن
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>إضافي 23kg</span>
                            <span>$75</span>
                          </div>
                          <div className="flex justify-between">
                            <span>جواز ثقيل (32kg)</span>
                            <span>$150</span>
                          </div>
                          <div className="flex justify-between">
                            <span>معدات الرياضة</span>
                            <span>$100</span>
                          </div>
                        </div>
                        <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                          Add Baggage
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Meals */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3 flex items-center">
                      🍽️ وجبات خاصة
                    </h4>
                    {ancillaryData.meals && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          يتضمن العشاء
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>مصنوع من الفواكه</span>
                            <span>مجاني</span>
                          </div>
                          <div className="flex justify-between">
                            <span>هالال</span>
                            <span>مجاني</span>
                          </div>
                          <div className="flex justify-between">
                            <span>كوشر</span>
                            <span>$15</span>
                          </div>
                        </div>
                        <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                          Select Meal
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Continue Button */}
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={() => setShowAncillaryServices(false)}
                    className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Skip
                  </button>
                  <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    Continue to Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Flymefy Features */}
        {flights.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Flymefy Complete Integration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl mb-2">✈️</div>
                <h4 className="font-semibold">Flight Search</h4>
                <p className="text-sm text-gray-600">600+ Airlines Worldwide</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🪑</div>
                <h4 className="font-semibold">Seat Selection</h4>
                <p className="text-sm text-gray-600">Choose Your Perfect Seat</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🧳</div>
                <h4 className="font-semibold">Baggage Options</h4>
                <p className="text-sm text-gray-600">Extra Bags & Special Items</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🍽️</div>
                <h4 className="font-semibold">Meal Selection</h4>
                <p className="text-sm text-gray-600">Special Dietary Requirements</p>
              </div>
            </div>
            <p className="text-gray-600">
              Complete flight booking experience with real-time data from Flymefy API
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightProperties; 