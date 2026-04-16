# 🏨 Multi-Tenant Booking Platform  
A scalable SaaS booking system that allows multiple hotels/venues (tenants) to manage rooms, customers, staff, and reservations under isolated environments.

##  Overview  
This project implements a full **multi-tenant booking platform** similar to Booking.com for hotels, apartments, and venues.  
Each tenant (hotel) has its own isolated data and can manage:


# Data Architecture & Patterns in Booking System

This Booking System is built for **scalability, performance, and maintainability**, using modern data patterns:

### CQRS
- **Commands**: write operations (create/update/delete bookings).  
- **Queries**: read operations (fetch bookings, availability).  
- Clear separation of responsibilities using separate handlers/controllers.

### Denormalization
- Certain read models are **denormalized** for faster queries and reduced joins.  
- Improves performance while keeping data consistent under high load.


- Rooms  
- Customers  
- Staff  
- Bookings  
- Payments  
- Reviews  

The system supports **schema-based multi-tenancy (Schema-per-Tenant)** for strong isolation and performance.

---

##  Features  
###  Multi-Tenancy  
- Dedicated schema for every hotel/tenant  
- Data isolation guaranteed  
- Automatic schema creation on tenant registration  

### 🏨 Tenant Management  
- Add hotel details (name, location, logo, contact info)  
- Assign staff with roles (admin, manager, receptionist)  
- Manage rooms, images, and room availability  

### 📅 Booking System  
- Create, update, cancel bookings  
- Track check-in / check-out  
- Calculate total price  
- Prevent double-booking  

### 💳 Payments  
- Record payments  
- Cash / Card support  
- Attach payment to booking  

### ⭐ Reviews  
- Customer reviews for rooms  
- Rating system  
- Linked to tenant & customer  

### 🛡 Soft Delete  
All main tables support soft delete using:  

### ERD Diagram customer


| Field     | Type                   | Notes |
|-----------|-------------------------|-------|
| id        | ULID                   | PK    |
| tenantId  | FK → public.tenants.id |       |
| name      | string                 |       |
| email     | string                 |       |
| phone     | string                 |       |
| createdAt | datetime               |       |
| isDeleted | boolean                |       |


---

## 📊 Database Schema (ERD)

```mermaid
erDiagram
    USER {
        uuid id PK
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