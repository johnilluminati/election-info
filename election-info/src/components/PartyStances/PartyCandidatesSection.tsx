import { useState } from 'react'
import type { CandidateParty, ElectionCandidate } from '../../types/api'
import { FaUser, FaExternalLinkAlt, FaChevronRight } from 'react-icons/fa'

interface PartyCandidatesSectionProps {
  candidates: CandidateParty[]
  electionCandidates?: ElectionCandidate[]
  maxDisplay?: number
}

const PartyCandidatesSection = ({ 
  candidates, 
  electionCandidates, 
  maxDisplay = 5 
}: PartyCandidatesSectionProps) => {
  const [showAll, setShowAll] = useState(false)
  
  // Combine both types of candidates and remove duplicates
  const allCandidates = [
    ...candidates.map(cp => ({
      id: cp.candidate?.id || '',
      name: `${cp.candidate?.first_name || ''} ${cp.candidate?.last_name || ''}`.trim(),
      nickname: cp.candidate?.nickname,
      picture: cp.candidate?.picture_link,
      type: 'member' as const,
      startDate: cp.start_date,
      endDate: cp.end_date
    })),
    ...(electionCandidates || []).map(ec => ({
      id: ec.candidate?.id || '',
      name: `${ec.candidate?.first_name || ''} ${ec.candidate?.last_name || ''}`.trim(),
      nickname: ec.candidate?.nickname,
      picture: ec.candidate?.picture_link,
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
  
  const displayCandidates = showAll ? activeCandidates : activeCandidates.slice(0, maxDisplay)
  const hasMore = activeCandidates.length > maxDisplay
  
  if (activeCandidates.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
        No active candidates at this time
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3">
        {displayCandidates.map((candidate) => (
          <div 
            key={candidate.id}
            className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow"
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
              <div className="flex items-center space-x-2">
                <h5 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {candidate.nickname ? `${candidate.nickname} (${candidate.name})` : candidate.name}
                </h5>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  candidate.type === 'running' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                }`}>
                  {candidate.type === 'running' ? 'Running' : 'Member'}
                </span>
              </div>
              
              {candidate.election && (
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {candidate.election.election_type?.name} - {candidate.election.election_cycle?.election_year}
                </p>
              )}
            </div>
            
            {/* Action Button */}
            <div className="flex-shrink-0">
              {candidate.website ? (
                <a
                  href={candidate.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  title="Visit candidate website"
                >
                  <FaExternalLinkAlt className="w-4 h-4" />
                </a>
              ) : (
                <div className="w-4 h-4"></div>
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
        {activeCandidates.length} active candidate{activeCandidates.length !== 1 ? 's' : ''} 
        {electionCandidates && electionCandidates.length > 0 && (
          <span> • {electionCandidates.length} running in current elections</span>
        )}
      </div>
    </div>
  )
}

export default PartyCandidatesSection
