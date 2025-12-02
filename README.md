# Election Info

A comprehensive web platform designed to make information about upcoming US elections and candidates easily accessible, helping voters distinguish accurate information from misinformation.

**A proof-of-concept version of the site is now available online: https://election-info.onrender.com/**

*Note: All of the election and candidate data is just dummy data that I'm creating, for the purpose of having data to work with for the frontend.*

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
- Detailed election cycle information- **Side-by-side candidate comparison** for easy evaluation
<img width="1580" height="1170" alt="Image" src="https://github.com/user-attachments/assets/26b625ba-5882-46bf-a22d-4866dd15ebbf" />
<img width="1575" height="1266" alt="Image" src="https://github.com/user-attachments/assets/c04ed743-1375-4c1c-b849-ab7863af8aaa" />

### Candidate Search & Comparison
- Search candidates by name, state, party, or election type
- View comprehensive candidate profiles including:
  - Key issues and policy positions
  - Voting records and legislative history
  - Campaign donations and donor information
  - Professional and personal background
  - Potential conflicts of interest
<img width="1527" height="1425" alt="Image" src="https://github.com/user-attachments/assets/4ddc6a98-4613-4cb6-b392-18ef9438a338" />

### Political Party Information
- View party stances and positions
- Party leadership information
- See candidates by party and see how they align with their party
<img width="1551" height="1275" alt="Image" src="https://github.com/user-attachments/assets/973b4d94-509b-4275-8678-5491123e7cb0" />

### User Experience
- Much emphasis placed on ease of navigation and presenting information in as unbiased a way as possible
- Responsive design for mobile and desktop
- Dark mode support

## Tech Stack

### Frontend
- **React 19**
- **TypeScript**
- **TailwindCSS 4**
- **React Router**
- **TanStack Query (React Query)** - Data synchronization and caching
- **MapLibre GL** - Interactive, vector-based maps for geographic visualization

### Backend
- **Node.js with Express**
- **Prisma ORM**
- **PostgreSQL**

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
