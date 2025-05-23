# Use the official Node.js image as a base
FROM node:22-alpine AS builder

# Define build-time argument
ARG NEXT_PUBLIC_API_BASE_URL

# Set environment variables for runtime
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Build the Next.js application
RUN NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL} npm run build

# Use a minimal image for the runtime
FROM node:22-alpine AS runner

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/out ./out
COPY --from=builder /app/public ./public

# Install only production dependencies
RUN npm install --production

# Install serve package globally
RUN npm install -g serve

# Expose the port Next.js runs on
EXPOSE 3000

# Start the static file server
CMD ["npx", "serve", "-s", "out", "-l", "3000"]
