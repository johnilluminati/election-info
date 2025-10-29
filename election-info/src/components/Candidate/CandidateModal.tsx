import { useEffect } from 'react';
import { FaTimes, FaExternalLinkAlt } from 'react-icons/fa';
import type { ElectionCandidate } from '../../types/api';
import CandidateInfoTabs from './CandidateInfoTabs';
import CandidateKeyIssuesTab from './CandidateKeyIssuesTab';
import CandidateViewsTab from './CandidateViewsTab';
import CandidateHistoryTab from './CandidateHistoryTab';
import CandidateDonationsTab from './CandidateDonationsTab';

interface CandidateModalProps {
  candidate: ElectionCandidate | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

const CandidateModal = ({ candidate, isOpen, onClose, isLoading = false }: CandidateModalProps) => {
  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Extract candidate positions for context analysis
  const candidateKeyIssues = candidate?.key_issues?.map(issue => 
    `${issue.issue_text} ${issue.view_text || ''}`
  ) || [];
  
  const candidateViews = candidate?.candidate?.candidate_views?.map(view => view.view_text) || [];

  // Create tab data for the modal
  const tabData = candidate ? [
    {
      title: "Key Issues",
      link: "/key_issues",
      component: <CandidateKeyIssuesTab keyIssues={candidate.key_issues} />
    },
    {
      title: "Views",
      link: "/views",
      component: <CandidateViewsTab views={candidate.candidate?.candidate_views} />
    },
    {
      title: "History",
      link: "/history",
      component: <CandidateHistoryTab histories={candidate.candidate?.candidate_histories} />
    },
    {
      title: "Donations",
      link: "/donations",
      component: (
        <CandidateDonationsTab 
          donations={candidate.donations}
          candidateKeyIssues={candidateKeyIssues}
          candidateViews={candidateViews}
        />
      )
    }
  ] : [];

  // Close modal when clicking outside
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Prevent modal content clicks from closing the modal
  const handleModalContentClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  if (!isOpen || !candidate) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray/20 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
        onClick={handleModalContentClick}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
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
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {candidate.candidate?.first_name} {candidate.candidate?.last_name}
                  {candidate.candidate?.nickname && (
                    <span className="text-xl font-normal text-gray-600 dark:text-gray-400 ml-3">
                      "{candidate.candidate.nickname}"
                    </span>
                  )}
                </h2>
                <div className="space-y-1">
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">{candidate.party?.name || 'Independent'}</span>
                    <span className="mx-2">•</span>
                    <span>
                      {(() => {
                        const electionType = candidate.election?.election_type?.name;
                        const geographies = candidate.election?.geographies || [];
                        
                        // Find state geography if available
                        const stateGeo = geographies.find(g => g.scope_type === 'STATE');
                        const stateName = stateGeo?.scope_id || 'Unknown State';
                        
                        // Map election types to position titles
                        const positionMap: Record<string, string> = {
                          'Presidential': 'President of the United States',
                          'Senate': 'U.S. Senator',
                          'Gubernatorial': 'Governor',
                          'Congressional': 'U.S. Representative',
                          'State Legislature': 'State Legislator',
                          'Local': 'Local Office'
                        };
                        
                        const position = positionMap[electionType || ''] || electionType || 'Public Office';
                        
                        return `Running for ${position}${stateGeo ? ` in ${stateName}` : ''}`;
                      })()}
                    </span>
                  </p>
                  {candidate.website && (
                    <a
                      href={candidate.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      <FaExternalLinkAlt className="text-xs" />
                      <span>{candidate.website}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors flex-shrink-0"
              aria-label="Close modal"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="text-blue-600 dark:text-blue-400 text-lg mb-2">
                    Loading candidate details...
                  </div>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Please wait while we fetch the latest information.
                  </p>
                </div>
              </div>
            ) : (
              <CandidateInfoTabs tabs={tabData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateModal;
