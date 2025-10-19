interface CandidateSearchHeaderProps {
  candidateCount: number;
  hasActiveFilters: boolean;
  groupingStrategy: string;
  groupedCandidates: Array<{ group: string; candidates: unknown[]; subGroups?: Array<unknown> }>;
  isUsingCache: boolean;
}

const CandidateSearchHeader = ({
  candidateCount,
  hasActiveFilters,
  groupingStrategy,
  groupedCandidates,
  isUsingCache
}: CandidateSearchHeaderProps) => {
  const getGroupingLabel = () => {
    if (groupingStrategy === 'by_state') return 'State';
    if (groupingStrategy === 'by_district') return 'District';
    if (groupingStrategy === 'by_state_and_district') return 'State & District';
    if (groupingStrategy === 'flat_list') return 'All Candidates';
    if (groupedCandidates.some(g => 'subGroups' in g && Array.isArray(g.subGroups) && g.subGroups.length > 0)) {
      return 'Election Type (Congressional by District)';
    }
    return 'Election Type';
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {hasActiveFilters 
            ? `${candidateCount} Candidate${candidateCount !== 1 ? 's' : ''} Found` 
            : 'Select Filters to Find Candidates'
          }
        </h2>
        {hasActiveFilters && candidateCount > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Grouped by: {getGroupingLabel()}
          </p>
        )}
      </div>
      {hasActiveFilters && candidateCount > 0 && (
        <div className="text-right">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing {candidateCount} candidates
          </span>
          {isUsingCache && (
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              📋 Cached results
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CandidateSearchHeader;

