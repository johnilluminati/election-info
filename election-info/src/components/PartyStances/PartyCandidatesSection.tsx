import { useState, useMemo } from 'react'
import type { CandidateParty, ElectionCandidate, USState } from '../../types/api'
import { FaUser, FaChevronRight, FaSearch, FaMapMarkerAlt, FaVoteYea, FaChevronDown } from 'react-icons/fa'

interface PartyCandidatesSectionProps {
  candidates: CandidateParty[]
  electionCandidates?: ElectionCandidate[]
  maxDisplay?: number
  states?: USState[]
  selectedPartyName?: string
}

const PartyCandidatesSection = ({ 
  candidates, 
  electionCandidates, 
  maxDisplay = 5,
  states = [],
  selectedPartyName
}: PartyCandidatesSectionProps) => {
  const [showAll, setShowAll] = useState(false)
  const [expandedCandidates, setExpandedCandidates] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState({
    name: '',
    state: '',
    electionType: ''
  })
  
  // Combine both types of candidates and remove duplicates
  const allCandidates = [
    ...candidates.map(cp => ({
      id: cp.candidate?.id || '',
      name: `${cp.candidate?.first_name || ''} ${cp.candidate?.last_name || ''}`.trim(),
      nickname: cp.candidate?.nickname,
      picture: cp.candidate?.picture_link,
      party_name: cp.political_party?.name || selectedPartyName,
      type: 'member' as const,
      startDate: cp.start_date,
      endDate: cp.end_date
    })),
    ...(electionCandidates || []).map(ec => ({
      id: ec.candidate?.id || '',
      name: `${ec.candidate?.first_name || ''} ${ec.candidate?.last_name || ''}`.trim(),
      nickname: ec.candidate?.nickname,
      picture: ec.candidate?.picture_link,
      party_name: ec.party?.name || selectedPartyName,
      type: 'running' as const,
      election: ec.election,
      website: ec.website
    }))
  ]
  
  // Remove duplicates based on candidate ID
  const uniqueCandidates = allCandidates.filter((candidate, index, self) => 
    index === self.findIndex(c => c.id === candidate.id)
  )
  
  // Filter active candidates (no end date or end date in future)
  const activeCandidates = uniqueCandidates.filter(candidate => 
    candidate.type === 'running' || 
    !candidate.endDate || 
    new Date(candidate.endDate) > new Date()
  )

  // Apply filters
  const filteredCandidates = useMemo(() => {
    return activeCandidates.filter(candidate => {
      // Filter by name (case-insensitive search)
      if (filters.name) {
        const searchTerm = filters.name.toLowerCase()
        const fullName = `${candidate.name} ${candidate.nickname || ''}`.toLowerCase()
        if (!fullName.includes(searchTerm)) {
          return false
        }
      }
      
      // Filter by state (only applies to running candidates)
      if (filters.state && candidate.type === 'running' && candidate.election?.geographies) {
        // Get the state abbreviation from the selected state ID
        const selectedState = states?.find(state => state.id === filters.state)
        const stateAbbreviation = selectedState?.abbreviation
        
        const hasStateMatch = candidate.election.geographies.some(geo => 
          geo.scope_type === 'STATE' && geo.scope_id === stateAbbreviation
        )
        if (!hasStateMatch) return false
      }
      
      // Filter by election type (only applies to running candidates)
      if (filters.electionType && candidate.type === 'running' && candidate.election?.election_type?.name !== filters.electionType) {
        return false
      }
      
      return true
    })
  }, [activeCandidates, filters])

  // Get unique filter options
  const filterOptions = useMemo(() => {
    // Hardcoded election types like in CandidateSearchPage
    const electionTypes = ['Presidential', 'Senate', 'Gubernatorial', 'Congressional', 'State Legislature', 'Local']
    
    return {
      states: states || [],
      electionTypes
    }
  }, [states])
  
  const displayCandidates = showAll ? filteredCandidates : filteredCandidates.slice(0, maxDisplay)
  const hasMore = filteredCandidates.length > maxDisplay
  
  const resetFilters = () => {
    setFilters({
      name: '',
      state: '',
      electionType: ''
    })
  }
  
  const toggleCandidateExpansion = (candidateId: string) => {
    setExpandedCandidates(prev => {
      const newSet = new Set(prev)
      if (newSet.has(candidateId)) {
        newSet.delete(candidateId)
      } else {
        newSet.add(candidateId)
      }
      return newSet
    })
  }
  
  const hasActiveFilters = Object.values(filters).some(value => value !== '')
  
  if (activeCandidates.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
        No active candidates at this time
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Filter Controls */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <FaSearch className="text-gray-600 dark:text-gray-400 text-sm" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Filter Candidates
            </span>
            {hasActiveFilters && (
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                {Object.values(filters).filter(v => v !== '').length} active
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Name Search */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search by Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.name}
                onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter candidate name..."
                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 pl-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <FaSearch className="absolute left-2.5 top-2.5 w-3 h-3 text-gray-400" />
            </div>
          </div>
          
          {/* State Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FaMapMarkerAlt className="inline w-3 h-3 mr-1" />
              State
            </label>
            <select
              value={filters.state}
              onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
              className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">All States</option>
              {filterOptions.states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Election Type Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FaVoteYea className="inline w-3 h-3 mr-1" />
              Election Type
            </label>
            <select
              value={filters.electionType}
              onChange={(e) => setFilters(prev => ({ ...prev, electionType: e.target.value }))}
              className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">All Types</option>
              {filterOptions.electionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Showing {filteredCandidates.length} of {activeCandidates.length} candidates
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {displayCandidates.map((candidate, index) => (
          <div key={`candidate-${candidate.id}-${index}`}>
            <div 
              className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow cursor-pointer"
              onClick={() => toggleCandidateExpansion(candidate.id)}
            >
              {/* Candidate Photo */}
              <div className="flex-shrink-0">
                {candidate.picture ? (
                  <img
                    src={candidate.picture}
                    alt={candidate.name}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${candidate.picture ? 'hidden' : ''}`}>
                  <FaUser className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
              </div>
              
              {/* Candidate Info */}
              <div className="flex-1 min-w-0">
                <h5 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {candidate.nickname ? `${candidate.name} (${candidate.nickname})` : candidate.name}
                </h5>
                
                {candidate.type === 'running' && candidate.election && (() => {
                  const stateGeo = candidate.election.geographies?.find(geo => geo.scope_type === 'STATE')
                  
                  // Map election types to proper office names
                  const officeMap: Record<string, string> = {
                    'Presidential': 'President',
                    'Senate': 'Senate',
                    'Gubernatorial': 'Governor',
                    'Congressional': 'Congress',
                    'State Legislature': 'State Legislature',
                    'Local': 'Local Office'
                  }
                  
                  const officeName = officeMap[candidate.election.election_type?.name || ''] || candidate.election.election_type?.name || 'Office'
                  
                  // Special handling for Presidential elections
                  if (candidate.election.election_type?.name === 'Presidential') {
                    return (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        Running for President of the United States
                      </p>
                    )
                  }
                  
                  // For all other elections, show state
                  const stateName = stateGeo ? 
                    states?.find(state => state.id === stateGeo.scope_id)?.name || stateGeo.scope_id : 
                    'Unknown State'
                  
                  return (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      Running for {officeName} in {stateName}
                    </p>
                  )
                })()}
              </div>
              
              {/* Expand/Collapse Button */}
              <div className="flex-shrink-0">
                <div className="text-gray-400">
                  {expandedCandidates.has(candidate.id) ? (
                    <FaChevronDown className="w-4 h-4" />
                  ) : (
                    <FaChevronRight className="w-4 h-4" />
                  )}
                </div>
              </div>
            </div>
            
            {/* Expanded Content */}
            {expandedCandidates.has(candidate.id) && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                {/* Expanded content will go here */}
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  More candidate information will be displayed here...
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Show More/Less Button */}
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full flex items-center justify-center space-x-2 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <span>
            {showAll 
              ? `Show Less` 
              : `Show ${activeCandidates.length - maxDisplay} More Candidates`
            }
          </span>
          <FaChevronRight 
            className={`w-3 h-3 transition-transform ${showAll ? 'rotate-90' : ''}`} 
          />
        </button>
      )}
      
      {/* Summary */}
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2 border-t border-gray-200 dark:border-gray-700">
        {hasActiveFilters ? (
          <>
            {filteredCandidates.length} of {activeCandidates.length} candidates match your filters
            {electionCandidates && electionCandidates.length > 0 && (
              <span> • {electionCandidates.length} running in current elections</span>
            )}
          </>
        ) : (
          <>
            {activeCandidates.length} active candidate{activeCandidates.length !== 1 ? 's' : ''} 
            {electionCandidates && electionCandidates.length > 0 && (
              <span> • {electionCandidates.length} running in current elections</span>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default PartyCandidatesSection

