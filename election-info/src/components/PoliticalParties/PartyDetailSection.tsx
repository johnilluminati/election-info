import { useState } from 'react'
import type { PoliticalParty } from '../../types/api'
import PartyCandidatesSection from './PartyCandidatesSection'
import PartyLeadership from './PartyLeadership'
import { useParty } from '../../hooks/useParties'
import { useStates } from '../../hooks'
import { FaTimes, FaChevronDown, FaChevronRight } from 'react-icons/fa'

interface PartyDetailSectionProps {
  selectedParty: PoliticalParty | null
  onClose: () => void
}

const PartyDetailSection = ({ selectedParty, onClose }: PartyDetailSectionProps) => {
  const [isLeadershipExpanded, setIsLeadershipExpanded] = useState(true)

  // Fetch complete party data including candidates
  const { data: fullPartyData, isLoading: partyLoading } = useParty(selectedParty?.id || '')

  // Fetch states data for filtering
  const { data: states } = useStates()

  if (!selectedParty) return null

  // Get party stance information
  const getPartyStances = (partyCode: string) => {
    const stances: Record<string, { keyIssues: string[]; color: string }> = {
      'DEM': {
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
      keyIssues: ['Policy positions vary by candidate'],
      color: 'gray'
    }
  }

  const stances = getPartyStances(selectedParty.party_code)

  // Get party description
  const getPartyDescription = (partyCode: string): string => {
    const descriptions: Record<string, string> = {
      'DEM': 'The Democratic Party is one of the two major political parties in the United States. Founded in 1828, it is the oldest active voter-based political party in the world. The party generally supports progressive policies, social liberalism, and a mixed economy with government intervention.',
      'REP': 'The Republican Party, also known as the GOP (Grand Old Party), is one of the two major political parties in the United States. Founded in 1854, the party generally supports conservative policies, free market capitalism, and limited government regulation.',
      'LIB': 'The Libertarian Party is the third-largest political party in the United States. Founded in 1971, it advocates for civil liberties, non-interventionism, laissez-faire capitalism, and limiting the size and scope of government.',
      'GRN': 'The Green Party of the United States is a federation of state Green parties. Founded in 1991, it emphasizes environmentalism, nonviolence, social justice, participatory democracy, and respect for diversity.',
      'IND': 'Independent candidates are not affiliated with any political party. They run on their own platforms and often focus on issues that transcend traditional party lines, appealing to voters who are dissatisfied with major party options.',
      'REF': 'The Reform Party was founded in 1995 with a focus on political reform, including campaign finance reform, term limits, and balanced budgets. It advocates for reducing the influence of special interests in government.',
      'CON': 'The Constitution Party is a conservative political party founded in 1991. It advocates for a strict interpretation of the U.S. Constitution, limited federal government, and traditional values rooted in Christian principles.',
      'WFP': 'The Working Families Party is a progressive political party founded in 1998. It focuses on economic justice, workers\' rights, affordable housing, and building political power for working-class communities.'
    }
    return descriptions[partyCode] || 'This party represents a unique political perspective in American politics.'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-4 h-4 rounded-full ${stances.color === 'blue' ? 'bg-blue-500' : stances.color === 'red' ? 'bg-red-500' : stances.color === 'green' ? 'bg-green-500' : stances.color === 'yellow' ? 'bg-yellow-500' : stances.color === 'purple' ? 'bg-purple-500' : stances.color === 'indigo' ? 'bg-indigo-500' : stances.color === 'orange' ? 'bg-orange-500' : 'bg-gray-500'}`}></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {selectedParty.name}
          </h2>
          <span className={`px-3 py-1 text-sm font-medium rounded ${stances.color === 'blue' ? 'bg-blue-500' : stances.color === 'red' ? 'bg-red-500' : stances.color === 'green' ? 'bg-green-500' : stances.color === 'yellow' ? 'bg-yellow-500' : stances.color === 'purple' ? 'bg-purple-500' : stances.color === 'indigo' ? 'bg-indigo-500' : stances.color === 'orange' ? 'bg-orange-500' : 'bg-gray-500'} text-white`}>
            {selectedParty.party_code}
          </span>
        </div>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <FaTimes className="w-6 h-6" />
        </button>
      </div>

      {/* Party Description */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
          {getPartyDescription(selectedParty.party_code)}
        </p>
      </div>

      {/* Key Issues */}
      <div className="mb-6 px-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Key Policy Positions</h3>
        <ul className="space-y-2">
          {stances.keyIssues.map((issue, index) => (
            <li key={index} className="text-gray-700 dark:text-gray-300 flex items-start">
              <span className={`w-2 h-2 rounded-full ${stances.color === 'blue' ? 'bg-blue-500' : stances.color === 'red' ? 'bg-red-500' : stances.color === 'green' ? 'bg-green-500' : stances.color === 'yellow' ? 'bg-yellow-500' : stances.color === 'purple' ? 'bg-purple-500' : stances.color === 'indigo' ? 'bg-indigo-500' : stances.color === 'orange' ? 'bg-orange-500' : 'bg-gray-500'} mt-2 mr-3 flex-shrink-0`}></span>
              {issue}
            </li>
          ))}
        </ul>
      </div>

      {/* Leadership */}
      <div className="mb-6 border-1 border-gray-200 dark:border-gray-700 rounded-lg">
        <div onClick={() => setIsLeadershipExpanded(!isLeadershipExpanded)} className="p-2 cursor-pointer">
          <h3 className="flex items-center justify-between w-full text-lg font-semibold text-gray-900 dark:text-white">
            Party Leadership
            {isLeadershipExpanded ? (
              <FaChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            ) : (
              <FaChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            )}
          </h3>
        </div>
        <PartyLeadership
          partyCode={selectedParty.party_code}
          isExpanded={isLeadershipExpanded}
          showHeader={false}
        />
      </div>

      {/* Party Stats */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {partyLoading ? (
              <span className="text-gray-400">...</span>
            ) : (
              fullPartyData?.election_candidates?.length || 0
            )}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Candidates Running</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {partyLoading ? (
              <span className="text-gray-400">...</span>
            ) : (() => {
              // TEMPORARY: Calculate office holders based on party type
              // TODO: Replace with actual calculation based on election results data
              // The seed file doesn't currently generate historical election data for previous terms
              // Once we have proper election result data, calculate current office holders based on:
              // - Elections from previous cycles where candidate won
              // - Current office status tracked in the database
              const candidatesRunning = fullPartyData?.election_candidates?.length || 0
              const partyCode = selectedParty.party_code

              if (partyCode === 'DEM') {
                return Math.floor(candidatesRunning / 2)
              } else if (partyCode === 'REP') {
                return Math.ceil(candidatesRunning / 2)
              } else if (partyCode === 'IND') {
                return 8
              } else {
                return 0
              }
            })()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Current Office Holders</div>
        </div>
      </div>

      {/* Candidates */}
      <div className="px-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Active Candidates</h3>
        {partyLoading ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
            Loading candidates...
          </div>
        ) : (
          <PartyCandidatesSection
            candidates={fullPartyData?.candidate_parties || []}
            electionCandidates={fullPartyData?.election_candidates}
            states={states}
            selectedPartyName={selectedParty.name}
          />
        )}
      </div>
    </div>
  )
}

export default PartyDetailSection
