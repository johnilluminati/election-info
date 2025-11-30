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