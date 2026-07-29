# ─── Setup Guide ────────────────────────────────────────────────

## 1. Install missing dependency (Joi for env validation)
```bash
npm install joi
```

## 2. Add seed config to package.json
Add this inside the root `package.json`:

```json
"prisma": {
  "seed": "ts-node src/prisma/seed.ts"
}
```

Then run seed with:
```bash
npx prisma db seed
```

## 3. Full setup sequence
```bash
# Copy env
cp .env.example .env
# Edit DATABASE_URL and JWT_SECRET in .env

# Install all packages
npm install joi

# Run migrations
npx prisma migrate dev --name init

# Seed database
npx prisma db seed

# Start dev server
npm run start:dev
```

## 4. API Endpoints Summary

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/v1/auth/login | Public |
| GET | /api/v1/auth/profile | Authenticated |
| POST | /api/v1/auth/staff/register | Admin/Manager |
| PATCH | /api/v1/auth/change-password | Authenticated |

### Tenants
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/v1/tenants | Public (registration) |
| GET | /api/v1/tenants | Super Admin |
| GET | /api/v1/tenants/:id | Admin+ |
| PATCH | /api/v1/tenants/:id | Admin+ |
| DELETE | /api/v1/tenants/:id | Super Admin |

### Rooms
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/v1/rooms | Admin/Manager |
| GET | /api/v1/rooms | All staff |
| GET | /api/v1/rooms/:id | All staff |
| PATCH | /api/v1/rooms/:id | Admin/Manager |
| PATCH | /api/v1/rooms/:id/status | All staff |
| DELETE | /api/v1/rooms/:id | Admin |

### Bookings
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/v1/bookings | All staff |
| GET | /api/v1/bookings | All staff |
| GET | /api/v1/bookings/summary | All staff |
| GET | /api/v1/bookings/:id | All staff |
| PATCH | /api/v1/bookings/:id | All staff |
| PATCH | /api/v1/bookings/:id/status | All staff |
| PATCH | /api/v1/bookings/:id/cancel | All staff |
| DELETE | /api/v1/bookings/:id | Admin/Manager |

### Payments
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/v1/payments | All staff |
| GET | /api/v1/payments | All staff |
| GET | /api/v1/payments/revenue | Admin/Manager |
| GET | /api/v1/payments/:id | All staff |
| PATCH | /api/v1/payments/:id/refund | Admin/Manager |

### Analytics
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/v1/analytics/dashboard | Admin/Manager |
| GET | /api/v1/analytics/revenue?year=2025 | Admin/Manager |
| GET | /api/v1/analytics/occupancy?year=2025 | Admin/Manager |
| GET | /api/v1/analytics/top-rooms | Admin/Manager |

### Customers & Reviews
Similar CRUD patterns — see Swagger at `/api/docs`

## 5. Security Model
- **JWT Auth**: All endpoints except `/auth/login` and `POST /tenants`
- **Tenant Isolation**: TenantGuard prevents cross-tenant data access
- **Role Hierarchy**: SUPER_ADMIN > ADMIN > MANAGER > RECEPTIONIST
- **Soft Delete**: All entities use `isDeleted` flag, never hard deleted
