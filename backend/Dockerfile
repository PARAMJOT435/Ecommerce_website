FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with npm ci from cache
RUN npm install --legacy-peer-deps

# Copy prisma schema
COPY prisma ./prisma

# Generate Prisma client
RUN npm run prisma:generate

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3001

# Start dev server
CMD ["npm", "run", "dev"]
