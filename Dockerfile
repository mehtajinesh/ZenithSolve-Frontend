# Stage 1: Dependencies
FROM node:20-slim AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
# Only install production dependencies
RUN npm ci --only=production --omit=dev

# Stage 2: Builder
FROM node:20-slim AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install dev dependencies for build
RUN npm ci

ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Stage 3: Runner (Ultra-minimal production image)
FROM gcr.io/distroless/nodejs20-debian12 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy public folder
COPY --from=builder /app/public ./public

# Copy the standalone build (this includes bundled dependencies)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["server.js"]