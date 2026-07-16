# API Reference - Complete Integration Guide

## PKFARE Flight Buyer API - Complete Endpoints

### Base URL
```
Production: https://api.pkfare.com/v1
Sandbox: https://sandbox-api.pkfare.com/v1
```

### Authentication
All requests require MD5 signature:
```javascript
const partnerId = "your_partner_id";
const partnerKey = "your_partner_key";
const sign = CryptoJS.MD5(partnerId + partnerKey).toString();
```

## 1. Flight Search API

### Endpoint: `/shopping`
**Method:** POST

```javascript
const searchRequest = {
  "partnerId": "ptMaOsL5orqIFtAzI/KXGiXcHTk=",
  "sign": "calculated_md5_signature",
  "journeys": [
    {
      "departure": "IST",
      "arrival": "DXB", 
      "departureDate": "2024-03-15"
    }
  ],
  "passengers": {
    "adults": 1,
    "children": 0,
    "infants": 0
  },
  "cabinClass": "ECONOMY",
  "currency": "USD"
};

// Example Response
{
  "errorCode": "0",
  "errorMsg": "ok",
  "data": {
    "solutions": [
      {
        "solutionId": "SOL123456",
        "bookingCode": "BC789012",
        "totalPrice": 450.00,
        "currency": "USD",
        "journeys": [
          {
            "segments": [
              {
                "airline": "TK",
                "flightNum": "1234",
                "departure": "IST",
                "arrival": "DXB",
                "departureDate": "2024-03-15",
                "departureTime": "14:30",
                "arrivalDate": "2024-03-15", 
                "arrivalTime": "19:45",
                "cabinClass": "ECONOMY",
                "bookingCode": "Y"
              }
            ]
          }
        ],
        "priceBreakdown": {
          "adtFare": 350.00,
          "adtTax": 100.00,
          "totalPrice": 450.00
        }
      }
    ]
  }
}
```

## 2. Precise Pricing API

### Endpoint: `/precisePricing`
**Method:** POST

```javascript
const pricingRequest = {
  "partnerId": "ptMaOsL5orqIFtAzI/KXGiXcHTk=",
  "sign": "calculated_md5_signature",
  "solutionId": "SOL123456",
  "bookingCode": "BC789012",
  "passengers": {
    "adults": 1,
    "children": 0,
    "infants": 0
  }
};

// Example Response
{
  "errorCode": "0",
  "errorMsg": "ok", 
  "data": {
    "solutionId": "SOL123456",
    "bookingCode": "BC789012",
    "totalPrice": 450.00,
    "currency": "USD",
    "priceBreakdown": {
      "adtFare": 350.00,
      "adtTax": 100.00,
      "tktFee": 0.00,
      "totalPrice": 450.00
    },
    "fareRules": {
      "refundable": true,
      "changeable": true,
      "cancellationFee": 50.00
    }
  }
}
```

## 3. Precise Booking API

### Endpoint: `/preciseBooking`
**Method:** POST

```javascript
const bookingRequest = {
  "partnerId": "ptMaOsL5orqIFtAzI/KXGiXcHTk=",
  "sign": "calculated_md5_signature",
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
    }
  ],
  "contact": {
    "email": "john.smith@email.com",
    "phone": "+1234567890"
  }
};

// Example Response
{
  "errorCode": "0",
  "errorMsg": "ok",
  "data": {
    "orderNum": "ORD123456789",
    "pnr": "ABC123",
    "orderStatus": "TO_BE_PAID",
    "totalPrice": 450.00,
    "currency": "USD",
    "timeLimit": "2024-03-14T23:59:59Z"
  }
}
```

## 4. Order Detail API

### Endpoint: `/orderDetail`
**Method:** POST

```javascript
const orderDetailRequest = {
  "partnerId": "ptMaOsL5orqIFtAzI/KXGiXcHTk=",
  "sign": "calculated_md5_signature",
  "orderNum": "ORD123456789"
};

// Example Response
{
  "errorCode": "0",
  "errorMsg": "ok",
  "data": {
    "orderNum": "ORD123456789",
    "orderStatus": "ISSED",
    "pnr": "ABC123",
    "airPnr": "TK123ABC",
    "totalPrice": 450.00,
    "currency": "USD",
    "passengers": [
      {
        "lastName": "SMITH",
        "firstName": "JOHN",
        "ticketNum": "1234567890123"
      }
    ],
    "journeys": [
      {
        "segments": [
          {
            "airline": "TK",
            "flightNum": "1234",
            "departure": "IST",
            "arrival": "DXB",
            "departureDate": "2024-03-15",
            "departureTime": "14:30",
            "arrivalDate": "2024-03-15",
            "arrivalTime": "19:45"
          }
        ]
      }
    ]
  }
}
```

## 5. Ancillary Services API

### Endpoint: `/ancillaryServices`
**Method:** POST

```javascript
const ancillaryRequest = {
  "partnerId": "ptMaOsL5orqIFtAzI/KXGiXcHTk=",
  "sign": "calculated_md5_signature",
  "solutionId": "SOL123456",
  "serviceType": "BAGGAGE"
};

// Example Response
{
  "errorCode": "0",
  "errorMsg": "ok",
  "data": {
    "services": [
      {
        "serviceId": "BAG001",
        "serviceType": "BAGGAGE",
        "description": "Extra 23kg Baggage",
        "price": 50.00,
        "currency": "USD",
        "segments": ["IST-DXB"]
      }
    ]
  }
}
```

## 6. Refund Pricing API

### Endpoint: `/refundPricing`
**Method:** POST

```javascript
const refundPricingRequest = {
  "partnerId": "ptMaOsL5orqIFtAzI/KXGiXcHTk=",
  "sign": "calculated_md5_signature",
  "orderNum": "ORD123456789",
  "refundType": "VOLUNTARY"
};

// Example Response
{
  "errorCode": "0",
  "errorMsg": "ok",
  "data": {
    "refundable": true,
    "refundAmount": 400.00,
    "refundFee": 50.00,
    "currency": "USD"
  }
}
```

## 7. Refund Request API

### Endpoint: `/refundRequest`
**Method:** POST

```javascript
const refundRequest = {
  "partnerId": "ptMaOsL5orqIFtAzI/KXGiXcHTk=",
  "sign": "calculated_md5_signature",
  "orderNum": "ORD123456789",
  "refundType": "VOLUNTARY",
  "refundReason": "Personal reason",
  "attachmentIds": ["FILE123"]
};
```

## 8. Change Request API

### Endpoint: `/changeRequest`
**Method:** POST

```javascript
const changeRequest = {
  "partnerId": "ptMaOsL5orqIFtAzI/KXGiXcHTk=",
  "sign": "calculated_md5_signature",
  "orderNum": "ORD123456789",
  "changeType": "VOLUNTARY",
  "newSolutionId": "SOL789012"
};
```

## Integration Best Practices

### 1. Error Handling
```javascript
function handlePKFareResponse(response) {
  if (response.errorCode === "0") {
    return response.data;
  } else {
    throw new Error(`PKFare Error ${response.errorCode}: ${response.errorMsg}`);
  }
}
```

### 2. Signature Generation
```javascript
function generateSignature(partnerId, partnerKey) {
  return CryptoJS.MD5(partnerId + partnerKey).toString();
}
```

### 3. Request Wrapper
```javascript
async function pkfareRequest(endpoint, data) {
  const requestData = {
    ...data,
    partnerId: process.env.PKFARE_PARTNER_ID,
    sign: generateSignature(process.env.PKFARE_PARTNER_ID, process.env.PKFARE_PARTNER_KEY)
  };
  
  const response = await fetch(`${PKFARE_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  });
  
  return handlePKFareResponse(await response.json());
}
```

## Complete Integration Flow

```javascript
// 1. Search Flights
const searchResults = await pkfareRequest('/shopping', searchRequest);

// 2. Get Precise Pricing
const pricing = await pkfareRequest('/precisePricing', pricingRequest);

// 3. Create Booking
const booking = await pkfareRequest('/preciseBooking', bookingRequest);

// 4. Check Order Status
const orderDetail = await pkfareRequest('/orderDetail', { orderNum: booking.orderNum });

// 5. Handle Ancillaries (if needed)
const ancillaries = await pkfareRequest('/ancillaryServices', ancillaryRequest);
``` 