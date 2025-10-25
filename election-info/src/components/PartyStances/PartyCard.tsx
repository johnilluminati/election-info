import type { PoliticalParty } from '../../types/api'

interface PartyCardProps {
  party: PoliticalParty
  onSelect?: (party: PoliticalParty) => void
}

// Party stance information - this would ideally come from a database or CMS
const getPartyStances = (partyCode: string) => {
  const stances: Record<string, { description: string; keyIssues: string[]; color: string }> = {
    'DEM': {
      description: 'The Democratic Party is one of the two major political parties in the United States. Founded in 1828, it generally supports social equality, environmental protection, and government intervention in the economy.',
      keyIssues: [
        'Healthcare access and affordability',
        'Climate change and environmental protection',
        'Social justice and civil rights',
        'Economic equality and worker rights',
        'Education funding and access'
      ],
      color: 'blue'
    },
    'REP': {
      description: 'The Republican Party is one of the two major political parties in the United States. Founded in 1854, it generally supports free markets, limited government, traditional values, and strong national defense.',
      keyIssues: [
        'Free market economics',
        'Limited government intervention',
        'Traditional family values',
        'Strong national defense',
        'Individual liberty and personal responsibility'
      ],
      color: 'red'
    },
    'LIB': {
      description: 'The Libertarian Party advocates for maximum individual liberty and minimal government intervention in both personal and economic matters.',
      keyIssues: [
        'Individual liberty and personal freedom',
        'Free market capitalism',
        'Non-interventionist foreign policy',
        'Civil liberties and privacy rights',
        'Limited government and lower taxes'
      ],
      color: 'yellow'
    },
    'GRN': {
      description: 'The Green Party focuses on environmental protection, social justice, grassroots democracy, and nonviolence.',
      keyIssues: [
        'Environmental protection and sustainability',
        'Social justice and equality',
        'Grassroots democracy',
        'Nonviolence and peace',
        'Community-based economics'
      ],
      color: 'green'
    },
    'IND': {
      description: 'Independent candidates and voters who do not align with any specific political party, often focusing on pragmatic solutions.',
      keyIssues: [
        'Pragmatic policy solutions',
        'Reducing partisan division',
        'Local community focus',
        'Fiscal responsibility',
        'Transparency in government'
      ],
      color: 'gray'
    },
    'REF': {
      description: 'The Reform Party advocates for political reform, fiscal responsibility, and reducing the influence of special interests.',
      keyIssues: [
        'Campaign finance reform',
        'Term limits for elected officials',
        'Balanced budget requirements',
        'Electoral reform',
        'Reducing special interest influence'
      ],
      color: 'purple'
    },
    'CON': {
      description: 'The Constitution Party emphasizes strict adherence to the U.S. Constitution and traditional American values.',
      keyIssues: [
        'Constitutional government',
        'Traditional family values',
        'Pro-life policies',
        'Second Amendment rights',
        'States\' rights and federalism'
      ],
      color: 'indigo'
    },
    'WFP': {
      description: 'The Working Families Party focuses on economic justice, workers\' rights, and progressive social policies.',
      keyIssues: [
        'Workers\' rights and unions',
        'Economic justice and equality',
        'Affordable housing',
        'Progressive taxation',
        'Social safety net programs'
      ],
      color: 'orange'
    }
  }
  
  return stances[partyCode] || {
    description: 'This party represents a unique political perspective in American politics.',
    keyIssues: ['Policy positions vary by candidate'],
    color: 'gray'
  }
}

const PartyCard = ({ party, onSelect }: PartyCardProps) => {
  const stances = getPartyStances(party.party_code)
  
  // Get spectrum position
  const getSpectrumPosition = (partyCode: string): number => {
    const positions: Record<string, number> = {
      'GRN': 15,    // Green Party - Far Left
      'DEM': 25,    // Democratic Party - Left
      'WFP': 20,    // Working Families Party - Left
      'IND': 50,    // Independent - Center
      'LIB': 75,    // Libertarian Party - Right
      'REP': 85,    // Republican Party - Right
      'CON': 90,    // Constitution Party - Far Right
      'REF': 60,    // Reform Party - Center-Right
    }
    return positions[partyCode] || 50
  }
  
  const spectrumPosition = getSpectrumPosition(party.party_code)
  
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string; border: string; accent: string }> = {
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-900 dark:text-blue-100',
        border: 'border-blue-200 dark:border-blue-700',
        accent: 'bg-blue-500'
      },
      red: {
        bg: 'bg-red-50 dark:bg-red-900/20',
        text: 'text-red-900 dark:text-red-100',
        border: 'border-red-200 dark:border-red-700',
        accent: 'bg-red-500'
      },
      yellow: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        text: 'text-yellow-900 dark:text-yellow-100',
        border: 'border-yellow-200 dark:border-yellow-700',
        accent: 'bg-yellow-500'
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-900 dark:text-green-100',
        border: 'border-green-200 dark:border-green-700',
        accent: 'bg-green-500'
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        text: 'text-purple-900 dark:text-purple-100',
        border: 'border-purple-200 dark:border-purple-700',
        accent: 'bg-purple-500'
      },
      indigo: {
        bg: 'bg-indigo-50 dark:bg-indigo-900/20',
        text: 'text-indigo-900 dark:text-indigo-100',
        border: 'border-indigo-200 dark:border-indigo-700',
        accent: 'bg-indigo-500'
      },
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        text: 'text-orange-900 dark:text-orange-100',
        border: 'border-orange-200 dark:border-orange-700',
        accent: 'bg-orange-500'
      },
      gray: {
        bg: 'bg-gray-50 dark:bg-gray-800',
        text: 'text-gray-900 dark:text-gray-100',
        border: 'border-gray-200 dark:border-gray-700',
        accent: 'bg-gray-500'
      }
    }
    
    return colorMap[color] || colorMap.gray
  }
  
  const colors = getColorClasses(stances.color)

  return (
    <div 
      className={`rounded-lg border ${colors.border} ${colors.bg} shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer`}
      onClick={() => onSelect?.(party)}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <div className={`w-3 h-3 rounded-full ${colors.accent}`}></div>
          <h3 className={`text-lg font-bold ${colors.text}`}>
            {party.name}
          </h3>
          <span className={`px-2 py-0.5 text-xs font-medium rounded ${colors.accent} text-white`}>
            {party.party_code}
          </span>
        </div>
        
        {/* Political Spectrum Position */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Position</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {spectrumPosition <= 20 ? 'Far Left' : 
               spectrumPosition <= 40 ? 'Left' : 
               spectrumPosition <= 60 ? 'Center' : 
               spectrumPosition <= 80 ? 'Right' : 'Far Right'}
            </span>
          </div>
          <div className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 w-0.5 h-full bg-white dark:bg-gray-800 border border-gray-400 shadow-sm"
              style={{ left: `${spectrumPosition}%`, transform: 'translateX(-50%)' }}
            ></div>
          </div>
        </div>
        
        <p className={`text-xs leading-relaxed ${colors.text} opacity-90 line-clamp-3`}>
          {stances.description}
        </p>
      </div>
      
      {/* Click indicator */}
      <div className="px-4 pb-3">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Click to learn more
        </div>
      </div>
    </div>
  )
}

export default PartyCard
