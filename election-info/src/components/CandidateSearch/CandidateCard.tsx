import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import type { ElectionCandidate } from '../../types/api';

interface CandidateCardProps {
  candidate: ElectionCandidate;
  onViewDetails: (candidate: ElectionCandidate) => void;
}

const CandidateCard = ({ candidate, onViewDetails }: CandidateCardProps) => {
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

