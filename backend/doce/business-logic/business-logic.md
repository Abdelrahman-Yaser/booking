# 🧠 Business Logic & Workflows

## 1. Overview
This document outlines the core business rules and complex workflows implemented in the Booking system. It serves as a guide for understanding how data transitions between states and how business constraints are enforced.

---

## 2. Tenant-Aware Logic (SaaS Boundary)
Every piece of business logic is **Tenant-Scoped** to ensure strict data isolation.

* **Rule:** A user can only perform actions (Read/Write) on resources (Rooms, Bookings, Customers) that belong to their active `Tenant_ID`.
* **Enforcement:** This is handled at the **Service Layer** using a custom `TenantProvider` that filters all queries before they reach the Prisma engine.

---

## 3. Booking Lifecycle (State Machine)
We implement a strict State Machine to manage the booking process and prevent data inconsistency.

```mermaid
stateDiagram-v2
    [*] --> Pending: User creates request
    Pending --> Confirmed: Payment Success / Manual Approval
    Pending --> Cancelled: Timeout / User Action
    Confirmed --> Completed: Check-out date reached
    Confirmed --> Refunded: Admin Cancellation
    Completed --> [*]
Constraints:
Immutability: A Confirmed booking cannot be deleted; it must be Cancelled or Refunded to maintain audit trails.

Validation: State transitions are managed by a Transition Guard to ensure illegal moves (e.g., Completed -> Cancelled) are blocked at the application level.

4. Availability Engine (The "Double-Booking" Prevention)
To prevent overbooking, the system follows a Check-then-Lock pattern:

Overlap Check: When a booking is requested, the engine queries for any existing Confirmed or Pending bookings for the same Room_ID within the requested [Start_Date, End_Date] range.

Atomic Transaction: The availability check and the creation of the Pending record happen inside a Prisma Interactive Transaction ($transaction) to handle high-concurrency scenarios and avoid Race Conditions.

5. Approval Workflows (RBAC)
As part of our specialized modules (e.g., Vacation or VIP Bookings), we use a multi-level approval flow based on Role-Based Access Control:

Level 1 (Draft): Employee/Guest submits a request.

Level 2 (Pending): Manager is notified. The resource is "Soft-Blocked" in the calendar.

Level 3 (Finalized): HR or Admin approves. The resource status changes to "Occupied".

6. Pricing & Discount Engine
Prices are calculated dynamically using a precise calculation pipeline:

Base Rate: Defined at the Room/Service level.

Tenant Multipliers: Tenants can define seasonal surcharges (e.g., +20% during Summer) or specialized tax rates.

Rounding Logic: All financial calculations use Decimal.js to avoid floating-point inaccuracies.

Storage: Values are converted and stored as Integers (Cents/Smallest currency unit) in PostgreSQL to ensure precision across different locales.