# Election Info

A comprehensive web platform designed to make information about upcoming US elections and candidates easily accessible, helping voters distinguish accurate information from misinformation.

## Mission

Finding reliable information about elections and candidates shouldn't have to be difficult. This platform aims to provide a centralized, easy-to-navigate resource where voters can:

- Discover upcoming elections in their area
- Learn about candidates running for office
- Compare candidates side-by-side
- Understand candidate positions, voting records, and backgrounds
- Make informed voting decisions with confidence

The goal is to cut through the noise and make it simple to find accurate, transparent information about who's running for office, what they stand for, and whether their actions align with their words.

## Features

### Election Search
- Interactive map for exploring elections by state and congressional district
- Filter elections by type (Presidential, Congressional, Senate, Gubernatorial, State Legislature, Local)
- View upcoming elections with candidate information
- Detailed election cycle information

### Candidate Search & Comparison
- Search candidates by name, state, party, or election type
- View comprehensive candidate profiles including:
  - Key issues and policy positions
  - Voting records and legislative history
  - Campaign donations and donor information
  - Professional and personal background
  - Potential conflicts of interest
- **Side-by-side candidate comparison** for easy evaluation

### Interactive Congressional Map
- Visual map interface for selecting states and districts
- Breadcrumb navigation for easy location selection
- District-specific election information

### Political Party Information
- View party stances and positions
- See candidates by party
- Party leadership information

### User Experience
- Much emphasis placed on ease of navigation and presenting information in as unbiased a way as possible
- Responsive design for mobile and desktop
- Dark mode support

## Tech Stack

### Frontend
- **React 19** - Modern UI library for building interactive user interfaces
- **TypeScript** - Type-safe development for improved code quality
- **TailwindCSS 4** - Utility-first CSS framework for rapid styling
- **React Router** - Declarative routing for single-page applications
- **TanStack Query (React Query)** - Powerful data synchronization and caching
- **MapLibre GL** - Interactive, vector-based maps for geographic visualization
- **Vite** - Fast build tool and development server

### Backend
- **Node.js with Express** - Lightweight, flexible REST API server
- **Prisma** - Next-generation ORM with type safety and excellent developer experience
- **PostgreSQL** - Robust relational database for complex data relationships
- **Security Middleware** - Helmet for security headers, CORS for cross-origin handling
- **Request Logging** - Morgan for HTTP request logging

## Project Structure

```
election-info/
├── backend/             # Express.js API server
│   ├── prisma/          # Database schema, migrations, and seed data
│   ├── routes/          # API route handlers for all endpoints
│   └── server.js        # Application entry point
│
└── election-info/       # React frontend application
    ├── src/
    │   ├── components/
    │   │   ├── Candidate/        # Candidate-related components
    │   │   ├── CandidateSearch/  # Candidate search functionality
    │   │   ├── Header/           # Navigation and header components
    │   │   └── ...
    │   ├── pages/       # Page-level components
    │   ├── hooks/       # Custom React hooks for data fetching
    │   ├── lib/         # Utilities, API client, and constants
    │   └── types/       # TypeScript type definitions
    └── public/          # Static assets and map data
```

---

**Note**: This project is designed to be a non-partisan resource for voters. The goal is transparency and accessibility of information, not to promote any particular candidate or political position.
