import type { Election } from '../types/api';
import { useElectionCandidates } from '../hooks';
import Candidate from "./Candidate/Candidate";
import { useEffect, useState, useMemo, useRef } from 'react';

interface CandidateComparisonProps {
  selectedElection: Election | null;
  selectedState: string | null;
  selectedDistrict: string | null;
}

const CandidateComparison = ({ selectedElection, selectedState, selectedDistrict }: CandidateComparisonProps) => {
  // Fetch detailed candidate data when an election is selected
  const {
    data: detailedCandidates,
    isLoading: candidatesLoading,
    error: candidatesError
  } = useElectionCandidates(selectedElection?.id || '');

  // State for selected candidates - now supports multiple selection
  const [selectedCandidateIndexes, setSelectedCandidateIndexes] = useState<number[]>([]);

  // Ref for the candidate section to scroll to
  const candidateSectionRef = useRef<HTMLDivElement>(null);

  // Use detailed candidates if available, otherwise fall back to basic data
  const candidates = detailedCandidates || selectedElection?.election_candidates || [];

  // Randomize candidate order to eliminate bias
  const randomizedCandidates = useMemo(() => {
    if (candidates.length <= 2) return candidates;

    // Create a copy and shuffle to avoid mutating the original array
    const shuffled = [...candidates].sort(() => Math.random() - 0.5);
    return shuffled;
  }, [candidates]);

  // Get the currently selected candidates
  const selectedCandidates = selectedCandidateIndexes.map(index => randomizedCandidates[index]);

  // Reset selection when candidates change
  useEffect(() => {
    setSelectedCandidateIndexes([]);
  }, [randomizedCandidates]);

  // Auto-scroll when candidates are selected
  useEffect(() => {
    if (selectedCandidates.length > 0 && candidateSectionRef.current) {
      // Use setTimeout to ensure the DOM has updated with the candidate content
      setTimeout(() => {
        candidateSectionRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [selectedCandidates.length]);

  // Debug logging to see what data we're getting
  useEffect(() => {
    if (selectedElection) {
      console.log('🔍 Selected Election:', selectedElection);
      console.log('🔍 Basic election candidates:', selectedElection.election_candidates);
    }
  }, [selectedElection]);

  useEffect(() => {
    if (detailedCandidates) {
      console.log('🔍 Detailed candidates from API:', detailedCandidates);
      // Log details about each candidate's data
      detailedCandidates.forEach((candidate, index) => {
        console.log(`🔍 Candidate ${index + 1}:`, {
          id: candidate.id,
          name: `${candidate.candidate?.first_name} ${candidate.candidate?.last_name}`,
          keyIssuesCount: candidate.key_issues?.length || 0,
          donationsCount: candidate.donations?.length || 0,
          viewsCount: candidate.candidate?.candidate_views?.length || 0,
          historyCount: candidate.candidate?.candidate_histories?.length || 0,
          keyIssues: candidate.key_issues,
          donations: candidate.donations,
          views: candidate.candidate?.candidate_views,
          history: candidate.candidate?.candidate_histories
        });
      });
    }
  }, [detailedCandidates]);

  // Don't render anything if no election is selected
  if (!selectedElection) {
    return (
      <section>
        <div className="px-4 py-4">
          <div className="text-center text-gray-500 mt-8">
            Select an election from the list above to view candidate comparisons
          </div>
        </div>
      </section>
    );
  }

  // Generate a title for the election
  const getElectionTitle = () => {
    const typeName = selectedElection.election_type?.name || 'Election';
    const geography = selectedDistrict
      ? `District ${selectedDistrict}`
      : selectedState || 'Unknown Location';

    return `${typeName} - ${geography}`;
  };

  const selectCandidate = (candidateIndex: number) => {
    setSelectedCandidateIndexes(prev => {
      const isSelected = prev.includes(candidateIndex);

      if (isSelected) {
        // If clicking the already selected candidate, remove them
        const newSelection = prev.filter(index => index !== candidateIndex);

        // If we removed the first candidate and there's a second, promote the second to first
        if (newSelection.length === 1 && prev[0] === candidateIndex) {
          return [prev[1]];
        }

        return newSelection;
      } else {
        // If we already have 2 candidates selected, replace the second one
        if (prev.length === 2) {
          return [prev[0], candidateIndex];
        } else {
          // Otherwise, add the new candidate to the selection
          return [...prev, candidateIndex];
        }
      }
    });
  };

  return (
    <>
      <section>
        <div className="px-4 py-4">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold">{getElectionTitle()}</h2>
            <p className="text-gray-600">
              {selectedElection.election_cycle?.election_day ?
                new Date(selectedElection.election_cycle.election_day).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) :
                `${selectedElection.election_cycle?.election_year || 'Unknown'}`
              }
            </p>
          </div>

          {candidatesLoading ? (
            <div className="text-center text-blue-600 mt-8">
              Loading candidate details...
            </div>
          ) : candidatesError ? (
            <div className="text-center text-red-500 mt-8">
              Error loading candidate details. Please try again.
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              No candidates found for this election
            </div>
          ) : (
            <div className="flex flex-col space-y-6">
              {/* All Candidate Headers - Always Visible */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 text-center mb-4">
                  Click on candidates to select them for comparison. You can select up to 2 candidates at a time.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {randomizedCandidates.map((electionCandidate, index) => {
                    const candidate = electionCandidate.candidate;
                    const party = electionCandidate.party;
                    const isSelected = selectedCandidateIndexes.includes(index);

                    return (
                      <div
                        key={electionCandidate.id}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-all cursor-pointer ${isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                          : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10'
                          }`}
                        onClick={() => selectCandidate(index)}
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <img
                            src={candidate?.picture_link || "/src/assets/candidate1.png"}
                            alt={`${candidate?.first_name} ${candidate?.last_name}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">
                            {candidate?.first_name} {candidate?.last_name}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {party?.name || 'Independent'}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="text-blue-600 text-xs font-medium">
                            Selected
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Candidate Comparison Area - Shown when candidates are selected */}
              {selectedCandidates.length > 0 && (
                <div ref={candidateSectionRef} className="flex flex-col">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold">
                      {selectedCandidates.length === 1 ? 'Candidate Details' : 'Candidate Comparison'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedCandidates.length === 1
                        ? 'Select another candidate to compare, or click the selected candidate to deselect'
                        : 'Comparing 2 candidates. Select a different candidate to replace the second one, or deselect candidates to remove them.'
                      }
                    </p>
                  </div>

                  {/* Candidate Display Area - Now supports multiple candidates */}
                  <div className="flex flex-col lg:flex-row justify-center">
                    {selectedCandidates.map((electionCandidate, index) => (
                      <div key={electionCandidate.id} className="flex items-start">
                        <div className="max-w-2xl w-full">
                          <Candidate
                            electionCandidate={electionCandidate}
                          />
                        </div>
                        {/* Add vertical divider between candidates on larger screens */}
                        {index === 0 && selectedCandidates.length === 2 && (
                          <div className="hidden lg:block w-px bg-gray-300 dark:bg-gray-600 mx-6 self-stretch" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Initial State Message - Only shown when no candidate is selected */}
              {selectedCandidateIndexes.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg mb-2">
                    Select candidates above to view detailed information and comparisons
                  </div>
                  <p className="text-sm text-gray-400 max-w-md mx-auto">
                    Choose one or two candidates from the list above to see their key issues, views,
                    history, and donation information. Select a second candidate to compare them side by side.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CandidateComparison;