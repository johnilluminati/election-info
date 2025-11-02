import { FaCalendarAlt, FaMapMarkerAlt, FaUserTie } from 'react-icons/fa';
import type { ElectionCandidate } from '../../types/api';
import { STATE_ABBREVIATION } from '../../lib/constants';

interface CandidateCardProps {
  candidate: ElectionCandidate;
  onViewDetails: (candidate: ElectionCandidate) => void;
}

const CandidateCard = ({ candidate, onViewDetails }: CandidateCardProps) => {
  // Helper functions to extract state and district from geographies
  const getStateFromCandidate = (): string => {
    const geographies = candidate.election?.geographies || [];
    const stateGeo = geographies.find(g => g.scope_type === 'STATE');
    if (!stateGeo?.scope_id) return '';
    
    // Convert state abbreviation to full name if needed
    const stateName = stateGeo.scope_id;
    if (STATE_ABBREVIATION[stateName]) {
      return stateName; // Already full name
    }
    
    // Try to find full name from abbreviation
    const fullName = Object.keys(STATE_ABBREVIATION).find(
      name => STATE_ABBREVIATION[name] === stateName
    );
    return fullName || stateName;
  };

  const getDistrictFromCandidate = (): string | null => {
    const geographies = candidate.election?.geographies || [];
    const districtGeo = geographies.find(g => g.scope_type === 'DISTRICT');
    return districtGeo?.scope_id || null;
  };

  const formatElectionDate = (): string => {
    const electionDay = candidate.election?.election_cycle?.election_day;
    if (!electionDay) {
      const year = candidate.election?.election_cycle?.election_year;
      return year ? year.toString() : 'Date TBD';
    }
    
    try {
      const date = new Date(electionDay);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return electionDay;
    }
  };

  const state = getStateFromCandidate();
  const district = getDistrictFromCandidate();
  const electionDate = formatElectionDate();

  // Map election types to position titles (same as CandidateModal)
  const getPositionTitle = (): string => {
    const electionType = candidate.election?.election_type?.name;
    const positionMap: Record<string, string> = {
      'Presidential': 'President of the United States',
      'Senate': 'U.S. Senator',
      'Gubernatorial': 'Governor',
      'Congressional': 'U.S. Representative',
      'State Legislature': 'State Legislator',
      'Local': 'Local Office'
    };
    return positionMap[electionType || ''] || electionType || 'Public Office';
  };

  const positionTitle = getPositionTitle();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
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
            <FaUserTie className="mr-2 flex-shrink-0" />
            <span>Running for {positionTitle}</span>
          </div>
          {state && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
              <span>
                {state}
                {district && ` - District ${district}`}
              </span>
            </div>
          )}
          {electionDate && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <FaCalendarAlt className="mr-2 flex-shrink-0" />
              <span>Election: {electionDate}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="px-6 pb-6">
        <button 
          onClick={() => onViewDetails(candidate)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;

