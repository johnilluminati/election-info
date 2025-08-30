import { useState, useMemo, useEffect, useCallback } from 'react';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaUserTie } from 'react-icons/fa';
import type { ElectionCandidate } from '../types/api';
import { useStates } from '../hooks';

const CandidateSearchPage = () => {
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedElectionType, setSelectedElectionType] = useState<string>('');
  const [selectedParty, setSelectedParty] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'state' | 'election_type'>('name');
  const [candidates, setCandidates] = useState<ElectionCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

     // Fetch states for the filter
   const { data: states } = useStates();

   // Clear cache when page loads to ensure fresh results
   useEffect(() => {
     setSearchCache({});
     setIsUsingCache(false);
     console.log('Cache cleared on page load');
   }, []);

   // Monitor candidates state changes
   useEffect(() => {
     console.log('Candidates state changed:', {
       candidatesLength: candidates.length,
       candidatesType: typeof candidates,
       isArray: Array.isArray(candidates),
       firstCandidate: candidates[0]
     });
   }, [candidates]);

  // Available filter options
  const electionTypes = ['Presidential', 'Senate', 'Gubernatorial', 'Congressional', 'State Legislature', 'Local'];
  const parties = ['Democratic Party', 'Republican Party', 'Independent', 'Green Party', 'Libertarian Party'];

     // Check if any filters are active
   const hasActiveFilters = useMemo(() => {
     return !!(searchQuery || selectedState || selectedElectionType || selectedParty);
   }, [searchQuery, selectedState, selectedElectionType, selectedParty]);

   // Cache for storing search results (limit to 50 entries to prevent memory issues)
   const [searchCache, setSearchCache] = useState<Record<string, ElectionCandidate[]>>({});
   const [isUsingCache, setIsUsingCache] = useState(false);
   
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
   const getCacheKey = useMemo(() => {
     const params = new URLSearchParams();
     if (searchQuery) params.append('search', searchQuery);
     if (selectedState) params.append('state', selectedState);
     if (selectedElectionType) params.append('election_type', selectedElectionType);
     if (selectedParty) params.append('party', selectedParty);
     // Add a reasonable limit to prevent too many results
     params.append('limit', '100');
     return params.toString();
   }, [searchQuery, selectedState, selectedElectionType, selectedParty]);

   // Fetch candidates only when filters change and we don't have cached results
   useEffect(() => {
     // Don't search on page load - only when filters are actively changed
     if (!hasActiveFilters) {
       setCandidates([]);
       return;
     }

     // Check if we have cached results
     if (searchCache[getCacheKey]) {
       console.log('Using cached results for:', getCacheKey);
       setCandidates(searchCache[getCacheKey]);
       setIsUsingCache(true);
       return;
     }
     
     setIsUsingCache(false);

     const fetchCandidates = async () => {
       setIsLoading(true);
       setError(null);
       
       try {
         // Build query parameters
         const params = new URLSearchParams();
         if (searchQuery) params.append('search', searchQuery);
         if (selectedState) params.append('state', selectedState);
         if (selectedElectionType) params.append('election_type', selectedElectionType);
         if (selectedParty) params.append('party', selectedParty);
         // Add a reasonable limit to prevent too many results
         params.append('limit', '100');
         
         // Make API call to fetch candidates
         const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
         const fullUrl = `${API_BASE_URL}/api/candidates?${params.toString()}`;
         console.log('Fetching from URL:', fullUrl);
         console.log('Active filters:', { searchQuery, selectedState, selectedElectionType, selectedParty });
         const response = await fetch(fullUrl);
         
         // Log response details for debugging
         console.log('Response status:', response.status);
         console.log('Response headers:', response.headers);
         
         if (!response.ok) {
           throw new Error(`HTTP ${response.status}: ${response.statusText}`);
         }
         
         // Get response text first to debug JSON parsing
         const responseText = await response.text();
         console.log('Response text:', responseText);
         
         let data;
         try {
           data = JSON.parse(responseText);
         } catch (parseError) {
           console.error('JSON parse error:', parseError);
           console.error('Response text that failed to parse:', responseText);
           const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown parsing error';
           throw new Error(`Invalid JSON response: ${errorMessage}`);
         }
         
         console.log('Parsed data:', data);
         console.log('Raw data.data:', data.data);
         console.log('Data structure check:', {
           hasData: !!data.data,
           dataType: typeof data.data,
           isArray: Array.isArray(data.data),
           dataLength: data.data?.length,
           dataKeys: data.data ? Object.keys(data.data[0] || {}) : 'no data'
         });
         
         // Check for both response formats and log each step
         let candidatesData;
         if (data.data) {
           console.log('data.data exists, length:', data.data.length);
           candidatesData = data.data;
         } else if (data.candidates) {
           console.log('data.candidates exists, length:', data.candidates.length);
           candidatesData = data.candidates;
         } else {
           console.log('Neither data.data nor data.candidates exists');
           console.log('Available keys in data:', Object.keys(data));
           candidatesData = [];
         }
         
         if (candidatesData.length > 0) {
           console.log('First candidate:', candidatesData[0]);
           console.log('Setting candidates to:', candidatesData);
           setCandidates(candidatesData);
           
           // Cache the results
           addToCache(getCacheKey, candidatesData);
         } else {
           console.log('No candidates found, setting empty array');
           setCandidates([]);
           
           // Cache empty results too
           addToCache(getCacheKey, []);
         }
       } catch (err) {
         console.error('Fetch error:', err);
         setError(err instanceof Error ? err.message : 'An error occurred');
         setCandidates([]);
       } finally {
         setIsLoading(false);
       }
     };

     fetchCandidates();
      }, [getCacheKey, hasActiveFilters, searchCache]);

   // Determine grouping strategy based on current filter combinations
   const groupingStrategy = useMemo(() => {
     if (!hasActiveFilters) return 'none';
     
     // Count active filters
     const activeFilterCount = [searchQuery, selectedState, selectedElectionType, selectedParty]
       .filter(Boolean).length;
     
     if (activeFilterCount === 1) {
       // Single filter active
       if (selectedElectionType) return 'by_state';
       if (selectedState) return 'by_election_type';
       if (selectedParty) return 'by_election_type';
       if (searchQuery) return 'by_election_type';
     } else if (activeFilterCount === 2) {
       // Two filters active
       if (selectedElectionType && selectedState) return 'by_district';
       if (selectedElectionType && selectedParty) return 'by_state';
       if (selectedState && selectedParty) return 'by_election_type';
       if (searchQuery && selectedElectionType) return 'by_state';
       if (searchQuery && selectedState) return 'by_election_type';
       if (searchQuery && selectedParty) return 'by_election_type';
     } else if (activeFilterCount >= 3) {
       // Three or more filters active - show in a flat list
       return 'flat_list';
     }
     
     return 'by_election_type'; // Default fallback
   }, [hasActiveFilters, searchQuery, selectedState, selectedElectionType, selectedParty]);

   // Group candidates based on strategy
   const groupedCandidates = useMemo(() => {
     console.log('groupedCandidates useMemo triggered with:', {
       candidatesLength: candidates.length,
       groupingStrategy,
       firstCandidate: candidates[0]
     });
     
     if (groupingStrategy === 'none') {
       return [];
     }
     
     if (groupingStrategy === 'flat_list') {
       // Show all candidates in a single group when multiple filters are active
       return [{ group: 'All Candidates', candidates }];
     }
     
     if (groupingStrategy === 'by_state') {
       // Group by state - for now, we'll use a placeholder since state info isn't directly available
       // This would need to be enhanced when state geography data is available
       const grouped = candidates.reduce((acc, candidate) => {
         const state = 'All States'; // Placeholder - would need to be extracted from geography data
         if (!acc[state]) acc[state] = [];
         acc[state].push(candidate);
         return acc;
       }, {} as Record<string, typeof candidates>);
       
       const result = Object.entries(grouped)
         .map(([state, candidates]) => ({ group: state, candidates }));
       
       console.log('State grouping result:', result);
       return result;
     }
     
     if (groupingStrategy === 'by_district') {
       // Group by district when both election type and state are selected
       const grouped = candidates.reduce((acc, candidate) => {
         const district = candidate.election?.geographies?.[0]?.scope_id || 'Unknown District';
         if (!acc[district]) acc[district] = [];
         acc[district].push(candidate);
         return acc;
       }, {} as Record<string, typeof candidates>);
       
       const result = Object.entries(grouped)
         .sort(([a], [b]) => a.localeCompare(b))
         .map(([district, candidates]) => ({ group: `District ${district}`, candidates }));
       
       console.log('District grouping result:', result);
       return result;
     }
     
     // Default: Group by election type
     const electionTypeOrder = ['Presidential', 'Senate', 'Gubernatorial', 'Congressional', 'State Legislature', 'Local'];
     const grouped = candidates.reduce((acc, candidate) => {
       const electionType = candidate.election?.election_type?.name || 'Other';
       if (!acc[electionType]) acc[electionType] = [];
       acc[electionType].push(candidate);
       return acc;
     }, {} as Record<string, typeof candidates>);
     
     console.log('Election type grouping intermediate:', grouped);
     
     // Sort by predefined election type order
     const result = electionTypeOrder
       .filter(type => grouped[type])
       .map(type => ({ group: type, candidates: grouped[type] }));
     
     console.log('Election type grouping result:', result);
     return result;
   }, [candidates, groupingStrategy]);

   // Filter and sort candidates within groups
   const processedCandidates = useMemo(() => {
     console.log('processedCandidates useMemo triggered with:', {
       groupedCandidatesLength: groupedCandidates.length,
       groupedCandidates,
       sortBy
     });
     
     const result = groupedCandidates.map(group => ({
       ...group,
       candidates: group.candidates.sort((a, b) => {
         switch (sortBy) {
           case 'name':
             return `${a.candidate?.first_name} ${a.candidate?.last_name}`
               .localeCompare(`${b.candidate?.first_name} ${b.candidate?.last_name}`);
           case 'state':
             return (a.election?.election_type?.name || '').localeCompare(b.election?.election_type?.name || '');
           case 'election_type':
             return (a.election?.election_type?.name || '').localeCompare(b.election?.election_type?.name || '');
           default:
             return 0;
         }
       })
     }));
     
     console.log('Final processedCandidates result:', result);
     return result;
   }, [groupedCandidates, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {/* State Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FaMapMarkerAlt className="inline mr-2" />
                State
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">All States</option>
                {states?.map(state => (
                  <option key={state.id} value={state.name}>{state.name}</option>
                ))}
              </select>
            </div>

            {/* Election Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FaCalendarAlt className="inline mr-2" />
                Election Type
              </label>
              <select
                value={selectedElectionType}
                onChange={(e) => setSelectedElectionType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Types</option>
                {electionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Party Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FaUserTie className="inline mr-2" />
                Party
              </label>
              <select
                value={selectedParty}
                onChange={(e) => setSelectedParty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Parties</option>
                {parties.map(party => (
                  <option key={party} value={party}>{party}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'state' | 'election_type')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="name">Name</option>
                <option value="state">State</option>
                <option value="election_type">Election Type</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchQuery || selectedState || selectedElectionType || selectedParty) && (
            <div className="text-center mt-4">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedState('');
                  setSelectedElectionType('');
                  setSelectedParty('');
                }}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-8">
                 {/* Results Header */}
         <div className="flex justify-between items-center mb-6">
           <div>
             <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
               {hasActiveFilters ? `${candidates.length} Candidate${candidates.length !== 1 ? 's' : ''} Found` : 'Select Filters to Find Candidates'}
             </h2>
             {hasActiveFilters && candidates.length > 0 && (
               <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                 Grouped by: {
                   groupingStrategy === 'by_state' ? 'State' :
                   groupingStrategy === 'by_district' ? 'District' :
                   groupingStrategy === 'flat_list' ? 'All Candidates' :
                   'Election Type'
                 }
               </p>
             )}
           </div>
                        {hasActiveFilters && candidates.length > 0 && (
               <div className="text-right">
                 <span className="text-sm text-gray-500 dark:text-gray-400">
                   Showing {candidates.length} candidates
                 </span>
                 {isUsingCache && (
                   <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                     📋 Cached results
                   </div>
                 )}
               </div>
             )}
         </div>

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

         {!isLoading && !error && hasActiveFilters && candidates.length > 0 && (
           <div className="space-y-8">
             {processedCandidates.map((group) => (
               <div key={group.group} className="space-y-4">
                 {/* Group Header */}
                 <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                   <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                     {group.group}
                   </h3>
                   <p className="text-sm text-gray-600 dark:text-gray-400">
                     {group.candidates.length} candidate{group.candidates.length !== 1 ? 's' : ''}
                   </p>
                 </div>

                 {/* Candidates Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {group.candidates.map((candidate) => (
                     <div
                       key={candidate.id}
                       className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 overflow-hidden"
                     >
                       {/* Candidate Header */}
                       <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                         <div className="flex items-center space-x-4">
                           <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                             {candidate.candidate?.picture_link ? (
                               <img
                                 src={candidate.candidate.picture_link}
                                 alt={`${candidate.candidate.first_name} ${candidate.candidate.last_name}`}
                                 className="w-full h-full rounded-full object-cover"
                               />
                             ) : (
                               <span className="text-2xl text-gray-500 dark:text-gray-400">
                                 {candidate.candidate?.first_name?.[0]}{candidate.candidate?.last_name?.[0]}
                               </span>
                             )}
                           </div>
                           <div className="flex-1">
                             <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                               {candidate.candidate?.first_name} {candidate.candidate?.last_name}
                             </h3>
                             <p className="text-sm text-gray-600 dark:text-gray-400">
                               {candidate.party?.name || 'Independent'}
                             </p>
                           </div>
                         </div>
                       </div>

                       {/* Candidate Details */}
                       <div className="p-6">
                         <div className="space-y-3">
                           <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                             <FaCalendarAlt className="mr-2" />
                             {candidate.election?.election_type?.name} Election
                           </div>
                           <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                             <FaMapMarkerAlt className="mr-2" />
                             {candidate.election?.election_cycle?.election_year || 'Unknown Year'}
                           </div>
                           {candidate.website && (
                             <div className="pt-2">
                               <a
                                 href={candidate.website}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                               >
                                 Visit Website →
                               </a>
                             </div>
                           )}
                         </div>
                       </div>

                       {/* Action Button */}
                       <div className="px-6 pb-6">
                         <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                           View Details
                         </button>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             ))}
           </div>
         )}
      </div>
    </div>
  );
};

export default CandidateSearchPage;