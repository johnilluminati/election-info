import { useMemo, useCallback } from 'react';
import type { ElectionCandidate } from '../types/api';
import { STATE_ABBREVIATION } from '../lib/constants';

interface CandidateGroup {
  group: string;
  candidates: ElectionCandidate[];
  subGroups?: Array<{
    group: string;
    candidates: ElectionCandidate[];
  }>;
}

interface UseCandidateGroupingProps {
  candidates: ElectionCandidate[];
  searchQuery: string;
  selectedState: string;
  selectedElectionType: string;
  selectedParty: string;
  sortBy: 'name' | 'state' | 'election_type';
}

export const useCandidateGrouping = ({
  candidates,
  searchQuery,
  selectedState,
  selectedElectionType,
  selectedParty,
  sortBy
}: UseCandidateGroupingProps) => {
  // Helper function to extract state name from candidate geography data
  const getStateFromCandidate = useCallback((candidate: ElectionCandidate): string => {
    const geographies = candidate.election?.geographies || [];
    const stateGeo = geographies.find(g => g.scope_type === 'STATE');
    return stateGeo?.scope_id || 'Unknown State';
  }, []);

  // Helper function to get district from candidate
  const getDistrictFromCandidate = useCallback((candidate: ElectionCandidate): string => {
    const geographies = candidate.election?.geographies || [];
    const districtGeo = geographies.find(g => g.scope_type === 'DISTRICT');
    return districtGeo?.scope_id || 'At-Large';
  }, []);

  // Create reverse mapping from abbreviation to full state name
  const stateAbbreviationToName = useMemo(() => {
    const reverse: Record<string, string> = {};
    Object.entries(STATE_ABBREVIATION).forEach(([fullName, abbreviation]) => {
      reverse[abbreviation] = fullName;
    });
    return reverse;
  }, []);

  // Helper function to format state display name
  const formatStateDisplayName = useCallback((stateName: string): string => {
    // If it's already a full state name, return as is
    if (STATE_ABBREVIATION[stateName]) {
      return `${stateName} - ${STATE_ABBREVIATION[stateName]}`;
    }
    
    // If it's an abbreviation, convert to full name
    const fullName = stateAbbreviationToName[stateName];
    if (fullName) {
      return `${fullName} - ${stateName}`;
    }
    
    // If we can't determine, return as is
    return stateName;
  }, [stateAbbreviationToName]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(searchQuery || selectedState || selectedElectionType || selectedParty);
  }, [searchQuery, selectedState, selectedElectionType, selectedParty]);

  // Determine grouping strategy based on current filter combinations
  const groupingStrategy = useMemo(() => {
    if (!hasActiveFilters) return 'none';
    
    // Count active filters
    const activeFilterCount = [searchQuery, selectedState, selectedElectionType, selectedParty]
      .filter(Boolean).length;
    
    if (activeFilterCount === 1) {
      // Single filter active
      if (selectedElectionType) {
        // Special handling for Congressional elections - group by state and district
        if (selectedElectionType === 'Congressional') {
          return 'by_state_and_district';
        }
        return 'by_state';
      }
      if (selectedState) return 'by_election_type';
      if (selectedParty) return 'by_election_type';
      if (searchQuery) return 'by_election_type';
    } else if (activeFilterCount === 2) {
      // Two filters active
      if (selectedElectionType && selectedState) {
        // For Congressional with a state, still group by district
        if (selectedElectionType === 'Congressional') {
          return 'by_district';
        }
        return 'by_district';
      }
      if (selectedElectionType && selectedParty) {
        // Special handling for Congressional elections with party filter
        if (selectedElectionType === 'Congressional') {
          return 'by_state_and_district';
        }
        return 'by_state';
      }
      if (selectedState && selectedParty) return 'by_election_type';
      if (searchQuery && selectedElectionType) {
        // Special handling for Congressional elections with search
        if (selectedElectionType === 'Congressional') {
          return 'by_state_and_district';
        }
        return 'by_state';
      }
      if (searchQuery && selectedState) return 'by_election_type';
      if (searchQuery && selectedParty) return 'by_election_type';
    } else if (activeFilterCount >= 3) {
      // Three or more filters active - show in a flat list
      return 'flat_list';
    }
    
    return 'by_election_type'; // Default fallback
  }, [hasActiveFilters, searchQuery, selectedState, selectedElectionType, selectedParty]);

  // Group candidates based on strategy
  const groupedCandidates = useMemo((): CandidateGroup[] => {
    if (groupingStrategy === 'none') {
      return [];
    }
    
    if (groupingStrategy === 'flat_list') {
      // Show all candidates in a single group when multiple filters are active
      return [{ group: 'All Candidates', candidates }];
    }
    
    if (groupingStrategy === 'by_state_and_district') {
      // Group by state first, then by district within each state
      // This creates a hierarchical structure
      const stateGroups: Record<string, Record<string, typeof candidates>> = {};
      
      candidates.forEach(candidate => {
        const state = getStateFromCandidate(candidate);
        const district = getDistrictFromCandidate(candidate);
        
        if (!stateGroups[state]) {
          stateGroups[state] = {};
        }
        if (!stateGroups[state][district]) {
          stateGroups[state][district] = [];
        }
        stateGroups[state][district].push(candidate);
      });
      
      // Flatten into a single array with state/district combinations as group names
      const result: CandidateGroup[] = [];
      
      Object.entries(stateGroups)
        .sort(([a], [b]) => {
          const stateA = stateAbbreviationToName[a] || a;
          const stateB = stateAbbreviationToName[b] || b;
          return stateA.localeCompare(stateB);
        })
        .forEach(([state, districts]) => {
          Object.entries(districts)
            .sort(([a], [b]) => {
              // Sort districts numerically if possible
              const numA = parseInt(a);
              const numB = parseInt(b);
              if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB;
              }
              return a.localeCompare(b);
            })
            .forEach(([district, candidates]) => {
              result.push({
                group: `${formatStateDisplayName(state)} - District ${district}`,
                candidates
              });
            });
        });
      
      return result;
    }
    
    if (groupingStrategy === 'by_state') {
      // Group by state using geography data
      const grouped = candidates.reduce((acc, candidate) => {
        const state = getStateFromCandidate(candidate);
        if (!acc[state]) acc[state] = [];
        acc[state].push(candidate);
        return acc;
      }, {} as Record<string, typeof candidates>);
      
      const result = Object.entries(grouped)
        .sort(([a], [b]) => {
          // Sort by the original state name for consistent ordering
          const stateA = stateAbbreviationToName[a] || a;
          const stateB = stateAbbreviationToName[b] || b;
          return stateA.localeCompare(stateB);
        })
        .map(([state, candidates]) => ({ 
          group: formatStateDisplayName(state), 
          candidates 
        }));
      
      return result;
    }
    
    if (groupingStrategy === 'by_district') {
      // Group by district when both election type and state are selected
      const grouped = candidates.reduce((acc, candidate) => {
        const district = getDistrictFromCandidate(candidate);
        if (!acc[district]) acc[district] = [];
        acc[district].push(candidate);
        return acc;
      }, {} as Record<string, typeof candidates>);
      
      const result = Object.entries(grouped)
        .sort(([a], [b]) => {
          // Sort districts numerically if possible
          const numA = parseInt(a);
          const numB = parseInt(b);
          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
          }
          return a.localeCompare(b);
        })
        .map(([district, candidates]) => ({ group: `District ${district}`, candidates }));
      
      return result;
    }
    
    // Default: Group by election type
    const electionTypeOrder = ['Presidential', 'Senate', 'Gubernatorial', 'Congressional', 'State Legislature', 'Local'];
    const grouped = candidates.reduce((acc, candidate) => {
      const electionType = candidate.election?.election_type?.name || 'Other';
      if (!acc[electionType]) acc[electionType] = [];
      acc[electionType].push(candidate);
      return acc;
    }, {} as Record<string, typeof candidates>);
    
    // Sort by predefined election type order and create hierarchical structure for Congressional
    const result: CandidateGroup[] = [];
    
    // First, process election types in the predefined order
    electionTypeOrder
      .filter(type => grouped[type])
      .forEach(type => {
        if (type === 'Congressional' && grouped[type]) {
          // For Congressional elections, create subgroups by district
          const districtGroups: Record<string, typeof candidates> = {};
          
          grouped[type].forEach(candidate => {
            const district = getDistrictFromCandidate(candidate);
            const state = getStateFromCandidate(candidate);
            // Create a unique key combining state and district for sorting
            const key = `${state}|${district}`;
            if (!districtGroups[key]) {
              districtGroups[key] = [];
            }
            districtGroups[key].push(candidate);
          });
          
          // Sort districts and create subgroups
          const subGroups = Object.entries(districtGroups)
            .sort(([a], [b]) => {
              const [stateA, districtA] = a.split('|');
              const [stateB, districtB] = b.split('|');
              
              // First sort by state
              const stateCompare = (stateAbbreviationToName[stateA] || stateA).localeCompare(
                stateAbbreviationToName[stateB] || stateB
              );
              if (stateCompare !== 0) return stateCompare;
              
              // Then sort by district numerically if possible
              const numA = parseInt(districtA);
              const numB = parseInt(districtB);
              if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB;
              }
              return districtA.localeCompare(districtB);
            })
            .map(([key, candidates]) => {
              const [state, district] = key.split('|');
              return {
                group: `${formatStateDisplayName(state)} - District ${district}`,
                candidates
              };
            });
          
          result.push({
            group: type,
            candidates: grouped[type], // Keep all candidates for the main group
            subGroups
          });
        } else {
          // For non-Congressional elections, add as-is
          result.push({ group: type, candidates: grouped[type] });
        }
      });
    
    // Then, add any other election types that weren't in the predefined order
    Object.entries(grouped)
      .filter(([type]) => !electionTypeOrder.includes(type))
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([type, candidates]) => {
        result.push({ group: type, candidates });
      });
    
    return result;
  }, [candidates, groupingStrategy, formatStateDisplayName, stateAbbreviationToName, getDistrictFromCandidate, getStateFromCandidate]);

  // Filter and sort candidates within groups
  const processedCandidates = useMemo(() => {
    const result = groupedCandidates.map(group => ({
      ...group,
      candidates: group.candidates.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return `${a.candidate?.first_name} ${a.candidate?.last_name}`
              .localeCompare(`${b.candidate?.first_name} ${b.candidate?.last_name}`);
          case 'state':
            return (a.election?.election_type?.name || '').localeCompare(b.election?.election_type?.name || '');
          case 'election_type':
            return (a.election?.election_type?.name || '').localeCompare(b.election?.election_type?.name || '');
          default:
            return 0;
        }
      })
    }));
    
    return result;
  }, [groupedCandidates, sortBy]);

  return {
    groupingStrategy,
    groupedCandidates: processedCandidates,
    hasActiveFilters
  };
};

