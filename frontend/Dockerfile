# --- STAGE 1: Build ---
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN npm run build

# --- STAGE 2: Run ---
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built dist folder from builder
COPY --from=builder /app/dist ./dist

# If you use Prisma, uncomment the next lines to copy migrations/schema
# COPY --from=builder /app/prisma ./prisma
# RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist/main"]