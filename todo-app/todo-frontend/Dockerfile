# The first FROM is now a stage called build-stage
FROM node:20 AS build-stage 

WORKDIR /usr/src/app


# Copy everything except what's in .dockerignore
COPY . .

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL


# Install dependencies
RUN npm ci

# Run tests once (Vitest etc.)
RUN npm run test -- --run

# Build the frontend after tests pass
RUN VITE_BACKEND_URL=$VITE_BACKEND_URL npm run build


