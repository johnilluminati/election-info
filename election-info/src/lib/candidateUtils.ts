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

