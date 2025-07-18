import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { USState, USCounty, USCity, VotingDistrict } from '../types/api'

export const useStates = () => {
  return useQuery<USState[]>({
    queryKey: ['states'],
    queryFn: api.getStates,
  })
}

export const useState = (id: string) => {
  return useQuery<USState>({
    queryKey: ['states', id],
    queryFn: () => api.getState(id),
    enabled: !!id,
  })
}

export const useStateCounties = (stateId: string) => {
  return useQuery<USCounty[]>({
    queryKey: ['states', stateId, 'counties'],
    queryFn: () => api.getStateCounties(stateId),
    enabled: !!stateId,
  })
}

export const useStateCities = (stateId: string) => {
  return useQuery<USCity[]>({
    queryKey: ['states', stateId, 'cities'],
    queryFn: () => api.getStateCities(stateId),
    enabled: !!stateId,
  })
}

export const useStateDistricts = (stateId: string) => {
  return useQuery<VotingDistrict[]>({
    queryKey: ['states', stateId, 'districts'],
    queryFn: () => api.getStateDistricts(stateId),
    enabled: !!stateId,
  })
} 