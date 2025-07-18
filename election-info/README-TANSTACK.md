# TanStack Query Setup for Election Info

This document explains how TanStack Query is set up and used in the election-info frontend.

## Setup

### 1. Installation
```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

### 2. Configuration
- **Query Client**: Configured in `src/main.tsx` with optimal settings for the election-info app
- **API Client**: Centralized API functions in `src/lib/api.ts`
- **Custom Hooks**: Reusable hooks in `src/hooks/` directory

### 3. Environment Variables
Create a `.env` file in the frontend directory:
```
VITE_API_URL=http://localhost:3001
```

## Usage

### Basic Query Hook
```tsx
import { useStates } from '../hooks'

function MyComponent() {
  const { data: states, isLoading, error } = useStates()
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      {states?.map(state => (
        <div key={state.id}>{state.name}</div>
      ))}
    </div>
  )
}
```

### Query with Parameters
```tsx
import { useCandidates } from '../hooks'

function CandidateSearch() {
  const { data: candidates } = useCandidates({
    page: 1,
    limit: 20,
    search: 'john'
  })
  
  return (
    <div>
      {candidates?.data?.map(candidate => (
        <div key={candidate.id}>
          {candidate.first_name} {candidate.last_name}
        </div>
      ))}
    </div>
  )
}
```

### Dependent Queries
```tsx
import { useState, useStateCounties } from '../hooks'

function StateDetails({ stateId }: { stateId: string }) {
  const { data: state } = useState(stateId)
  const { data: counties } = useStateCounties(stateId)
  
  return (
    <div>
      <h1>{state?.name}</h1>
      <h2>Counties:</h2>
      {counties?.map(county => (
        <div key={county.id}>{county.name}</div>
      ))}
    </div>
  )
}
```

## Available Hooks

### States
- `useStates()` - Get all states
- `useState(id)` - Get specific state
- `useStateCounties(stateId)` - Get counties for a state
- `useStateCities(stateId)` - Get cities for a state
- `useStateDistricts(stateId)` - Get districts for a state

### Candidates
- `useCandidates(params)` - Get candidates with pagination/search
- `useCandidate(id)` - Get specific candidate
- `useCandidateElections(candidateId)` - Get elections for a candidate
- `useCandidateKeyIssues(candidateId, electionId?)` - Get key issues
- `useCandidateDonations(candidateId, electionId?)` - Get donations

### Elections
- `useElections(params)` - Get elections with filtering
- `useElection(id)` - Get specific election
- `useElectionCycles()` - Get all election cycles
- `useElectionTypes()` - Get all election types
- `useElectionCandidates(electionId)` - Get candidates for an election

## Features

### Automatic Caching
- Queries are cached for 5 minutes (staleTime)
- Cache persists for 10 minutes (gcTime)
- Automatic background refetching

### Error Handling
- Automatic retry for network errors (up to 3 times)
- No retry for 4xx client errors
- Proper error boundaries

### DevTools
- React Query DevTools included in development
- Access via floating button in bottom-right corner
- Monitor queries, cache, and mutations

### Optimizations
- Disabled refetch on window focus
- Smart retry logic
- Query deduplication
- Background updates

## API Response Format

All API responses follow this structure:

```typescript
// Single item
{
  id: "1",
  name: "Alabama",
  // ... other fields
}

// Paginated response
{
  data: [...],
  pagination: {
    page: 1,
    limit: 20,
    total: 100,
    pages: 5
  }
}
```

## Next Steps

1. **Add more hooks** for remaining API endpoints
2. **Implement mutations** for POST/PUT/DELETE operations
3. **Add optimistic updates** for better UX
4. **Implement infinite queries** for large datasets
5. **Add query prefetching** for navigation 