import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import type { ElectionCandidate } from '../../types/api';
import CandidateCard from './CandidateCard';

interface CongressionalGroupProps {
  group: {
    group: string;
    candidates: ElectionCandidate[];
    subGroups?: Array<{
      group: string;
      candidates: ElectionCandidate[];
    }>;
  };
  collapsedSections: Set<string>;
  onToggleSection: (sectionName: string) => void;
  onViewDetails: (candidate: ElectionCandidate) => void;
}

const CongressionalGroup = ({
  group,
  collapsedSections,
  onToggleSection,
  onViewDetails
}: CongressionalGroupProps) => {
  const hasSubGroups = group.subGroups && group.subGroups.length > 0;
  const isCollapsed = collapsedSections.has(group.group);

  if (!hasSubGroups) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Main Group Header (Congressional) */}
      <div className="border-b-2 border-gray-300 dark:border-gray-600 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {group.group}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {group.candidates.length} candidate{group.candidates.length !== 1 ? 's' : ''} across {group.subGroups!.length} district{group.subGroups!.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => onToggleSection(group.group)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
          >
            {isCollapsed ? (
              <FaChevronRight className="w-4 h-4" />
            ) : (
              <FaChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Subgroups (Districts) */}
      {!isCollapsed && (
        <div className="ml-4 space-y-6">
          {group.subGroups!.map((subGroup) => {
            const isSubCollapsed = collapsedSections.has(subGroup.group);
            return (
              <div key={subGroup.group} className="space-y-4">
                {/* Subgroup Header (District) */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {subGroup.group}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {subGroup.candidates.length} candidate{subGroup.candidates.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => onToggleSection(subGroup.group)}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      aria-label={isSubCollapsed ? 'Expand section' : 'Collapse section'}
                    >
                      {isSubCollapsed ? (
                        <FaChevronRight className="w-4 h-4" />
                      ) : (
                        <FaChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* District Candidates Grid */}
                {!isSubCollapsed && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subGroup.candidates.map((candidate) => (
                      <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        onViewDetails={onViewDetails}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CongressionalGroup;

