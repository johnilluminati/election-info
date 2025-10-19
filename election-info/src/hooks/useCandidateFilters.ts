import { useState, useCallback, useMemo } from 'react';

interface CandidateFilters {
  searchQuery: string;
  selectedState: string;
  selectedElectionType: string;
  selectedParty: string;
  sortBy: 'name' | 'state' | 'election_type';
}

interface UseCandidateFiltersReturn {
  filters: CandidateFilters;
  setSearchQuery: (value: string) => void;
  setSelectedState: (value: string) => void;
  setSelectedElectionType: (value: string) => void;
  setSelectedParty: (value: string) => void;
  setSortBy: (value: 'name' | 'state' | 'election_type') => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

export const useCandidateFilters = (): UseCandidateFiltersReturn => {
  const [filters, setFilters] = useState<CandidateFilters>({
    searchQuery: '',
    selectedState: '',
    selectedElectionType: '',
    selectedParty: '',
    sortBy: 'name'
  });

  const setSearchQuery = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, searchQuery: value }));
  }, []);

  const setSelectedState = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, selectedState: value }));
  }, []);

  const setSelectedElectionType = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, selectedElectionType: value }));
  }, []);

  const setSelectedParty = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, selectedParty: value }));
  }, []);

  const setSortBy = useCallback((value: 'name' | 'state' | 'election_type') => {
    setFilters(prev => ({ ...prev, sortBy: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      selectedState: '',
      selectedElectionType: '',
      selectedParty: '',
      sortBy: 'name'
    });
  }, []);

  const hasActiveFilters = useMemo(() => {
    return !!(filters.searchQuery || filters.selectedState || filters.selectedElectionType || filters.selectedParty);
  }, [filters.searchQuery, filters.selectedState, filters.selectedElectionType, filters.selectedParty]);

  return {
    filters,
    setSearchQuery,
    setSelectedState,
    setSelectedElectionType,
    setSelectedParty,
    setSortBy,
    clearFilters,
    hasActiveFilters
  };
};

