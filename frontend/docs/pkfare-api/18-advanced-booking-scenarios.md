# Advanced Booking Scenarios

## Multi-City Booking Implementation

```javascript
// Multi-city search request
const multiCitySearch = {
  "partnerId": "ptMaOsL5orqIFtAzI/KXGiXcHTk=",
  "sign": "calculated_signature",
  "journeys": [
    {
      "departure": "IST",
      "arrival": "DXB",
      "departureDate": "2024-03-15"
    },
    {
      "departure": "DXB", 
      "arrival": "BKK",
      "departureDate": "2024-03-20"
    },
    {
      "departure": "BKK",
      "arrival": "IST", 
      "departureDate": "2024-03-25"
    }
  ],
  "passengers": {
    "adults": 2,
    "children": 1,
    "infants": 0
  },
  "cabinClass": "BUSINESS"
};
```

## Group Booking (Multiple Passengers)

```javascript
const groupBookingRequest = {
  "partnerId": "ptMaOsL5orqIFtAzI/KXGiXcHTk=",
  "sign": "calculated_signature",
  "solutionId": "SOL123456",
  "bookingCode": "BC789012",
  "passengers": [
    {
      "lastName": "SMITH",
      "firstName": "JOHN",
      "sex": "M",
      "birthday": "1990-01-15",
      "cardType": "P",
      "cardNum": "A12345678",
      "cardExpiredDate": "2030-01-15",
      "nationality": "US"
    },
    {
      "lastName": "SMITH", 
      "firstName": "JANE",
      "sex": "F",
      "birthday": "1992-05-20",
      "cardType": "P",
      "cardNum": "B87654321",
      "cardExpiredDate": "2029-05-20",
      "nationality": "US"
    },
    {
      "lastName": "SMITH",
      "firstName": "TOMMY",
      "sex": "M", 
      "birthday": "2015-08-10",
      "cardType": "P",
      "cardNum": "C11223344",
      "cardExpiredDate": "2025-08-10",
      "nationality": "US"
    }
  ],
  "contact": {
    "email": "john.smith@email.com",
    "phone": "+1234567890"
  }
};
```

## Infant Booking with Adult

```javascript
const infantBookingRequest = {
  "partnerId": "ptMaOsL5orqIFtAzI/KXGiXcHTk=",
  "sign": "calculated_signature",
  "solutionId": "SOL123456",
  "bookingCode": "BC789012",
  "passengers": [
    {
      "lastName": "JOHNSON",
      "firstName": "MARY",
      "sex": "F",
      "birthday": "1985-03-12",
      "cardType": "P",
      "cardNum": "D55667788",
      "cardExpiredDate": "2028-03-12",
      "nationality": "CA"
    },
    {
      "lastName": "JOHNSON",
      "firstName": "BABY",
      "sex": "M",
      "birthday": "2023-11-01",
      "cardType": "P", 
      "cardNum": "E99887766",
      "cardExpiredDate": "2025-11-01",
      "nationality": "CA",
      "passengerType": "INF"
    }
  ],
  "contact": {
    "email": "mary.johnson@email.com",
    "phone": "+1987654321"
  }
};
```

## Booking with Special Requests

```javascript
const specialRequestBooking = {
  "partnerId": "ptMaOsL5orqIFtAzI/KXGiXcHTk=",
  "sign": "calculated_signature", 
  "solutionId": "SOL123456",
  "bookingCode": "BC789012",
  "passengers": [
    {
      "lastName": "WILLIAMS",
      "firstName": "ROBERT",
      "sex": "M",
      "birthday": "1975-07-08",
      "cardType": "P",
      "cardNum": "F44556677",
      "cardExpiredDate": "2027-07-08",
      "nationality": "GB",
      "specialRequests": [
        "WHEELCHAIR",
        "VEGETARIAN_MEAL"
      ]
    }
  ],
  "contact": {
    "email": "robert.williams@email.com",
    "phone": "+447123456789"
  },
  "remarks": "Passenger requires wheelchair assistance and vegetarian meal"
};
```

## Corporate Booking Implementation

```javascript
const corporateBookingRequest = {
  "partnerId": "ptMaOsL5orqIFtAzI/KXGiXcHTk=",
  "sign": "calculated_signature",
  "solutionId": "SOL123456", 
  "bookingCode": "BC789012",
  "passengers": [
    {
      "lastName": "BROWN",
      "firstName": "MICHAEL",
      "sex": "M",
      "birthday": "1980-12-25",
      "cardType": "P",
      "cardNum": "G77889900",
      "cardExpiredDate": "2026-12-25",
      "nationality": "AU"
    }
  ],
  "contact": {
    "email": "michael.brown@company.com",
    "phone": "+61987654321"
  },
  "corporateInfo": {
    "companyName": "Tech Solutions Ltd",
    "companyCode": "TSL001",
    "costCenter": "TRAVEL_DEPT",
    "approverEmail": "manager@company.com"
  }
};
```

## Booking Error Handling

```javascript
async function handleBookingWithRetry(bookingData, maxRetries = 3) {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const result = await PKFareService.createBooking(bookingData);
      return result;
    } catch (error) {
      attempt++;
      
      // Handle specific error codes
      switch (error.code) {
        case 'B043': // Create PNR failed
          if (attempt < maxRetries) {
            console.log(`Booking attempt ${attempt} failed, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
            continue;
          }
          break;
          
        case 'B016': // Flight near take-off
          throw new Error('Flight is too close to departure time for booking');
          
        case 'B029': // Duplicate booking
          throw new Error('Duplicate booking detected');
          
        case 'B062': // Invalid passenger name
          throw new Error('Passenger name format is invalid');
          
        default:
          if (attempt >= maxRetries) {
            throw error;
          }
      }
    }
  }
  
  throw new Error('Booking failed after maximum retries');
}
```

## Booking Status Monitoring

```javascript
class BookingStatusMonitor {
  constructor(orderNum) {
    this.orderNum = orderNum;
    this.statusCheckInterval = null;
  }
  
  async startMonitoring(callback, intervalMs = 30000) {
    this.statusCheckInterval = setInterval(async () => {
      try {
        const orderDetail = await PKFareService.getOrderDetail(this.orderNum);
        callback(orderDetail);
        
        // Stop monitoring if ticket is issued or booking is cancelled
        if (orderDetail.orderStatus === 'ISSED' || 
            orderDetail.orderStatus === 'CNCL') {
          this.stopMonitoring();
        }
      } catch (error) {
        console.error('Status check failed:', error);
      }
    }, intervalMs);
  }
  
  stopMonitoring() {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
      this.statusCheckInterval = null;
    }
  }
}

// Usage
const monitor = new BookingStatusMonitor('ORD123456789');
monitor.startMonitoring((orderDetail) => {
  console.log('Order status:', orderDetail.orderStatus);
  
  if (orderDetail.orderStatus === 'ISSED') {
    console.log('Tickets issued!');
    console.log('Ticket numbers:', orderDetail.passengers.map(p => p.ticketNum));
  }
});
```

## Booking Validation

```javascript
function validateBookingData(bookingData) {
  const errors = [];
  
  // Validate passengers
  if (!bookingData.passengers || bookingData.passengers.length === 0) {
    errors.push('At least one passenger is required');
  }
  
  bookingData.passengers.forEach((passenger, index) => {
    if (!passenger.lastName || passenger.lastName.length < 2) {
      errors.push(`Passenger ${index + 1}: Last name must be at least 2 characters`);
    }
    
    if (!passenger.firstName || passenger.firstName.length < 2) {
      errors.push(`Passenger ${index + 1}: First name must be at least 2 characters`);
    }
    
    if (!passenger.cardNum || passenger.cardNum.length < 6) {
      errors.push(`Passenger ${index + 1}: Invalid passport/ID number`);
    }
    
    if (!passenger.birthday) {
      errors.push(`Passenger ${index + 1}: Birthday is required`);
    }
    
    if (!passenger.nationality) {
      errors.push(`Passenger ${index + 1}: Nationality is required`);
    }
  });
  
  // Validate contact information
  if (!bookingData.contact?.email) {
    errors.push('Contact email is required');
  }
  
  if (!bookingData.contact?.phone) {
    errors.push('Contact phone is required');
  }
  
  return errors;
}
```

## Booking Confirmation Email

```javascript
async function sendBookingConfirmation(orderDetail) {
  const emailData = {
    to: orderDetail.contact.email,
    subject: `Booking Confirmation - ${orderDetail.orderNum}`,
    html: `
      <h2>Flight Booking Confirmation</h2>
      <p><strong>Order Number:</strong> ${orderDetail.orderNum}</p>
      <p><strong>PNR:</strong> ${orderDetail.pnr}</p>
      <p><strong>Status:</strong> ${orderDetail.orderStatus}</p>
      
      <h3>Passengers</h3>
      ${orderDetail.passengers.map(passenger => `
        <p>${passenger.firstName} ${passenger.lastName}</p>
        ${passenger.ticketNum ? `<p>Ticket: ${passenger.ticketNum}</p>` : ''}
      `).join('')}
      
      <h3>Flight Details</h3>
      ${orderDetail.journeys.map(journey => 
        journey.segments.map(segment => `
          <p>${segment.airline} ${segment.flightNum}</p>
          <p>${segment.departure} → ${segment.arrival}</p>
          <p>${segment.departureDate} ${segment.departureTime}</p>
        `).join('')
      ).join('')}
      
      <p><strong>Total Price:</strong> $${orderDetail.totalPrice}</p>
    `
  };
  
  // Send email using your preferred email service
  await sendEmail(emailData);
}
``` 