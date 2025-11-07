FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./ 
RUN npm ci

# Copy Prisma schema and generate client
COPY backend/prisma ./prisma
RUN npx prisma generate

# Copy backend source code
COPY backend/. .

# Install frontend dependencies and build
WORKDIR /app/election-info
COPY election-info/package*.json ./
RUN npm ci
COPY election-info/. .
RUN npm run build

# Return to backend workspace
WORKDIR /app

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const port = process.env.PORT || 3001; require('http').get(`http://localhost:${port}/health`, (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "server.js"]

