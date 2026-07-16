
## 📊 Database Schema (ERD)

```mermaid
erDiagram
    USER {
        uuid id PK
        string name
        string email
        string passwordHash
        string role
        timestamp createdAt
    }
    HOTEL {
        uuid id PK
        string name
        string address
        string city
        string ownerId FK
        float starRating
    }
    ROOM {
        uuid id PK
        uuid hotelId FK
        string number
        string type
        float pricePerNight
        int capacity
        string status
    }
    CAR {
        uuid id PK
        string brand
        string model
        string plateNumber
        float pricePerDay
        string status
        string ownerId FK
    }
    RENTAL {
        uuid id PK
        uuid userId FK
        uuid roomId FK
        uuid carId FK
        string type
        datetime startDate
        datetime endDate
        float totalPrice
        string status
    }
    PAYMENT {
        uuid id PK
        uuid rentalId FK
        float amount
        string method
        string status
        string gatewayRef
        timestamp paidAt
    }

    USER ||--o{ HOTEL : owns
    USER ||--o{ RENTAL : makes
    HOTEL ||--o{ ROOM : has
    ROOM ||--o{ RENTAL : booked_via
    CAR ||--o{ RENTAL : booked_via
    RENTAL ||--|| PAYMENT : paid_by
