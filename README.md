# 🚀 Flymefy - Multi-Tenant Travel Booking Platform

A comprehensive, scalable SaaS travel booking system and modern frontend application. This platform allows multiple hotels, agencies, and venues (tenants) to manage their services under strictly isolated environments, while providing customers with a seamless Next.js-powered booking experience for flights, hotels, cars, tours, and more.

## 🌟 Overview

This project is built as a complete ecosystem containing two main pillars:
1. **The Backend (Core System):** A Multi-Tenant Booking Engine supporting **Schema-per-Tenant** data isolation. It handles rooms, customers, staff, bookings, and payments with high performance and data security.
2. **The Frontend (Flymefy Theme):** A responsive, modern travel booking UI built with **Next.js 15 and React 18**, offering a unified dashboard for users to search, book, and manage their travel plans.

---

## 🛠️ Full-Stack Technologies

**Frontend (Client & UI)**
- Framework: Next.js 15, React 18
- State Management: Redux Toolkit 2.0
- Styling: SCSS, Bootstrap 5.3
- Animations & Icons: AOS, React Icons 5.5

**Backend & Infrastructure**
- Framework: NestJS (TypeScript)
- Database: PostgreSQL (with Schema-per-Tenant routing)
- Caching & Queues: Redis
- Deployment: Docker & Docker Compose

---

## ✨ Core Features

### 🏢 Platform & Multi-Tenancy (Backend)
- **Data Isolation:** Dedicated database schema for every tenant/hotel, automatically generated upon registration.
- **Tenant Management:** Manage hotel details, locations, staff roles (admin, manager, receptionist), and room inventory.
- **Smart Booking Engine:** Handles check-ins/outs, dynamic price calculation, and prevents double-booking.
- **Payment & Reviews:** Secure payment tracking (Cash/Card) and a comprehensive review/rating system linked to tenants.
- **Soft Deletion:** All main operational tables support soft-delete to preserve audit logs.

### ✈️ Travel Services & UI (Frontend)
- **All-in-One Booking:** Flights, Hotels, Cars, Tours, Cruises, Activities, and Vacation Rentals.
- **User Dashboard:** Dedicated portal for users to manage bookings, wishlists, and account settings.
- **High Performance:** Optimized bundle sizes, Next.js Image optimization, and SSR for SEO best practices.
- **Multi-language Ready:** Architecture supports seamless switching between English and Arabic.

---

## 🏗️ Architecture & Data Patterns

### CQRS (Command Query Responsibility Segregation)
- **Commands:** Write operations (create/update/delete bookings) are strictly separated.
- **Queries:** Read operations (fetch availability, search flights) use optimized handlers for high-speed retrieval.

### Denormalization
Certain read-heavy models are denormalized to reduce SQL joins and ensure lightning-fast API responses under high concurrent load.

---

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