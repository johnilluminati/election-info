# Election Info Backend API

This is the Express.js backend API for the Election Info application, providing endpoints for managing election data, candidates, states, counties, cities, and voting districts.

## Features

- **RESTful API** with comprehensive endpoints
- **Prisma ORM** for database operations
- **PostgreSQL** database with complex relationships
- **Security middleware** (Helmet, CORS)
- **Request logging** with Morgan
- **Error handling** with global error middleware
- **Pagination** support for large datasets
- **Search functionality** across multiple entities

## API Endpoints

### States
- `GET /api/states` - Get all states
- `GET /api/states/:id` - Get state by ID
- `GET /api/states/:id/counties` - Get counties for a state
- `GET /api/states/:id/cities` - Get cities for a state
- `GET /api/states/:id/districts` - Get voting districts for a state

### Counties
- `GET /api/counties` - Get all counties (with filtering)
- `GET /api/counties/:id` - Get county by ID

### Cities
- `GET /api/cities` - Get all cities (with filtering)
- `GET /api/cities/:id` - Get city by ID

### Districts
- `GET /api/districts` - Get all voting districts (with filtering)
- `GET /api/districts/:id` - Get district by ID

### Elections
- `GET /api/elections` - Get all elections (with filtering)
- `GET /api/elections/:id` - Get election by ID
- `GET /api/elections/cycles/all` - Get all election cycles
- `GET /api/elections/types/all` - Get all election types
- `GET /api/elections/:id/candidates` - Get candidates for an election

### Candidates
- `GET /api/candidates` - Get all candidates (with pagination and search)
- `GET /api/candidates/:id` - Get candidate by ID
- `GET /api/candidates/:id/elections` - Get elections for a candidate
- `GET /api/candidates/:id/key-issues` - Get key issues for a candidate
- `GET /api/candidates/:id/donations` - Get donations for a candidate

### Parties
- `GET /api/parties` - Get all political parties
- `GET /api/parties/:id` - Get party by ID
- `GET /api/parties/:id/candidates` - Get candidates for a party

### Health Check
- `GET /health` - API health check endpoint

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the backend directory with:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/election_info_db"
   PORT=3001
   NODE_ENV=development
   ```

3. **Set up the database:**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   
   # Seed the database (optional)
   npm run seed
   ```

4. **Start the server:**
   ```bash
   # Production
   npm start
   
   # Development (with nodemon)
   npm run dev
   ```

## Development

The server will start on port 3001 by default. You can change this by setting the `PORT` environment variable.

### Database Schema

The application uses Prisma with PostgreSQL and includes models for:
- US States, Counties, Cities
- Voting Districts
- Elections and Election Cycles
- Candidates and Political Parties
- Candidate Key Issues and Views
- Donations and Geography relationships

### Error Handling

The API includes comprehensive error handling:
- 404 errors for missing resources
- Proper HTTP status codes
- Detailed error messages in development
- Global error middleware for unhandled errors

### Query Parameters

Many endpoints support query parameters for filtering and pagination:
- `page` - Page number for pagination
- `limit` - Number of items per page
- `search` - Search term for text-based filtering
- `state_id` - Filter by state
- `year` - Filter elections by year
- `type_id` - Filter elections by type

## API Response Format

All API responses follow a consistent JSON format:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

Error responses:
```json
{
  "error": "Error message",
  "message": "Additional details"
}
``` 