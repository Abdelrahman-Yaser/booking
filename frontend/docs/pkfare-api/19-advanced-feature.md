# PKfare Documentation File 19

# Advanced Ancillary Services Integration

## Complete Ancillary Services Implementation

### 1. Baggage Services

```javascript
// Get available baggage options
async function getBaggageOptions(solutionId) {
  const baggageRequest = {
    "partnerId": "ptMaOsL5orqIFtAzI/KXGiXcHTk=",
    "sign": "calculated_signature",
    "solutionId": solutionId,
    "serviceType": "BAGGAGE"
  };
  
  const response = await PKFareService.getAncillaryServices(solutionId, "BAGGAGE");
  
  return response.services.map(service => ({
    serviceId: service.serviceId,
    description: service.description,
    weight: service.weight,
    price: service.price,
    currency: service.currency,
    segments: service.segments
  }));
}

// Example response
const baggageOptions = [
  {
    "serviceId": "BAG001",
    "description": "Extra 23kg Baggage",
    "weight": "23kg",
    "price": 50.00,
    "currency": "USD",
    "segments": ["IST-DXB"]
  },
  {
    "serviceId": "BAG002", 
    "description": "Extra 32kg Baggage",
    "weight": "32kg",
    "price": 80.00,
    "currency": "USD",
    "segments": ["IST-DXB"]
  }
];
```

### 2. Seat Selection Services

```javascript
// Get available seat options
async function getSeatOptions(solutionId) {
  const seatRequest = {
    "partnerId": "ptMaOsL5orqIFtAzI/KXGiXcHTk=",
    "sign": "calculated_signature",
    "solutionId": solutionId,
    "serviceType": "SEAT"
  };
  
  const response = await PKFareService.getAncillaryServices(solutionId, "SEAT");
  
  return response.services.map(service => ({
    serviceId: service.serviceId,
    seatNumber: service.seatNumber,
    seatType: service.seatType,
    price: service.price,
    currency: service.currency,
    segment: service.segment,
    available: service.available
  }));
}

// Example seat map response
const seatOptions = [
  {
    "serviceId": "SEAT001",
    "seatNumber": "12A",
    "seatType": "WINDOW",
    "price": 25.00,
    "currency": "USD", 
    "segment": "IST-DXB",
    "available": true
  },
  {
    "serviceId": "SEAT002",
    "seatNumber": "12B", 
    "seatType": "MIDDLE",
    "price": 15.00,
    "currency": "USD",
    "segment": "IST-DXB",
    "available": true
  }
];
```

### 3. Meal Services

```javascript
// Get available meal options
async function getMealOptions(solutionId) {
  const mealRequest = {
    "partnerId": "ptMaOsL5orqIFtAzI/KXGiXcHTk=",
    "sign": "calculated_signature",
    "solutionId": solutionId,
    "serviceType": "MEAL"
  };
  
  const response = await PKFareService.getAncillaryServices(solutionId, "MEAL");
  
  return response.services.map(service => ({
    serviceId: service.serviceId,
    mealType: service.mealType,
    description: service.description,
    price: service.price,
    currency: service.currency,
    segment: service.segment
  }));
}

// Example meal options
const mealOptions = [
  {
    "serviceId": "MEAL001",
    "mealType": "VEGETARIAN",
    "description": "Vegetarian Meal",
    "price": 20.00,
    "currency": "USD",
    "segment": "IST-DXB"
  },
  {
    "serviceId": "MEAL002",
    "mealType": "HALAL", 
    "description": "Halal Meal",
    "price": 20.00,
    "currency": "USD",
    "segment": "IST-DXB"
  }
];
```

### 4. Complete Booking with Ancillaries

```javascript
async function bookFlightWithAncillaries(bookingData, selectedAncillaries) {
  try {
    // First create the main booking
    const booking = await PKFareService.createBooking(bookingData);
    
    // Then add ancillary services
    const ancillaryBookings = [];
    
    for (const ancillary of selectedAncillaries) {
      const ancillaryBooking = await PKFareService.bookAncillaryService({
        "partnerId": "ptMaOsL5orqIFtAzI/KXGiXcHTk=",
        "sign": "calculated_signature",
        "orderNum": booking.orderNum,
        "serviceId": ancillary.serviceId,
        "passengerIndex": ancillary.passengerIndex || 0,
        "segmentIndex": ancillary.segmentIndex || 0
      });
      
      ancillaryBookings.push(ancillaryBooking);
    }
    
    return {
      mainBooking: booking,
      ancillaryBookings: ancillaryBookings,
      totalPrice: booking.totalPrice + ancillaryBookings.reduce((sum, ab) => sum + ab.price, 0)
    };
    
  } catch (error) {
    console.error('Booking with ancillaries failed:', error);
    throw error;
  }
}

// Usage example
const selectedAncillaries = [
  {
    serviceId: "BAG001",
    passengerIndex: 0,
    segmentIndex: 0
  },
  {
    serviceId: "SEAT001", 
    passengerIndex: 0,
    segmentIndex: 0
  },
  {
    serviceId: "MEAL001",
    passengerIndex: 0,
    segmentIndex: 0
  }
];

const completeBooking = await bookFlightWithAncillaries(bookingData, selectedAncillaries);
```

### 5. Ancillary Services React Component

```javascript
// components/AncillaryServices.jsx
import React, { useState, useEffect } from 'react';
import { usePKFare } from '@/hooks/usePKFare';

const AncillaryServices = ({ solutionId, passengers, onAncillariesSelected }) => {
  const [baggageOptions, setBaggageOptions] = useState([]);
  const [seatOptions, setSeatOptions] = useState([]);
  const [mealOptions, setMealOptions] = useState([]);
  const [selectedAncillaries, setSelectedAncillaries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { getAncillaries } = usePKFare();

  useEffect(() => {
    loadAncillaryOptions();
  }, [solutionId]);

  const loadAncillaryOptions = async () => {
    try {
      setLoading(true);
      
      const [baggage, seats, meals] = await Promise.all([
        getAncillaries(solutionId, 'BAGGAGE'),
        getAncillaries(solutionId, 'SEAT'),
        getAncillaries(solutionId, 'MEAL')
      ]);
      
      setBaggageOptions(baggage.services || []);
      setSeatOptions(seats.services || []);
      setMealOptions(meals.services || []);
      
    } catch (error) {
      console.error('Failed to load ancillary options:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAncillarySelection = (serviceId, passengerIndex, segmentIndex, selected) => {
    if (selected) {
      setSelectedAncillaries(prev => [...prev, { serviceId, passengerIndex, segmentIndex }]);
    } else {
      setSelectedAncillaries(prev => 
        prev.filter(a => a.serviceId !== serviceId || 
                         a.passengerIndex !== passengerIndex ||
                         a.segmentIndex !== segmentIndex)
      );
    }
  };

  useEffect(() => {
    onAncillariesSelected(selectedAncillaries);
  }, [selectedAncillaries]);

  if (loading) {
    return <div>Loading ancillary services...</div>;
  }

  return (
    <div className="ancillary-services">
      <h3>Additional Services</h3>
      
      {/* Baggage Options */}
      <div className="service-section">
        <h4>Extra Baggage</h4>
        {baggageOptions.map((baggage, index) => (
          <div key={index} className="service-option">
            <label>
              <input
                type="checkbox"
                onChange={(e) => handleAncillarySelection(
                  baggage.serviceId, 0, 0, e.target.checked
                )}
              />
              {baggage.description} - ${baggage.price}
            </label>
          </div>
        ))}
      </div>

      {/* Seat Options */}
      <div className="service-section">
        <h4>Seat Selection</h4>
        {passengers.map((passenger, passengerIndex) => (
          <div key={passengerIndex} className="passenger-seats">
            <h5>{passenger.firstName} {passenger.lastName}</h5>
            <div className="seat-map">
              {seatOptions.map((seat, index) => (
                <div key={index} className="seat-option">
                  <label>
                    <input
                      type="radio"
                      name={`seat-${passengerIndex}`}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleAncillarySelection(seat.serviceId, passengerIndex, 0, true);
                        }
                      }}
                    />
                    {seat.seatNumber} ({seat.seatType}) - ${seat.price}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Meal Options */}
      <div className="service-section">
        <h4>Special Meals</h4>
        {passengers.map((passenger, passengerIndex) => (
          <div key={passengerIndex} className="passenger-meals">
            <h5>{passenger.firstName} {passenger.lastName}</h5>
            {mealOptions.map((meal, index) => (
              <div key={index} className="meal-option">
                <label>
                  <input
                    type="radio"
                    name={`meal-${passengerIndex}`}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleAncillarySelection(meal.serviceId, passengerIndex, 0, true);
                      }
                    }}
                  />
                  {meal.description} - ${meal.price}
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="ancillary-summary">
        <h4>Selected Services</h4>
        {selectedAncillaries.length === 0 ? (
          <p>No additional services selected</p>
        ) : (
          <ul>
            {selectedAncillaries.map((ancillary, index) => (
              <li key={index}>
                Service ID: {ancillary.serviceId} for Passenger {ancillary.passengerIndex + 1}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AncillaryServices;
```

### 6. Ancillary Services Pricing Calculator

```javascript
class AncillaryPricingCalculator {
  constructor(ancillaryOptions) {
    this.baggageOptions = ancillaryOptions.baggage || [];
    this.seatOptions = ancillaryOptions.seats || [];
    this.mealOptions = ancillaryOptions.meals || [];
  }

  calculateTotalPrice(selectedAncillaries) {
    let totalPrice = 0;
    
    selectedAncillaries.forEach(ancillary => {
      const service = this.findService(ancillary.serviceId);
      if (service) {
        totalPrice += service.price;
      }
    });
    
    return totalPrice;
  }

  findService(serviceId) {
    const allServices = [
      ...this.baggageOptions,
      ...this.seatOptions, 
      ...this.mealOptions
    ];
    
    return allServices.find(service => service.serviceId === serviceId);
  }

  getServiceBreakdown(selectedAncillaries) {
    return selectedAncillaries.map(ancillary => {
      const service = this.findService(ancillary.serviceId);
      return {
        serviceId: ancillary.serviceId,
        description: service?.description || 'Unknown Service',
        price: service?.price || 0,
        passengerIndex: ancillary.passengerIndex,
        segmentIndex: ancillary.segmentIndex
      };
    });
  }
}

// Usage
const calculator = new AncillaryPricingCalculator({
  baggage: baggageOptions,
  seats: seatOptions,
  meals: mealOptions
});

const totalAncillaryPrice = calculator.calculateTotalPrice(selectedAncillaries);
const breakdown = calculator.getServiceBreakdown(selectedAncillaries);
```
