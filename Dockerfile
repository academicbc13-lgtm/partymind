# Build stage
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine
WORKDIR /app
# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev
# Copy the built React app from the build stage
COPY --from=build /app/dist ./dist
# Copy the server file
COPY server.js ./
# Cloud Run expects the container to listen on port 8080
EXPOSE 8080
CMD ["npm", "start"]
