import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Candidate, ElectionCandidate, CandidateKeyIssue, ElectionCandidateDonation, PaginatedResponse } from '../types/api'

export const useCandidates = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery<ElectionCandidate[] | PaginatedResponse<Candidate>>({
    queryKey: ['candidates', params],
    queryFn: () => api.getCandidates(params),
  })
}

export const useCandidate = (id: string) => {
  return useQuery<Candidate>({
    queryKey: ['candidates', id],
    queryFn: () => api.getCandidate(id),
    enabled: !!id,
  })
}

export const useCandidateElections = (candidateId: string) => {
  return useQuery<ElectionCandidate[]>({
    queryKey: ['candidates', candidateId, 'elections'],
    queryFn: () => api.getCandidateElections(candidateId),
    enabled: !!candidateId,
  })
}

export const useCandidateKeyIssues = (candidateId: string, electionId?: string) => {
  return useQuery<CandidateKeyIssue[]>({
    queryKey: ['candidates', candidateId, 'key-issues', electionId],
    queryFn: () => api.getCandidateKeyIssues(candidateId, electionId),
    enabled: !!candidateId,
  })
}

export const useCandidateDonations = (candidateId: string, electionId?: string) => {
  return useQuery<ElectionCandidateDonation[]>({
    queryKey: ['candidates', candidateId, 'donations', electionId],
    queryFn: () => api.getCandidateDonations(candidateId, electionId),
    enabled: !!candidateId,
  })
} 