import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Election, ElectionType, ElectionCycle, ElectionCandidate, PaginatedResponse } from '../types/api'

export const useElections = (params?: { 
  year?: number; 
  type_id?: string; 
  page?: number; 
  limit?: number;
  geography_type?: string;
  geography_id?: string;
}) => {
  return useQuery<PaginatedResponse<Election>>({
    queryKey: ['elections', params],
    queryFn: () => api.getElections(params),
  })
}

export const useElection = (id: string) => {
  return useQuery<Election>({
    queryKey: ['elections', id],
    queryFn: () => api.getElection(id),
    enabled: !!id,
  })
}

export const useElectionCycles = () => {
  return useQuery<ElectionCycle[]>({
    queryKey: ['elections', 'cycles'],
    queryFn: api.getElectionCycles,
  })
}

export const useElectionTypes = () => {
  return useQuery<ElectionType[]>({
    queryKey: ['elections', 'types'],
    queryFn: api.getElectionTypes,
  })
}

export const useElectionCandidates = (electionId: string) => {
  return useQuery<ElectionCandidate[]>({
    queryKey: ['elections', electionId, 'candidates'],
    queryFn: () => api.getElectionCandidates(electionId),
    enabled: !!electionId,
  })
} 