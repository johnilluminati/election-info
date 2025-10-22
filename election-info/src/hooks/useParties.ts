import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { PoliticalParty, CandidateParty } from '../types/api'

export const useParties = () => {
  return useQuery<PoliticalParty[]>({
    queryKey: ['parties'],
    queryFn: () => api.getParties(),
  })
}

export const useParty = (id: string) => {
  return useQuery<PoliticalParty>({
    queryKey: ['parties', id],
    queryFn: () => api.getParty(id),
    enabled: !!id,
  })
}

export const usePartyCandidates = (partyId: string) => {
  return useQuery<CandidateParty[]>({
    queryKey: ['parties', partyId, 'candidates'],
    queryFn: () => api.getPartyCandidates(partyId),
    enabled: !!partyId,
  })
}
