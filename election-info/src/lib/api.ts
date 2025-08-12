import type {
  PaginatedResponse,
  USState,
  USCounty,
  USCity,
  VotingDistrict,
  Election,
  ElectionType,
  ElectionCycle,
  Candidate,
  PoliticalParty,
  CandidateParty,
  ElectionCandidate,
  CandidateKeyIssue,
  ElectionCandidateDonation,
  HealthCheck
} from '../types/api'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: { message?: string }
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      let errorData: { message?: string } = {}
      try {
        errorData = await response.json()
      } catch {
        errorData = { message: response.statusText }
      }
      
      throw new ApiError(
        errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    )
  }
}

// API methods for different endpoints
export const api = {
  // States
  getStates: () => apiRequest<USState[]>('/api/states'),
  getState: (id: string) => apiRequest<USState>(`/api/states/${id}`),
  getStateCounties: (id: string) => apiRequest<USCounty[]>(`/api/states/${id}/counties`),
  getStateCities: (id: string) => apiRequest<USCity[]>(`/api/states/${id}/cities`),
  getStateDistricts: (id: string) => apiRequest<VotingDistrict[]>(`/api/states/${id}/districts`),

  // Counties
  getCounties: (params?: { state_id?: string; page?: number; limit?: number; search?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.state_id) searchParams.append('state_id', params.state_id)
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.search) searchParams.append('search', params.search)
    
    const query = searchParams.toString()
    return apiRequest<PaginatedResponse<USCounty>>(`/api/counties${query ? `?${query}` : ''}`)
  },
  getCounty: (id: string) => apiRequest<USCounty>(`/api/counties/${id}`),

  // Cities
  getCities: (params?: { state_id?: string; page?: number; limit?: number; search?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.state_id) searchParams.append('state_id', params.state_id)
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.search) searchParams.append('search', params.search)
    
    const query = searchParams.toString()
    return apiRequest<PaginatedResponse<USCity>>(`/api/cities${query ? `?${query}` : ''}`)
  },
  getCity: (id: string) => apiRequest<USCity>(`/api/cities/${id}`),

  // Districts
  getDistricts: (params?: { state_id?: string; page?: number; limit?: number; search?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.state_id) searchParams.append('state_id', params.state_id)
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.search) searchParams.append('search', params.search)
    
    const query = searchParams.toString()
    return apiRequest<PaginatedResponse<VotingDistrict>>(`/api/districts${query ? `?${query}` : ''}`)
  },
  getDistrict: (id: string) => apiRequest<VotingDistrict>(`/api/districts/${id}`),

  // Elections
  getElections: (params?: { 
    year?: number; 
    type_id?: string; 
    page?: number; 
    limit?: number;
    geography_type?: string;
    geography_id?: string;
    include_past?: boolean;
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.year) searchParams.append('year', params.year.toString())
    if (params?.type_id) searchParams.append('type_id', params.type_id)
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.geography_type) searchParams.append('geography_type', params.geography_type)
    if (params?.geography_id) searchParams.append('geography_id', params.geography_id)
    if (params?.include_past) searchParams.append('include_past', params.include_past.toString())
    
    const query = searchParams.toString()
    return apiRequest<PaginatedResponse<Election>>(`/api/elections${query ? `?${query}` : ''}`)
  },
  getElection: (id: string) => apiRequest<Election>(`/api/elections/${id}`),
  getElectionCycles: (include_past?: boolean) => {
    const params = include_past ? `?include_past=${include_past}` : '';
    return apiRequest<ElectionCycle[]>(`/api/elections/cycles/all${params}`);
  },
  getElectionTypes: () => apiRequest<ElectionType[]>('/api/elections/types/all'),
  getElectionCandidates: (id: string) => apiRequest<ElectionCandidate[]>(`/api/elections/${id}/candidates`),

  // Candidates
  getCandidates: (params?: { page?: number; limit?: number; search?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.search) searchParams.append('search', params.search)
    
    const query = searchParams.toString()
    return apiRequest<PaginatedResponse<Candidate>>(`/api/candidates${query ? `?${query}` : ''}`)
  },
  getCandidate: (id: string) => apiRequest<Candidate>(`/api/candidates/${id}`),
  getCandidateElections: (id: string) => apiRequest<ElectionCandidate[]>(`/api/candidates/${id}/elections`),
  getCandidateKeyIssues: (id: string, election_id?: string) => {
    const params = election_id ? `?election_id=${election_id}` : ''
    return apiRequest<CandidateKeyIssue[]>(`/api/candidates/${id}/key-issues${params}`)
  },
  getCandidateDonations: (id: string, election_id?: string) => {
    const params = election_id ? `?election_id=${election_id}` : ''
    return apiRequest<ElectionCandidateDonation[]>(`/api/candidates/${id}/donations${params}`)
  },

  // Parties
  getParties: () => apiRequest<PoliticalParty[]>('/api/parties'),
  getParty: (id: string) => apiRequest<PoliticalParty>(`/api/parties/${id}`),
  getPartyCandidates: (id: string) => apiRequest<CandidateParty[]>(`/api/parties/${id}/candidates`),

  // Health check
  getHealth: () => apiRequest<HealthCheck>('/health'),
}

export { ApiError } 