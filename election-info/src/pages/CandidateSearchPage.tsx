import { useState, useEffect, useCallback } from 'react';
import type { ElectionCandidate } from '../types/api';
import { api } from '../lib/api';
import { useStates } from '../hooks';
import { useCandidateFilters } from '../hooks/useCandidateFilters';
import { useCandidateGrouping } from '../hooks/useCandidateGrouping';
import { 
  CandidateSearchFilters, 
  CandidateSearchHeader, 
  CandidateGrid 
} from '../components/CandidateSearch';
import CandidateModal from '../components/Candidate/CandidateModal';

const CandidateSearchPage = () => {
  // Use custom hooks for filters and grouping
  const {
    filters,
    setSearchQuery,
    setSelectedState,
    setSelectedElectionType,
    setSelectedParty,
    clearFilters,
    hasActiveFilters
  } = useCandidateFilters();

  // Fetch states for the filter
  const { data: states } = useStates();

  // Candidates data and loading state
  const [candidates, setCandidates] = useState<ElectionCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state
  const [selectedCandidate, setSelectedCandidate] = useState<ElectionCandidate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  
  // Collapsible sections state
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  // Cache for storing search results (limit to 50 entries to prevent memory issues)
  const [searchCache, setSearchCache] = useState<Record<string, ElectionCandidate[]>>({});
  
  // Manage cache size to prevent memory issues
  const addToCache = useCallback((key: string, data: ElectionCandidate[]) => {
    setSearchCache(prev => {
      const newCache = { ...prev, [key]: data };
      
      // If cache has more than 50 entries, remove oldest ones
      const cacheKeys = Object.keys(newCache);
      if (cacheKeys.length > 50) {
        const keysToRemove = cacheKeys.slice(0, cacheKeys.length - 50);
        const cleanedCache = { ...newCache };
        keysToRemove.forEach(key => delete cleanedCache[key]);
        return cleanedCache;
      }
      
      return newCache;
    });
  }, []);

  // Generate cache key from current filters
  const getCacheKey = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.searchQuery) params.append('search', filters.searchQuery);
    if (filters.selectedState) params.append('state', filters.selectedState);
    if (filters.selectedElectionType) params.append('election_type', filters.selectedElectionType);
    if (filters.selectedParty) params.append('party', filters.selectedParty);
    // Add a reasonable limit to prevent too many results
    params.append('limit', '100');
    return params.toString();
  }, [filters.searchQuery, filters.selectedState, filters.selectedElectionType, filters.selectedParty]);

  // Clear cache when page loads to ensure fresh results
  useEffect(() => {
    setSearchCache({});
  }, []);

  // Fetch candidates only when filters change and we don't have cached results
  useEffect(() => {
    // Don't search on page load - only when filters are actively changed
    if (!hasActiveFilters) {
      setCandidates([]);
      return;
    }

    // Check if we have cached results
    const cacheKey = getCacheKey();
    if (searchCache[cacheKey]) {
      setCandidates(searchCache[cacheKey]);
      return;
    }

    const fetchCandidates = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Use centralized API client
        const data = await api.getCandidates({
          search: filters.searchQuery || undefined,
          state: filters.selectedState || undefined,
          election_type: filters.selectedElectionType || undefined,
          party: filters.selectedParty || undefined,
          limit: 10000
        });
        
        // Handle both array and paginated response formats
        let candidatesData: ElectionCandidate[] = [];
        if (Array.isArray(data)) {
          // Direct array response (ElectionCandidate[])
          candidatesData = data;
        } else if ('data' in data && Array.isArray(data.data)) {
          // Paginated response with data array
          candidatesData = data.data as unknown as ElectionCandidate[];
        } else if ('candidates' in data && Array.isArray(data.candidates)) {
          // Paginated response with candidates array
          candidatesData = data.candidates as unknown as ElectionCandidate[];
        }
        
        if (candidatesData.length > 0) {
          setCandidates(candidatesData);
          
          // Cache the results
          addToCache(cacheKey, candidatesData);
        } else {
          setCandidates([]);
          
          // Cache empty results too
          addToCache(cacheKey, []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setCandidates([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, [hasActiveFilters, searchCache, addToCache, getCacheKey, filters]);

  // Use grouping hook
  const { groupingStrategy, groupedCandidates } = useCandidateGrouping({
    candidates,
    searchQuery: filters.searchQuery,
    selectedState: filters.selectedState,
    selectedElectionType: filters.selectedElectionType,
    selectedParty: filters.selectedParty,
    sortBy: filters.sortBy
  });
  
  // Modal handlers
  const handleViewDetails = useCallback(async (candidate: ElectionCandidate) => {
    try {
      setIsModalLoading(true);
      setIsModalOpen(true);
      
      // Use the candidate data from search results
      setSelectedCandidate(candidate);
      
      // TODO: Fetch detailed candidate information when the detailed API is ready
      // const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      // const response = await fetch(`${API_BASE_URL}/api/candidates/${candidate.candidate?.id}`);
      // ... detailed data fetching logic
      
    } catch {
      setSelectedCandidate(candidate);
    } finally {
      setIsModalLoading(false);
    }
  }, []);
  
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
  }, []);
  
  // Toggle collapsible section
  const toggleSection = useCallback((sectionName: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionName)) {
        newSet.delete(sectionName);
      } else {
        newSet.add(sectionName);
      }
      return newSet;
    });
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Find Candidates
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Search and discover candidates running for office across the United States. 
              Learn about their positions, backgrounds, and key issues.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <CandidateSearchFilters
        searchQuery={filters.searchQuery}
        selectedState={filters.selectedState}
        selectedElectionType={filters.selectedElectionType}
        selectedParty={filters.selectedParty}
        onSearchChange={setSearchQuery}
        onStateChange={setSelectedState}
        onElectionTypeChange={setSelectedElectionType}
        onPartyChange={setSelectedParty}
        onClearFilters={clearFilters}
        states={states}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Results Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        {hasActiveFilters && candidates.length > 0 && <CandidateSearchHeader
          candidateCount={candidates.length}
          hasActiveFilters={hasActiveFilters}
          groupingStrategy={groupingStrategy}
          groupedCandidates={groupedCandidates}
        />}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="text-blue-600 dark:text-blue-400 text-lg mb-2">
              Loading candidates...
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Please wait while we fetch the latest candidate information.
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-600 dark:text-red-400 text-lg mb-2">
              Error loading candidates
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Filters Active */}
        {!isLoading && !error && !hasActiveFilters && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-gray-600 dark:text-gray-400 text-xl mb-3">
                Start Your Search
              </div>
              <p className="text-gray-500 dark:text-gray-500 text-sm leading-relaxed">
                Use the filters above to find candidates. You can search by name, filter by state, 
                election type, or political party to discover who's running for office.
              </p>
            </div>
          </div>
        )}

        {/* No Results Found */}
        {!isLoading && !error && hasActiveFilters && candidates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              No candidates found matching your criteria
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Try adjusting your search terms or filters to find more candidates.
            </p>
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && !error && hasActiveFilters && candidates.length > 0 && (
          <CandidateGrid
            groups={groupedCandidates}
            groupingStrategy={groupingStrategy}
            collapsedSections={collapsedSections}
            onToggleSection={toggleSection}
            onViewDetails={handleViewDetails}
          />
        )}
      </div>
      
      {/* Candidate Modal */}
      <CandidateModal
        candidate={selectedCandidate}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isLoading={isModalLoading}
      />
    </div>
  );
};

export default CandidateSearchPage;