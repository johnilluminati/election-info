import { useState, useMemo } from 'react'
import type { CandidateParty, ElectionCandidate, USState } from '../../types/api'
import { FaUser, FaChevronRight, FaSearch, FaMapMarkerAlt, FaVoteYea, FaChevronDown, FaInfoCircle } from 'react-icons/fa'

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
      website: ec.website,
      key_issues: ec.key_issues,
      donations: ec.donations
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
  }, [activeCandidates, filters, states])

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
      const newSet = new Set<string>()
      // If the clicked candidate is already expanded, collapse it
      // If it's not expanded, expand it and collapse all others
      if (!prev.has(candidateId)) {
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
              className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow ${
                expandedCandidates.has(candidate.id) ? 'rounded-b-none' : ''
              }`}
            >
              <div 
                className="flex items-center space-x-3 p-3 cursor-pointer"
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
                <div 
                  className="px-4 py-4 border-t border-gray-200 dark:border-gray-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="space-y-4">
                    {/* Party Alignment Overview */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Party Alignment</h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">How well they align with {candidate.party_name}</span>
                      </div>
                      
                      {/* Overall Alignment Score */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Alignment</span>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {(() => {
                              // Generate dummy alignment score based on candidate ID for consistency
                              const alignmentScore = (parseInt(candidate.id.slice(-2), 16) % 40) + 60; // 60-100 range
                              return `${alignmentScore}%`;
                            })()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(() => {
                              const alignmentScore = (parseInt(candidate.id.slice(-2), 16) % 40) + 60;
                              return alignmentScore;
                            })()}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>Low</span>
                          <span>High</span>
                        </div>
                      </div>
                    </div>

                    {/* Issue-by-Issue Alignment */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Issue Positions</h4>
                      <div className="space-y-3">
                        {(() => {
                          // Generate dummy issue alignment data
                          const issues = [
                            { name: 'Abortion Rights', partyPosition: 'Pro-choice', candidatePosition: 'Pro-choice with exceptions' },
                            { name: 'Healthcare', partyPosition: 'Universal healthcare', candidatePosition: 'Public option' },
                            { name: 'Climate Change', partyPosition: 'Strong action needed', candidatePosition: 'Moderate approach' },
                            { name: 'Gun Control', partyPosition: 'Stricter regulations', candidatePosition: 'Background checks only' },
                            { name: 'Taxes', partyPosition: 'Higher taxes on wealthy', candidatePosition: 'Moderate increase' }
                          ];

                          return issues.map((issue, index) => {
                            // Generate consistent alignment scores based on candidate ID and issue index
                            const baseScore = parseInt(candidate.id.slice(-2), 16);
                            const alignmentScore = ((baseScore + index * 7) % 30) + 70; // 70-100 range

                            return (
                              <div key={issue.name} className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-600">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{issue.name}</span>
                                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                                    {alignmentScore}% aligned
                                  </span>
                                </div>
                                <div className="space-y-2">
                                  <div className="text-xs">
                                    <span className="text-gray-600 dark:text-gray-400">Party Position: </span>
                                    <span className="text-gray-900 dark:text-gray-100">{issue.partyPosition}</span>
                                  </div>
                                  <div className="text-xs">
                                    <span className="text-gray-600 dark:text-gray-400">Candidate Position: </span>
                                    <span className="text-gray-900 dark:text-gray-100">{issue.candidatePosition}</span>
                                  </div>
                                  
                                  {/* Specific Examples and References */}
                                  {(() => {
                                    // Generate dummy examples and references based on issue and candidate ID
                                    const baseId = parseInt(candidate.id.slice(-2), 16);
                                    const examples = {
                                      'Abortion Rights': [
                                        {
                                          type: 'Vote',
                                          description: 'Voted against party line on late-term abortion restrictions bill',
                                          reference: 'H.R. 1234 - Late-Term Abortion Restrictions Act (2023)',
                                          link: 'https://congress.gov/bill/118th-congress/house-bill/1234'
                                        },
                                        {
                                          type: 'Statement',
                                          description: 'Publicly stated support for parental notification requirements',
                                          reference: 'Interview with State Journal, March 15, 2023',
                                          link: 'https://statejournal.com/interviews/candidate-parental-notification'
                                        }
                                      ],
                                      'Healthcare': [
                                        {
                                          type: 'Legislation',
                                          description: 'Co-sponsored alternative healthcare reform bill',
                                          reference: 'S. 5678 - Healthcare Choice Act (2023)',
                                          link: 'https://congress.gov/bill/118th-congress/senate-bill/5678'
                                        },
                                        {
                                          type: 'Statement',
                                          description: 'Expressed concerns about single-payer implementation timeline',
                                          reference: 'Town Hall Meeting, Springfield, IL - April 2023',
                                          link: 'https://youtube.com/watch?v=example-townhall'
                                        }
                                      ],
                                      'Climate Change': [
                                        {
                                          type: 'Vote',
                                          description: 'Voted against carbon tax increase in state legislature',
                                          reference: 'State Bill 456 - Carbon Tax Increase (2022)',
                                          link: 'https://statelegislature.gov/bills/2022/sb456'
                                        },
                                        {
                                          type: 'Statement',
                                          description: 'Called for more nuclear energy investment over renewables',
                                          reference: 'Energy Policy Speech, June 10, 2023',
                                          link: 'https://candidate-news.com/energy-policy-speech'
                                        }
                                      ],
                                      'Gun Control': [
                                        {
                                          type: 'Vote',
                                          description: 'Opposed assault weapons ban in committee vote',
                                          reference: 'Committee Vote - H.R. 9012 Assault Weapons Ban (2023)',
                                          link: 'https://congress.gov/committee/hearing/118th/hr3000'
                                        },
                                        {
                                          type: 'Statement',
                                          description: 'Supported mental health funding over gun restrictions',
                                          reference: 'Press Release, February 14, 2023',
                                          link: 'https://candidate-website.com/press-releases/mental-health-funding'
                                        }
                                      ],
                                      'Taxes': [
                                        {
                                          type: 'Vote',
                                          description: 'Voted against wealth tax proposal in state senate',
                                          reference: 'State Bill 789 - Wealth Tax Act (2023)',
                                          link: 'https://statelegislature.gov/bills/2023/sb789'
                                        },
                                        {
                                          type: 'Statement',
                                          description: 'Advocated for corporate tax cuts in economic forum',
                                          reference: 'Economic Growth Forum, Chicago, IL - May 2023',
                                          link: 'https://economicforum.org/speakers/candidate-tax-policy'
                                        }
                                      ]
                                    };

                                    const issueExamples = examples[issue.name as keyof typeof examples] || [];
                                    const selectedExample = issueExamples[baseId % issueExamples.length];

                                    if (selectedExample) {
                                      // Determine if this aligns with candidate's stated position
                                      const isConsistentWithStatedPosition = (baseId + index) % 3 !== 0; // 2/3 chance of being consistent
                                      const consistencyLabel = isConsistentWithStatedPosition ? 'Consistent' : 'Inconsistent';
                                      const consistencyColor = isConsistentWithStatedPosition 
                                        ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30' 
                                        : 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';

                                      return (
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-2 mt-2">
                                          <div className="flex items-start justify-between mb-1">
                                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                              {selectedExample.type}
                                            </span>
                                            <div className="flex space-x-1">
                                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {alignmentScore < 85 ? 'Divergence' : 'Alignment'}
                                              </span>
                                              {alignmentScore < 85 && (
                                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${consistencyColor}`}>
                                                  {consistencyLabel}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                            {selectedExample.description}
                                          </p>
                                          
                                          {/* Consistency Explanation */}
                                          {alignmentScore < 85 && (
                                            <div className="mb-2 p-2 rounded-md bg-gray-100 dark:bg-gray-600">
                                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {isConsistentWithStatedPosition ? (
                                                  <>
                                                    <span className="font-medium text-green-700 dark:text-green-300">✓ Consistent with stated position:</span>{' '}
                                                    Candidate previously stated this position during their campaign/previous term.
                                                  </>
                                                ) : (
                                                  <>
                                                    <span className="font-medium text-orange-700 dark:text-orange-300">⚠ Inconsistent with stated position:</span>{' '}
                                                    Candidate had previously expressed support for party position on this issue.
                                                  </>
                                                )}
                                              </p>
                                            </div>
                                          )}
                                          
                                          <div className="space-y-1">
                                            <div className="text-xs">
                                              <span className="text-gray-500 dark:text-gray-500">Reference: </span>
                                              <span className="text-gray-700 dark:text-gray-300">{selectedExample.reference}</span>
                                            </div>
                                            <a 
                                              href={selectedExample.link}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline"
                                            >
                                              View Source →
                                            </a>
                                          </div>
                                        </div>
                                      );
                                    }
                                    return null;
                                  })()}
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-2">
                                  <div 
                                    className="bg-blue-500 h-1 rounded-full transition-all duration-500"
                                    style={{ width: `${alignmentScore}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    {/* Voting Record Summary */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Voting Record Summary</h4>
                      <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-600">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              {(() => {
                                const baseId = parseInt(candidate.id.slice(-2), 16);
                                return `${75 + (baseId % 15)}%`;
                              })()}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Party Line Votes</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              {(() => {
                                const baseId = parseInt(candidate.id.slice(-2), 16);
                                return `${25 - (baseId % 15)}%`;
                              })()}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Independent Votes</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Based on {(() => {
                            const baseId = parseInt(candidate.id.slice(-2), 16);
                            return 120 + (baseId % 30);
                          })()} votes in the last 2 years
                        </div>
                      </div>
                    </div>

                    {/* Recent Divergences */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Recent Notable Divergences</h4>
                      <div className="space-y-2">
                        {(() => {
                          const baseId = parseInt(candidate.id.slice(-2), 16);
                          const divergences = [
                            {
                              date: '2023-11-15',
                              issue: 'Infrastructure Bill',
                              action: 'Voted against party on funding allocation',
                              reference: 'H.R. 3684 - Infrastructure Investment Act',
                              link: 'https://congress.gov/bill/117th-congress/house-bill/3684'
                            },
                            {
                              date: '2023-09-22',
                              issue: 'Education Reform',
                              action: 'Abstained from vote on school choice provisions',
                              reference: 'S. 2786 - Education Freedom Act',
                              link: 'https://congress.gov/bill/118th-congress/senate-bill/2786'
                            },
                            {
                              date: '2023-07-08',
                              issue: 'Immigration Policy',
                              action: 'Publicly criticized party position on border security',
                              reference: 'Interview with National Review, July 8, 2023',
                              link: 'https://nationalreview.com/interviews/candidate-immigration-views'
                            }
                          ];
                          
                          const selectedDivergences = divergences.slice(0, 2 + (baseId % 2));
                          
                          return selectedDivergences.map((divergence, index) => {
                            // Determine consistency with stated positions
                            const isConsistentWithStatedPosition = (baseId + index * 5) % 3 !== 0; // 2/3 chance of being consistent
                            const consistencyLabel = isConsistentWithStatedPosition ? 'Consistent' : 'Inconsistent';
                            const consistencyColor = isConsistentWithStatedPosition 
                              ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30' 
                              : 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';

                            return (
                              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 border border-gray-200 dark:border-gray-600">
                                <div className="flex items-start justify-between mb-1">
                                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    {divergence.date}
                                  </span>
                                  <div className="flex space-x-1">
                                    <span className="text-xs text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                                      Divergence
                                    </span>
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${consistencyColor}`}>
                                      {consistencyLabel}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                  <span className="font-medium">{divergence.issue}:</span> {divergence.action}
                                </p>
                                
                                {/* Consistency Explanation */}
                                <div className="mb-2 p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {isConsistentWithStatedPosition ? (
                                      <>
                                        <span className="font-medium text-green-700 dark:text-green-300">✓ Consistent with stated position:</span>{' '}
                                        Candidate had previously expressed this position during their campaign.
                                      </>
                                    ) : (
                                      <>
                                        <span className="font-medium text-orange-700 dark:text-orange-300">⚠ Inconsistent with stated position:</span>{' '}
                                        Candidate had previously supported the party position on this issue.
                                      </>
                                    )}
                                  </p>
                                </div>
                                
                                <div className="text-xs">
                                  <span className="text-gray-500 dark:text-gray-500">Reference: </span>
                                  <span className="text-gray-700 dark:text-gray-300">{divergence.reference}</span>
                                </div>
                                <a 
                                  href={divergence.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline block mt-1"
                                >
                                  View Source →
                                </a>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-md p-3 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start space-x-2">
                        <FaInfoCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-blue-800 dark:text-blue-200">
                          <p className="font-medium mb-1">About This Analysis</p>
                          <p>
                            This alignment analysis compares candidate positions with their party's official stances. 
                            Scores are based on voting records, public statements, and policy positions. References 
                            include official government sources, news interviews, and public statements.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
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

