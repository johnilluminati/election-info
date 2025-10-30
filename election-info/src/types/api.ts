// Base interfaces for API responses
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// State interfaces
export interface USState {
  id: string
  name: string
  fips_code: string
  abbreviation: string
  cities?: USCity[]
  counties?: USCounty[]
  districts?: VotingDistrict[]
  _count?: {
    cities: number
    counties: number
    districts: number
  }
}

export interface USCounty {
  id: string
  us_state_id: string
  name: string
  fips_code: string
  us_state?: {
    id: string
    name: string
    abbreviation: string
  }
  cities?: USCityCounty[]
  districts?: VotingDistrictCounty[]
  _count?: {
    cities: number
    districts: number
  }
}

export interface USCity {
  id: string
  us_state_id: string
  name: string
  fips_code: string
  us_state?: {
    id: string
    name: string
    abbreviation: string
  }
  counties?: USCityCounty[]
  districts?: VotingDistrictCity[]
  _count?: {
    counties: number
    districts: number
  }
}

export interface USCityCounty {
  city_id: string
  county_id: string
  city?: USCity
  county?: USCounty
}

export interface VotingDistrict {
  id: string
  us_state_id: string
  district_code: string
  us_state?: {
    id: string
    name: string
    abbreviation: string
  }
  cities?: VotingDistrictCity[]
  counties?: VotingDistrictCounty[]
  _count?: {
    cities: number
    counties: number
  }
}

export interface VotingDistrictCity {
  district_id: string
  city_id: string
  city?: USCity
  district?: VotingDistrict
}

export interface VotingDistrictCounty {
  district_id: string
  county_id: string
  county?: USCounty
  district?: VotingDistrict
}

// Election interfaces
export interface ElectionType {
  id: string
  name: string
  description?: string
  elections?: Election[]
  _count?: {
    elections: number
  }
}

export interface ElectionCycle {
  id: string
  election_year: number
  election_day: string
  created_on: string
  created_by: string
  updated_on: string
  updated_by?: string
  elections?: Election[]
  _count?: {
    elections: number
  }
}

export interface Election {
  id: string
  election_cycle_id: string
  election_type_id: string
  created_on: string
  created_by: string
  updated_on: string
  updated_by?: string
  election_cycle?: ElectionCycle
  election_type?: ElectionType
  election_candidates?: ElectionCandidate[]
  geographies?: ElectionGeography[]
  _count?: {
    election_candidates: number
    geographies: number
  }
}

export interface ElectionGeography {
  id: string
  election_id: string
  scope_type: 'NATIONAL' | 'STATE' | 'COUNTY' | 'CITY' | 'DISTRICT'
  scope_id: string
  election?: Election
}

// Candidate interfaces
export interface Candidate {
  id: string
  first_name: string
  last_name: string
  nickname?: string
  picture_link?: string
  created_on: string
  created_by: string
  updated_on: string
  updated_by?: string
  candidate_parties?: CandidateParty[]
  candidate_histories?: CandidateHistory[]
  candidate_views?: CandidateView[]
  election_candidates?: ElectionCandidate[]
  _count?: {
    election_candidates: number
    candidate_histories: number
    candidate_views: number
  }
}

export interface PoliticalParty {
  id: string
  name: string
  party_code: string
  created_at: string
  created_by: string
  updated_at: string
  updated_by?: string
  candidate_parties?: CandidateParty[]
  election_candidates?: ElectionCandidate[]
  _count?: {
    candidate_parties: number
    election_candidates: number
  }
}

export interface CandidateParty {
  id: string
  candidate_id: string
  political_party_id: string
  start_date: string
  end_date?: string
  created_on: string
  created_by: string
  updated_on: string
  updated_by?: string
  candidate?: Candidate
  political_party?: PoliticalParty
}

export interface ElectionCandidate {
  id: string
  election_id: string
  candidate_id: string
  party_id: string
  website?: string
  created_on: string
  created_by: string
  updated_on: string
  updated_by?: string
  key_issues?: CandidateKeyIssue[]
  candidate?: Candidate
  election?: Election
  party?: PoliticalParty
  donations?: ElectionCandidateDonation[]
  _count?: {
    key_issues: number
    donations: number
  }
}

export interface CandidateKeyIssue {
  id: string
  election_candidate_id: string
  issue_text: string
  order_of_important: number
  view_text?: string
  created_on: string
  created_by: string
  updated_on: string
  updated_by?: string
  election_candidate?: ElectionCandidate
}

export interface CandidateView {
  id: string
  candidate_id: string
  view_type_id: string
  view_text: string
  created_on: string
  created_by: string
  updated_on: string
  updated_by?: string
  candidate?: Candidate
  view_category?: CandidateViewCategory
}

export interface CandidateVote {
  id: string
  candidate_view_id: string
  bill_title: string
  vote_type: 'FOR' | 'AGAINST' | 'PRESENT' | 'NOT_VOTING'
  vote_date: string
  description?: string
  impact?: string
  stated_reason?: string
  created_on: string
  created_by: string
  updated_on: string
  updated_by?: string
  conflicts?: ConflictOfInterest[]
}

export interface CandidateLegislation {
  id: string
  candidate_view_id: string
  title: string
  status: 'INTRODUCED' | 'PASSED' | 'PENDING' | 'VETOED'
  date: string
  description?: string
  impact?: string
  stated_reason?: string
  created_on: string
  created_by: string
  updated_on: string
  updated_by?: string
  conflicts?: ConflictOfInterest[]
}

export interface ConflictOfInterest {
  id: string
  conflict_type: 'FINANCIAL' | 'PERSONAL' | 'PROFESSIONAL'
  description: string
  impact?: string
  response?: string
  candidate_vote_id?: string
  candidate_legislation_id?: string
  created_on: string
  created_by: string
  updated_on: string
  updated_by?: string
}

export interface Donor {
  name: string
  donor_type: 'INDIVIDUAL' | 'CORPORATION' | 'PAC' | 'UNION' | 'NONPROFIT' | 'OTHER'
  organization_name?: string
  location?: string
  industry?: string
  created_on: string
  created_by: string
  updated_on: string
  updated_by?: string
}

export interface CandidateViewCategory {
  id: string
  title: string
  candidate_views?: CandidateView[]
}

export interface CandidateHistory {
  id: string
  candidate_id: string
  history_text: string
  created_on: string
  created_by: string
  updated_on: string
  updated_by?: string
  candidate?: Candidate
}

export interface ElectionCandidateDonation {
  id: string
  election_candidate_id: string
  donor_name: string
  donation_amount: string // Decimal as string
  created_on: string
  created_by: string
  updated_on: string
  updated_by?: string
  election_candidate?: ElectionCandidate
}

// Health check interface
export interface HealthCheck {
  status: string
  message: string
  timestamp: string
} 