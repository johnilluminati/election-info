import { useState } from 'react';
import CandidateComparison from "../components/CandidateComparison";
import CongressionalMap from "../components/CongressionalMap";
import { useElections } from "../hooks";
import type { Election } from "../types/api";
import CongressionalMapNav from '../components/CongressionalMapNav';
import { STATE_ABBREVIATION } from '../lib/constants';

const ElectionsSearchPage = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const handleSelection = (districtId?: string, stateName?: string) => {
    if (districtId && stateName) {
      // District selection
      setSelectedDistrict(districtId);
      setSelectedState(stateName);
    } else if (stateName) {
      // State selection only
      setSelectedState(stateName);
      setSelectedDistrict(null);
    }
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
    limit: 50 // Get more elections to display
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

  return (
    <>
      <section className="h-96 lg:h-[620px] overflow-hidden">
        <div className="h-full">
          <div className="flex flex-row justify-center items-center w-full h-[calc(100%-2rem)]">
            <div className="flex flex-col basis-3/4 h-full">
              <CongressionalMapNav 
                onMapSelection={handleSelection} 
                selectedState={selectedState}
                selectedDistrict={selectedDistrict}
              />
              <CongressionalMap onMapSelection={handleSelection} />
            </div>
            <div className="flex basis-1/4 h-full flex-col pl-4">
              <span className="text-2xl font-bold text-center w-full pb-4 border-b">
                <u>Upcoming Elections
                  {selectedDistrict ? ` - District ${selectedDistrict}` : selectedState ? ` - ${selectedState}` : ''}
                </u>
              </span>
              <div className="overflow-y-auto p-4">
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
                    {Object.entries(groupedElections).map(([typeName, elections]) => (
                      <div key={typeName} className="border-b pb-2">
                        <h3 className="font-semibold text-lg">{typeName}</h3>
                        {elections?.map((election) => (
                          <div key={election.id} className="mt-2">
                            <div className="text-sm text-gray-600 mb-1">
                              {election.election_cycle?.election_year} - {election.election_cycle?.election_day}
                            </div>
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
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <CandidateComparison />
    </>
  );
};

export default ElectionsSearchPage;