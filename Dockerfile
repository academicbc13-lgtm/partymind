# Build stage
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
# Copy the custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy the built React app from the build stage
COPY --from=build /app/dist /usr/share/nginx/html
# Cloud Run expects the container to listen on port 8080
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
