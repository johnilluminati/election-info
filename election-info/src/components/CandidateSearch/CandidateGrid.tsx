import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import type { ElectionCandidate } from '../../types/api';
import CandidateCard from './CandidateCard';
import CongressionalGroup from './CongressionalGroup';

interface CandidateGridProps {
  groups: Array<{
    group: string;
    key?: string;
    candidates: ElectionCandidate[];
    subGroups?: Array<{
      group: string;
      key?: string;
      candidates: ElectionCandidate[];
    }>;
  }>;
  groupingStrategy: string;
  collapsedSections: Set<string>;
  onToggleSection: (sectionName: string) => void;
  onViewDetails: (candidate: ElectionCandidate) => void;
}

const CandidateGrid = ({
  groups,
  collapsedSections,
  onToggleSection,
  onViewDetails
}: CandidateGridProps) => {
  return (
    <div className="space-y-8">
      {groups.map((group) => {
        const hasSubGroups = group.subGroups && group.subGroups.length > 0;
        
        // If this group has subgroups (Congressional), render hierarchically
        if (hasSubGroups) {
          return (
            <CongressionalGroup
              key={group.key || group.group}
              group={group}
              collapsedSections={collapsedSections}
              onToggleSection={onToggleSection}
              onViewDetails={onViewDetails}
            />
          );
        }
        
        // For groups without subgroups, render normally
        const groupKey = group.key || group.group;
        const isCollapsed = collapsedSections.has(groupKey);
        return (
          <div key={groupKey} className="space-y-4">
            {/* Group Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {group.group}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {group.candidates.length} candidate{group.candidates.length !== 1 ? 's' : ''}
                  </p>
                </div>
                {/* Add collapse button for all groups (not just when grouping by state) */}
                <button
                  onClick={() => onToggleSection(groupKey)}
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

            {/* Candidates Grid */}
            {!isCollapsed && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.candidates.map((candidate) => (
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
  );
};

export default CandidateGrid;

