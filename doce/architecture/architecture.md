graph LR
    A[Client Request] --> B{Tenant Interceptor}
    B -->|X-Tenant-ID| C[Prisma Manager]
    C --> D[(PostgreSQL: Schema A)]
    C --> E[(PostgreSQL: Schema B)]

    # System Architecture - Booking SaaS

## 1. Overview
This document describes the high-level design and technical decisions for the Booking platform.

## 2. Infrastructure Stack
| Layer          | Technology       | Purpose                        |
|----------------|------------------|--------------------------------|
| **Framework** | NestJS           | Modular backend architecture   |
| **ORM** | Prisma           | Type-safe DB access            |
| **Database** | PostgreSQL       | Relational data with Schemas   |
| **Cache** | Redis            | Tenant config & Session cache  |

## 3. High-Level Flow
The system uses a **Dynamic Tenant Provider**. Every request is intercepted to switch the database context based on the header.

```mermaid
sequenceDiagram
    participant Client
    participant Interceptor
    participant Prisma
    Client->>Interceptor: Request + TenantID
    Interceptor->>Prisma: Set Schema Context
    Prisma->>Client: Response (Isolated Data)