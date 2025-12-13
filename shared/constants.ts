// State name to abbreviation mapping
export const STATE_ABBREVIATION: Record<string, string> = {
  'Alabama': 'AL',
  'Alaska': 'AK',
  'Arizona': 'AZ',
  'Arkansas': 'AR',
  'California': 'CA',
  'Colorado': 'CO',
  'Connecticut': 'CT',
  'Delaware': 'DE',
  'Florida': 'FL',
  'Georgia': 'GA',
  'Hawaii': 'HI',
  'Idaho': 'ID',
  'Illinois': 'IL',
  'Indiana': 'IN',
  'Iowa': 'IA',
  'Kansas': 'KS',
  'Kentucky': 'KY',
  'Louisiana': 'LA',
  'Maine': 'ME',
  'Maryland': 'MD',
  'Massachusetts': 'MA',
  'Michigan': 'MI',
  'Minnesota': 'MN',
  'Mississippi': 'MS',
  'Missouri': 'MO',
  'Montana': 'MT',
  'Nebraska': 'NE',
  'Nevada': 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  'Ohio': 'OH',
  'Oklahoma': 'OK',
  'Oregon': 'OR',
  'Pennsylvania': 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  'Tennessee': 'TN',
  'Texas': 'TX',
  'Utah': 'UT',
  'Vermont': 'VT',
  'Virginia': 'VA',
  'Washington': 'WA',
  'West Virginia': 'WV',
  'Wisconsin': 'WI',
  'Wyoming': 'WY',
  'District of Columbia': 'DC'
};

// Helper function to get full state name from abbreviation or full name
// Returns the full state name if input is an abbreviation, or returns the input if it's already a full name
export const getFullStateName = (stateInput: string): string => {
  if (!stateInput) return '';
  
  // Check if input is already a full state name
  if (STATE_ABBREVIATION[stateInput]) {
    return stateInput;
  }
  
  // Try to find full name from abbreviation
  const fullName = Object.keys(STATE_ABBREVIATION).find(
    name => STATE_ABBREVIATION[name] === stateInput.toUpperCase()
  );
  
  return fullName || stateInput;
};

// Helper function to get state abbreviation from full name or abbreviation
export const getStateAbbreviation = (stateInput: string): string => {
  if (!stateInput) return '';
  
  // Check if input is already an abbreviation (2 uppercase letters)
  if (/^[A-Z]{2}$/.test(stateInput)) {
    return stateInput;
  }
  
  // Try to find abbreviation from full name
  return STATE_ABBREVIATION[stateInput] || stateInput.toUpperCase();
};

// Helper function to format district code for display
// Converts codes like "AKAL" to "At-Large", and "CA01" to "01"
export const formatDistrictCode = (districtCode: string): string => {
  if (districtCode.endsWith('AL')) {
    return 'At-Large';
  }
  // Extract the numeric part (e.g., "CA01" -> "01", "TX38" -> "38")
  const match = districtCode.match(/\d+$/);
  return match ? match[0] : districtCode;
};

// Helper function to format district code for display with "District" prefix
export const formatDistrictDisplay = (districtCode: string): string => {
  if (districtCode.endsWith('AL')) {
    return 'District At-Large';
  }
  // For non-At-Large districts, include the full code with state abbreviation (e.g., "PA04")
  return `District ${districtCode}`;
};

// Helper function to check if a district code represents an At-Large district
export const isAtLargeDistrict = (districtCode: string | null | undefined): boolean => {
  if (!districtCode) return false;
  return districtCode.endsWith('AL');
};

// Helper function to check if a formatted district display string contains "At-Large"
export const isAtLargeDisplay = (districtDisplay: string): boolean => {
  return districtDisplay.includes('At-Large');
};

// Tooltip content constants
export const TOOLTIP_CONTENT = {
  AT_LARGE_DISTRICT: "An 'At-Large' district means the entire state serves as a single congressional district. This occurs in states with only one representative in the U.S. House of Representatives.",
  PRESENT_VOTE: "A 'Present' vote means the representative was present for the vote but chose not to vote either for or against the bill. This is different from not voting due to absence.",
  PENDING_LEGISLATION: "Legislation with a 'Pending' status is currently under consideration and has not yet been voted on, passed, or vetoed.",
  // Add more tooltip content here as needed
} as const;

/**
 * Maps election type names to position titles for display
 */
export const getPositionTitle = (electionType: string | undefined): string => {
  const positionMap: Record<string, string> = {
    'Presidential': 'President of the United States',
    'Senate': 'U.S. Senator',
    'Gubernatorial': 'Governor',
    'Congressional': 'U.S. Representative',
    'State Legislature': 'State Legislator',
    'Local': 'Local Office'
  };
  
  return positionMap[electionType || ''] || electionType || 'Public Office';
};

/**
 * Formats a current position string from election data
 */
export const formatCurrentPosition = (
  electionType: string | undefined,
  geographies?: Array<{
    scope_type: string;
    scope_id: string;
  }>
): string => {
  const position = getPositionTitle(electionType);
  
  if (!geographies || geographies.length === 0) {
    return position;
  }
  
  const stateGeo = geographies.find(g => g.scope_type === 'STATE');
  const districtGeo = geographies.find(g => g.scope_type === 'DISTRICT');
  
  // Get state name (convert abbreviation to full name if needed)
  let stateName = '';
  if (stateGeo?.scope_id) {
    const stateId = stateGeo.scope_id;
    if (STATE_ABBREVIATION[stateId]) {
      stateName = stateId; // Already full name
    } else {
      // Convert abbreviation to full name
      const fullName = Object.keys(STATE_ABBREVIATION).find(
        name => STATE_ABBREVIATION[name] === stateId
      );
      stateName = fullName || stateId;
    }
  }
  
  // Format based on election type
  if (electionType === 'Presidential') {
    return position;
  }
  
  if (electionType === 'Congressional' && districtGeo?.scope_id) {
    const districtDisplay = formatDistrictCode(districtGeo.scope_id);
    if (stateName) {
      return `${position} for ${stateName}'s ${districtDisplay === 'At-Large' ? 'At-Large District' : `District ${districtDisplay}`}`;
    }
    return `${position} for ${formatDistrictDisplay(districtGeo.scope_id)}`;
  }
  
  if (stateName) {
    return `${position} from ${stateName}`;
  }
  
  return position;
};

