# The first FROM is now a stage called build-stage
FROM node:20 AS build-stage 

WORKDIR /usr/src/app

# Copy everything except what's in .dockerignore
COPY . .

# Set environment variable for Vite before building
ENV VITE_BACKEND_URL=http://localhost:3000

# Install dependencies
RUN npm ci

# Run tests once (Vitest etc.)
RUN npm run test -- --run

# Build the frontend after tests pass
RUN npm run build


# Final stage: lightweight image to serve the app
FROM nginx:1.25-alpine

# Copy built frontend from build-stage
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
