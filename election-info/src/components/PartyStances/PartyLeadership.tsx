import { FaUser, FaChevronDown, FaChevronUp } from 'react-icons/fa'

interface PartyLeader {
  id: string
  name: string
  title: string
  position: number // 1 = highest, higher numbers = lower in hierarchy
  image?: string
  tenure?: string
  description?: string
}

interface PartyLeadershipProps {
  partyCode: string
  isExpanded?: boolean
  onToggle?: () => void
}

const PartyLeadership = ({ partyCode, isExpanded = false, onToggle }: PartyLeadershipProps) => {
  // Dummy leadership data - in a real app, this would come from the backend
  const getPartyLeadership = (code: string): PartyLeader[] => {
    const leadershipData: Record<string, PartyLeader[]> = {
      'DEM': [
        {
          id: '1',
          name: 'Jaime Harrison',
          title: 'Chair of the Democratic National Committee',
          position: 1,
          tenure: '2021 - Present',
          description: 'Leads the Democratic Party organization and coordinates national strategy'
        },
        {
          id: '2',
          name: 'Kamala Harris',
          title: 'Vice President of the United States',
          position: 2,
          tenure: '2021 - Present',
          description: 'Highest-ranking Democrat in federal government'
        },
        {
          id: '3',
          name: 'Chuck Schumer',
          title: 'Senate Majority Leader',
          position: 3,
          tenure: '2021 - Present',
          description: 'Leads Democrats in the Senate'
        },
        {
          id: '4',
          name: 'Hakeem Jeffries',
          title: 'House Minority Leader',
          position: 4,
          tenure: '2023 - Present',
          description: 'Leads Democrats in the House of Representatives'
        }
      ],
      'REP': [
        {
          id: '5',
          name: 'Michael Whatley',
          title: 'Chair of the Republican National Committee',
          position: 1,
          tenure: '2024 - Present',
          description: 'Leads the Republican Party organization and coordinates national strategy'
        },
        {
          id: '6',
          name: 'Donald Trump',
          title: 'Presumptive Presidential Nominee',
          position: 2,
          tenure: '2024 - Present',
          description: 'Leading Republican candidate for President'
        },
        {
          id: '7',
          name: 'Mitch McConnell',
          title: 'Senate Minority Leader',
          position: 3,
          tenure: '2021 - Present',
          description: 'Leads Republicans in the Senate'
        },
        {
          id: '8',
          name: 'Mike Johnson',
          title: 'Speaker of the House',
          position: 4,
          tenure: '2023 - Present',
          description: 'Leads Republicans in the House of Representatives'
        }
      ],
      'LIB': [
        {
          id: '9',
          name: 'Angela McArdle',
          title: 'Chair of the Libertarian National Committee',
          position: 1,
          tenure: '2022 - Present',
          description: 'Leads the Libertarian Party organization'
        },
        {
          id: '10',
          name: 'Chase Oliver',
          title: 'Presidential Nominee',
          position: 2,
          tenure: '2024 - Present',
          description: 'Libertarian candidate for President'
        }
      ],
      'GRN': [
        {
          id: '11',
          name: 'Gloria Mattera',
          title: 'Co-Chair of the Green Party',
          position: 1,
          tenure: '2020 - Present',
          description: 'Co-leads the Green Party organization'
        },
        {
          id: '12',
          name: 'Jill Stein',
          title: 'Presidential Nominee',
          position: 2,
          tenure: '2024 - Present',
          description: 'Green Party candidate for President'
        }
      ],
      'IND': [
        {
          id: '13',
          name: 'Robert F. Kennedy Jr.',
          title: 'Independent Presidential Candidate',
          position: 1,
          tenure: '2024 - Present',
          description: 'Leading independent candidate for President'
        }
      ],
      'CON': [
        {
          id: '14',
          name: 'Frank Fluckiger',
          title: 'Chair of the Constitution Party',
          position: 1,
          tenure: '2019 - Present',
          description: 'Leads the Constitution Party organization'
        }
      ],
      'REF': [
        {
          id: '15',
          name: 'Nicholas Hensley',
          title: 'Chair of the Reform Party',
          position: 1,
          tenure: '2021 - Present',
          description: 'Leads the Reform Party organization'
        }
      ],
      'WFP': [
        {
          id: '16',
          name: 'Maurice Mitchell',
          title: 'National Director',
          position: 1,
          tenure: '2018 - Present',
          description: 'Leads the Working Families Party'
        }
      ]
    }
    
    return leadershipData[code] || []
  }

  const leaders = getPartyLeadership(partyCode)
  
  if (leaders.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
        No leadership information available
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Party Leadership ({leaders.length})
          </span>
        </div>
        {isExpanded ? (
          <FaChevronUp className="w-3 h-3 text-gray-500 dark:text-gray-400" />
        ) : (
          <FaChevronDown className="w-3 h-3 text-gray-500 dark:text-gray-400" />
        )}
      </button>

      {/* Leadership List */}
      {isExpanded && (
        <div className="space-y-2">
          {leaders.map((leader) => (
            <div 
              key={leader.id}
              className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              {/* Leader Photo */}
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <FaUser className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                {/* Position indicator */}
                <div className="text-center mt-1">
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                    #{leader.position}
                  </span>
                </div>
              </div>
              
              {/* Leader Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {leader.name}
                  </h5>
                </div>
                
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
                  {leader.title}
                </p>
                
                {leader.tenure && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {leader.tenure}
                  </p>
                )}
                
                {leader.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {leader.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PartyLeadership
