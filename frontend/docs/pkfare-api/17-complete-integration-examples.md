# Complete Integration Examples

## Full PKFare Integration Implementation

### 1. Environment Configuration

```javascript
// .env.local
PKFARE_PARTNER_ID=ptMaOsL5orqIFtAzI/KXGiXcHTk=
PKFARE_PARTNER_KEY=OWMyMjlhYjY3ZDg3ZDg1ZGU4ZGRlM2JjNmRiZmE3ZDY=
PKFARE_BASE_URL=https://api.pkfare.com/v1
```

### 2. PKFare Service Class

```javascript
// services/pkfare.js
import CryptoJS from 'crypto-js';

class PKFareService {
  constructor() {
    this.partnerId = process.env.PKFARE_PARTNER_ID;
    this.partnerKey = process.env.PKFARE_PARTNER_KEY;
    this.baseUrl = process.env.PKFARE_BASE_URL;
  }

  generateSignature() {
    return CryptoJS.MD5(this.partnerId + this.partnerKey).toString();
  }

  async makeRequest(endpoint, data) {
    const requestData = {
      ...data,
      partnerId: this.partnerId,
      sign: this.generateSignature()
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();
      
      if (result.errorCode !== "0") {
        throw new Error(`PKFare Error ${result.errorCode}: ${result.errorMsg}`);
      }

      return result.data;
    } catch (error) {
      console.error('PKFare API Error:', error);
      throw error;
    }
  }

  // Flight Search
  async searchFlights(searchParams) {
    return await this.makeRequest('/shopping', {
      journeys: searchParams.journeys,
      passengers: searchParams.passengers,
      cabinClass: searchParams.cabinClass || 'ECONOMY',
      currency: searchParams.currency || 'USD'
    });
  }

  // Precise Pricing
  async getPricing(solutionId, bookingCode, passengers) {
    return await this.makeRequest('/precisePricing', {
      solutionId,
      bookingCode,
      passengers
    });
  }

  // Create Booking
  async createBooking(bookingData) {
    return await this.makeRequest('/preciseBooking', bookingData);
  }

  // Get Order Details
  async getOrderDetail(orderNum) {
    return await this.makeRequest('/orderDetail', { orderNum });
  }

  // Get Ancillary Services
  async getAncillaryServices(solutionId, serviceType) {
    return await this.makeRequest('/ancillaryServices', {
      solutionId,
      serviceType
    });
  }

  // Refund Pricing
  async getRefundPricing(orderNum, refundType = 'VOLUNTARY') {
    return await this.makeRequest('/refundPricing', {
      orderNum,
      refundType
    });
  }

  // Create Refund Request
  async createRefundRequest(refundData) {
    return await this.makeRequest('/refundRequest', refundData);
  }

  // Change Request
  async createChangeRequest(changeData) {
    return await this.makeRequest('/changeRequest', changeData);
  }
}

export default new PKFareService();
```

### 3. Next.js API Route Implementation

```javascript
// app/api/pkfare-flights/route.js
import PKFareService from '@/services/pkfare';

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    let result;

    switch (action) {
      case 'search':
        result = await PKFareService.searchFlights(params);
        break;
      
      case 'pricing':
        result = await PKFareService.getPricing(
          params.solutionId,
          params.bookingCode,
          params.passengers
        );
        break;
      
      case 'booking':
        result = await PKFareService.createBooking(params);
        break;
      
      case 'orderDetail':
        result = await PKFareService.getOrderDetail(params.orderNum);
        break;
      
      case 'ancillaries':
        result = await PKFareService.getAncillaryServices(
          params.solutionId,
          params.serviceType
        );
        break;
      
      case 'refundPricing':
        result = await PKFareService.getRefundPricing(
          params.orderNum,
          params.refundType
        );
        break;
      
      case 'refundRequest':
        result = await PKFareService.createRefundRequest(params);
        break;
      
      case 'changeRequest':
        result = await PKFareService.createChangeRequest(params);
        break;
      
      default:
        return Response.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return Response.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('PKFare API Error:', error);
    return Response.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
}
```

### 4. React Hook for PKFare Integration

```javascript
// hooks/usePKFare.js
import { useState, useCallback } from 'react';

export const usePKFare = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callPKFareAPI = useCallback(async (action, params) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pkfare-flights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, ...params })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchFlights = useCallback((searchParams) => {
    return callPKFareAPI('search', searchParams);
  }, [callPKFareAPI]);

  const getPricing = useCallback((solutionId, bookingCode, passengers) => {
    return callPKFareAPI('pricing', { solutionId, bookingCode, passengers });
  }, [callPKFareAPI]);

  const createBooking = useCallback((bookingData) => {
    return callPKFareAPI('booking', bookingData);
  }, [callPKFareAPI]);

  const getOrderDetail = useCallback((orderNum) => {
    return callPKFareAPI('orderDetail', { orderNum });
  }, [callPKFareAPI]);

  const getAncillaries = useCallback((solutionId, serviceType) => {
    return callPKFareAPI('ancillaries', { solutionId, serviceType });
  }, [callPKFareAPI]);

  const getRefundPricing = useCallback((orderNum, refundType) => {
    return callPKFareAPI('refundPricing', { orderNum, refundType });
  }, [callPKFareAPI]);

  const createRefundRequest = useCallback((refundData) => {
    return callPKFareAPI('refundRequest', refundData);
  }, [callPKFareAPI]);

  const createChangeRequest = useCallback((changeData) => {
    return callPKFareAPI('changeRequest', changeData);
  }, [callPKFareAPI]);

  return {
    loading,
    error,
    searchFlights,
    getPricing,
    createBooking,
    getOrderDetail,
    getAncillaries,
    getRefundPricing,
    createRefundRequest,
    createChangeRequest
  };
};
```

### 5. Flight Search Component

```javascript
// components/FlightSearch.jsx
import React, { useState } from 'react';
import { usePKFare } from '@/hooks/usePKFare';

const FlightSearch = () => {
  const [searchParams, setSearchParams] = useState({
    journeys: [
      {
        departure: '',
        arrival: '',
        departureDate: ''
      }
    ],
    passengers: {
      adults: 1,
      children: 0,
      infants: 0
    },
    cabinClass: 'ECONOMY'
  });
  
  const [searchResults, setSearchResults] = useState(null);
  const { loading, error, searchFlights } = usePKFare();

  const handleSearch = async () => {
    try {
      const results = await searchFlights(searchParams);
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  return (
    <div className="flight-search">
      <div className="search-form">
        <input
          type="text"
          placeholder="From"
          value={searchParams.journeys[0].departure}
          onChange={(e) => setSearchParams(prev => ({
            ...prev,
            journeys: [{
              ...prev.journeys[0],
              departure: e.target.value
            }]
          }))}
        />
        
        <input
          type="text"
          placeholder="To"
          value={searchParams.journeys[0].arrival}
          onChange={(e) => setSearchParams(prev => ({
            ...prev,
            journeys: [{
              ...prev.journeys[0],
              arrival: e.target.value
            }]
          }))}
        />
        
        <input
          type="date"
          value={searchParams.journeys[0].departureDate}
          onChange={(e) => setSearchParams(prev => ({
            ...prev,
            journeys: [{
              ...prev.journeys[0],
              departureDate: e.target.value
            }]
          }))}
        />
        
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search Flights'}
        </button>
      </div>

      {error && (
        <div className="error">
          Error: {error}
        </div>
      )}

      {searchResults && (
        <div className="search-results">
          <h3>Flight Results</h3>
          {searchResults.solutions?.map((solution, index) => (
            <div key={index} className="flight-option">
              <div className="flight-info">
                {solution.journeys[0].segments.map((segment, segIndex) => (
                  <div key={segIndex} className="segment">
                    <span>{segment.airline} {segment.flightNum}</span>
                    <span>{segment.departure} → {segment.arrival}</span>
                    <span>{segment.departureTime} - {segment.arrivalTime}</span>
                  </div>
                ))}
              </div>
              <div className="price">
                ${solution.totalPrice} {solution.currency}
              </div>
              <button 
                onClick={() => handleSelectFlight(solution)}
                className="select-btn"
              >
                Select
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlightSearch;
```

### 6. Booking Flow Component

```javascript
// components/BookingFlow.jsx
import React, { useState } from 'react';
import { usePKFare } from '@/hooks/usePKFare';

const BookingFlow = ({ selectedFlight }) => {
  const [passengers, setPassengers] = useState([
    {
      lastName: '',
      firstName: '',
      sex: 'M',
      birthday: '',
      cardType: 'P',
      cardNum: '',
      cardExpiredDate: '',
      nationality: ''
    }
  ]);
  
  const [contact, setContact] = useState({
    email: '',
    phone: ''
  });
  
  const [bookingResult, setBookingResult] = useState(null);
  const { loading, createBooking, getPricing } = usePKFare();

  const handleBooking = async () => {
    try {
      // First get precise pricing
      const pricing = await getPricing(
        selectedFlight.solutionId,
        selectedFlight.bookingCode,
        { adults: passengers.length, children: 0, infants: 0 }
      );

      // Then create booking
      const booking = await createBooking({
        solutionId: selectedFlight.solutionId,
        bookingCode: selectedFlight.bookingCode,
        passengers,
        contact
      });

      setBookingResult(booking);
    } catch (err) {
      console.error('Booking failed:', err);
    }
  };

  return (
    <div className="booking-flow">
      <h3>Passenger Information</h3>
      {passengers.map((passenger, index) => (
        <div key={index} className="passenger-form">
          <input
            type="text"
            placeholder="Last Name"
            value={passenger.lastName}
            onChange={(e) => {
              const newPassengers = [...passengers];
              newPassengers[index].lastName = e.target.value;
              setPassengers(newPassengers);
            }}
          />
          <input
            type="text"
            placeholder="First Name"
            value={passenger.firstName}
            onChange={(e) => {
              const newPassengers = [...passengers];
              newPassengers[index].firstName = e.target.value;
              setPassengers(newPassengers);
            }}
          />
          <input
            type="date"
            placeholder="Birthday"
            value={passenger.birthday}
            onChange={(e) => {
              const newPassengers = [...passengers];
              newPassengers[index].birthday = e.target.value;
              setPassengers(newPassengers);
            }}
          />
          <input
            type="text"
            placeholder="Passport Number"
            value={passenger.cardNum}
            onChange={(e) => {
              const newPassengers = [...passengers];
              newPassengers[index].cardNum = e.target.value;
              setPassengers(newPassengers);
            }}
          />
        </div>
      ))}

      <h3>Contact Information</h3>
      <input
        type="email"
        placeholder="Email"
        value={contact.email}
        onChange={(e) => setContact(prev => ({ ...prev, email: e.target.value }))}
      />
      <input
        type="tel"
        placeholder="Phone"
        value={contact.phone}
        onChange={(e) => setContact(prev => ({ ...prev, phone: e.target.value }))}
      />

      <button onClick={handleBooking} disabled={loading}>
        {loading ? 'Creating Booking...' : 'Book Flight'}
      </button>

      {bookingResult && (
        <div className="booking-success">
          <h3>Booking Successful!</h3>
          <p>Order Number: {bookingResult.orderNum}</p>
          <p>PNR: {bookingResult.pnr}</p>
          <p>Status: {bookingResult.orderStatus}</p>
          <p>Total Price: ${bookingResult.totalPrice}</p>
        </div>
      )}
    </div>
  );
};

export default BookingFlow;
```

### 7. Order Management Component

```javascript
// components/OrderManagement.jsx
import React, { useState, useEffect } from 'react';
import { usePKFare } from '@/hooks/usePKFare';

const OrderManagement = ({ orderNum }) => {
  const [orderDetail, setOrderDetail] = useState(null);
  const [refundPricing, setRefundPricing] = useState(null);
  const { getOrderDetail, getRefundPricing, createRefundRequest } = usePKFare();

  useEffect(() => {
    if (orderNum) {
      loadOrderDetail();
    }
  }, [orderNum]);

  const loadOrderDetail = async () => {
    try {
      const detail = await getOrderDetail(orderNum);
      setOrderDetail(detail);
    } catch (err) {
      console.error('Failed to load order:', err);
    }
  };

  const handleRefundPricing = async () => {
    try {
      const pricing = await getRefundPricing(orderNum, 'VOLUNTARY');
      setRefundPricing(pricing);
    } catch (err) {
      console.error('Failed to get refund pricing:', err);
    }
  };

  const handleRefundRequest = async () => {
    try {
      await createRefundRequest({
        orderNum,
        refundType: 'VOLUNTARY',
        refundReason: 'Personal reason'
      });
      alert('Refund request submitted successfully');
    } catch (err) {
      console.error('Failed to create refund request:', err);
    }
  };

  if (!orderDetail) {
    return <div>Loading order details...</div>;
  }

  return (
    <div className="order-management">
      <h3>Order Details</h3>
      <div className="order-info">
        <p>Order Number: {orderDetail.orderNum}</p>
        <p>Status: {orderDetail.orderStatus}</p>
        <p>PNR: {orderDetail.pnr}</p>
        <p>Airline PNR: {orderDetail.airPnr}</p>
        <p>Total Price: ${orderDetail.totalPrice}</p>
      </div>

      <div className="passengers">
        <h4>Passengers</h4>
        {orderDetail.passengers?.map((passenger, index) => (
          <div key={index} className="passenger">
            <p>{passenger.firstName} {passenger.lastName}</p>
            <p>Ticket: {passenger.ticketNum}</p>
          </div>
        ))}
      </div>

      <div className="flight-details">
        <h4>Flight Details</h4>
        {orderDetail.journeys?.map((journey, index) => (
          <div key={index} className="journey">
            {journey.segments?.map((segment, segIndex) => (
              <div key={segIndex} className="segment">
                <p>{segment.airline} {segment.flightNum}</p>
                <p>{segment.departure} → {segment.arrival}</p>
                <p>{segment.departureDate} {segment.departureTime}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="actions">
        <button onClick={handleRefundPricing}>
          Check Refund Pricing
        </button>
        
        {refundPricing && (
          <div className="refund-info">
            <p>Refundable: {refundPricing.refundable ? 'Yes' : 'No'}</p>
            <p>Refund Amount: ${refundPricing.refundAmount}</p>
            <p>Refund Fee: ${refundPricing.refundFee}</p>
            <button onClick={handleRefundRequest}>
              Request Refund
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement; 