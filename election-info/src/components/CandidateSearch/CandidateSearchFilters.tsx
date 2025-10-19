import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaUserTie } from 'react-icons/fa';
import type { USState } from '../../types/api';

interface CandidateSearchFiltersProps {
  // Filter values
  searchQuery: string;
  selectedState: string;
  selectedElectionType: string;
  selectedParty: string;
  sortBy: 'name' | 'state' | 'election_type';
  
  // Filter handlers
  onSearchChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onElectionTypeChange: (value: string) => void;
  onPartyChange: (value: string) => void;
  onSortChange: (value: 'name' | 'state' | 'election_type') => void;
  onClearFilters: () => void;
  
  // Data
  states?: USState[];
  
  // Computed values
  hasActiveFilters: boolean;
}

const CandidateSearchFilters = ({
  searchQuery,
  selectedState,
  selectedElectionType,
  selectedParty,
  sortBy,
  onSearchChange,
  onStateChange,
  onElectionTypeChange,
  onPartyChange,
  onSortChange,
  onClearFilters,
  states,
  hasActiveFilters
}: CandidateSearchFiltersProps) => {
  // Available filter options
  const electionTypes = ['Presidential', 'Senate', 'Gubernatorial', 'Congressional', 'State Legislature', 'Local'];
  const parties = ['Democratic Party', 'Republican Party', 'Independent', 'Green Party', 'Libertarian Party'];

  return (
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
              onChange={(e) => onSearchChange(e.target.value)}
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
              onChange={(e) => onStateChange(e.target.value)}
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
              onChange={(e) => onElectionTypeChange(e.target.value)}
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
              onChange={(e) => onPartyChange(e.target.value)}
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
              onChange={(e) => onSortChange(e.target.value as 'name' | 'state' | 'election_type')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="name">Name</option>
              <option value="state">State</option>
              <option value="election_type">Election Type</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="text-center mt-4">
            <button
              onClick={onClearFilters}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateSearchFilters;

