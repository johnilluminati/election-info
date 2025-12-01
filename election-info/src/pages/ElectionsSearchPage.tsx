import { useEffect, useRef, useState } from 'react';
import CandidateComparison from "../components/CandidateComparison";
import CongressionalMap from "../components/CongressionalMap/CongressionalMap";
import { useElections } from "../hooks";
import type { Election } from "../types/api";
import CongressionalMapNav from '../components/CongressionalMap/CongressionalMapNav';
import { STATE_ABBREVIATION, formatDistrictDisplay, isAtLargeDistrict, TOOLTIP_CONTENT } from '../lib/constants';
import { InfoTooltip } from '../components/InfoTooltip';

const ElectionsSearchPage = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);
  const [zoomToHome, setZoomToHome] = useState<boolean>(false);
  const listContainerRef = useRef<HTMLDivElement | null>(null);
  const listItemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const [zoomToState, setZoomToState] = useState<string | null>(null);
  const [zoomToDistrict, setZoomToDistrict] = useState<string | null>(null);

  const handleSelection = (districtId?: string, stateName?: string) => {
    if (districtId && stateName) {
      // District selection
      setSelectedDistrict(districtId);
      setSelectedState(stateName);
    } else if (stateName) {
      // State selection only
      setSelectedState(stateName);
      setSelectedDistrict(null);
    } else {
      // Clear all selections (when both are undefined)
      setSelectedState(null);
      setSelectedDistrict(null);
    }
    // Clear selected election when geography changes
    setSelectedElection(null);
  };

  const handleElectionClick = (election: Election) => {
    setSelectedElection(election);
  };

  // Auto-scroll selected election into view and, on small screens, scroll details into view
  useEffect(() => {
    if (selectedElection) {
      const el = listItemRefs.current[selectedElection.id || ''];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
      if (typeof window !== 'undefined' && window.innerWidth < 1024 && detailsRef.current) {
        // Scroll to details but account for header/sticky elements
        const headerOffset = 80; // Approximate header height
        const elementPosition = detailsRef.current.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedElection]);

  const handleZoomToHome = () => {
    setZoomToHome(true);
    // Reset zoom flags after a short delay
    setTimeout(() => setZoomToHome(false), 100);
  };

  const handleZoomToState = (stateName: string) => {
    setZoomToState(stateName);
    // Reset zoom flags after a short delay
    setTimeout(() => setZoomToState(null), 100);
  };

  const handleZoomToDistrict = (districtId: string) => {
    setZoomToDistrict(districtId);
    // Reset zoom flags after a short delay
    setTimeout(() => setZoomToDistrict(null), 100);
  };

  // Determine which geography to use for fetching elections
  let geography_type: 'DISTRICT' | 'STATE' | undefined = undefined;
  let geography_id: string | undefined = undefined;
  
  if (selectedDistrict) {
    geography_type = 'DISTRICT';
    geography_id = selectedDistrict;
  } else if (selectedState) {
    geography_type = 'STATE';
    // Convert state name to abbreviation for the API query
    geography_id = STATE_ABBREVIATION[selectedState];
  }

  const { data: electionsData, isLoading: electionsLoading, error: electionsError } = useElections({
    geography_type,
    geography_id,
    limit: 50, // Get more elections to display
    include_past: false // Only get future elections
  });

  // Handle paginated response structure
  const elections: Election[] = electionsData?.data || [];

  // Group elections by type
  const groupedElections = elections.reduce((acc, election) => {
    const typeName = election.election_type?.name || 'Unknown';
    if (!acc[typeName]) {
      acc[typeName] = [];
    }
    acc[typeName].push(election);
    return acc;
  }, {} as Record<string, Election[]>);

  // Hierarchical order of election types
  const electionTypeOrder = [
    'Presidential',
    'Senate', 
    'Gubernatorial',
    'Congressional',
    'State Legislature',
    'Local'
  ];

  // Sort the grouped elections by hierarchical importance
  const sortedElectionTypes = Object.keys(groupedElections).sort((a, b) => {
    const aIndex = electionTypeOrder.indexOf(a);
    const bIndex = electionTypeOrder.indexOf(b);
    
    // If both types are in our defined order, sort by that order
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    
    // If only one is in our defined order, prioritize it
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    
    // If neither is in our defined order, sort alphabetically
    return a.localeCompare(b);
  });

  return (
    <>
      <section className="min-h-[400px] lg:h-[620px] lg:overflow-hidden">
        <div className="h-full lg:h-full">
          <div className="flex flex-col lg:flex-row justify-center items-stretch w-full lg:h-full">
            <div className="flex flex-col w-full lg:basis-3/4 lg:h-full lg:flex-1 lg:min-h-0">
              <CongressionalMapNav 
                onMapSelection={handleSelection} 
                selectedState={selectedState}
                selectedDistrict={selectedDistrict}
                onZoomToHome={handleZoomToHome}
                onZoomToState={handleZoomToState}
                onZoomToDistrict={handleZoomToDistrict}
              />
              <CongressionalMap 
                onMapSelection={handleSelection}
                zoomToHome={zoomToHome}
                zoomToState={zoomToState}
                zoomToDistrict={zoomToDistrict}
              />
            </div>
            <div className="flex w-full lg:basis-1/4 lg:h-full flex-col lg:pl-4 mt-4 lg:mt-0">
              <div className="text-2xl font-bold text-center w-full pb-4 border-b">
                <u>
                  Upcoming Elections
                  {selectedDistrict ? (
                    <>
                      {' - '}
                      {selectedDistrict}
                      {isAtLargeDistrict(selectedDistrict) && (
                        <span className="inline-flex items-center ml-1" style={{ textDecoration: 'none' }}>
                          <InfoTooltip 
                            content={TOOLTIP_CONTENT.AT_LARGE_DISTRICT}
                            position="bottom"
                          />
                        </span>
                      )}
                    </>
                  ) : selectedState ? (
                    ` - ${selectedState}`
                  ) : (
                    ''
                  )}
                </u>
              </div>
              <div className="overflow-y-auto p-4" ref={listContainerRef}>
                {!selectedDistrict && !selectedState ? (
                  <div className="text-center text-gray-500 mt-8">
                    Select a state or district on the map to view elections
                  </div>
                ) : electionsLoading ? (
                  <div className="text-center text-gray-500 mt-8">
                    Loading elections...
                  </div>
                ) : electionsError ? (
                  <div className="text-center text-red-500 mt-8">
                    Error loading elections. Please try again.
                  </div>
                ) : elections.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    No elections found for this {selectedDistrict ? 'district' : 'state'}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedElectionTypes.map((typeName) => {
                      const elections = groupedElections[typeName];
                      if (!elections || elections.length === 0) return null;
                      
                      return (
                        <div key={typeName} className="border-b pb-2">
                          <h3 className="font-semibold text-lg">{typeName}</h3>
                          {elections?.map((election) => {
                            const isCongressional = typeName === 'Congressional';
                            const districtFromElection = election.geographies?.find(g => g.scope_type === 'DISTRICT')?.scope_id;
                            const shouldShowDistrict = isCongressional && !selectedDistrict;
                            const districtToShow = shouldShowDistrict ? districtFromElection : undefined;
                            const dateText = election.election_cycle?.election_day 
                              ? new Date(election.election_cycle.election_day).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })
                              : `${election.election_cycle?.election_year || 'Unknown'}`;
                            return (
                              <div
                                key={election.id}
                                className="mt-2"
                                ref={(el) => { listItemRefs.current[election.id] = el; }}
                              >
                                <div className="text-sm text-gray-600 mb-1">
                                  {dateText}
                                  {districtToShow && (
                                    <span className="ml-2 text-gray-500 flex items-center gap-1">
                                      {formatDistrictDisplay(districtToShow)}
                                      {isAtLargeDistrict(districtToShow) && (
                                        <InfoTooltip content="An 'At-Large' district means the entire state serves as a single congressional district. This occurs in states with only one representative in the U.S. House of Representatives." />
                                      )}
                                    </span>
                                  )}
                                </div>
                              <button
                                onClick={() => handleElectionClick(election)}
                                className={`w-full text-left p-2 rounded transition-colors ${
                                  selectedElection?.id === election.id 
                                    ? 'bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-400' 
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                              >
                                {election.election_candidates && election.election_candidates.length > 0 ? (
                                  <ul className="list-disc pl-5 mt-1">
                                    {election.election_candidates.map((candidate) => (
                                      <li key={candidate.id}>
                                        {candidate.candidate?.first_name} {candidate.candidate?.last_name}
                                        {candidate.party && ` (${candidate.party.name})`}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <div className="text-sm text-gray-500 italic">No candidates listed</div>
                                )}
                              </button>
                            </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div ref={detailsRef}>
        <CandidateComparison 
          selectedElection={selectedElection}
          selectedState={selectedState}
          selectedDistrict={selectedDistrict}
        />
      </div>
    </>
  );
};

export default ElectionsSearchPage;