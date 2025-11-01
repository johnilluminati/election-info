import { useState } from 'react'
import type { PoliticalParty } from '../../types/api'
import PartyCandidatesSection from './PartyCandidatesSection'
import PartyLeadership from './PartyLeadership'
import { useParty } from '../../hooks/useParties'
import { useStates } from '../../hooks'
import { FaTimes } from 'react-icons/fa'

interface PartyDetailSectionProps {
  selectedParty: PoliticalParty | null
  onClose: () => void
}

const PartyDetailSection = ({ selectedParty, onClose }: PartyDetailSectionProps) => {
  const [isLeadershipExpanded, setIsLeadershipExpanded] = useState(false)
  
  // Fetch complete party data including candidates
  const { data: fullPartyData, isLoading: partyLoading } = useParty(selectedParty?.id || '')
  
  // Fetch states data for filtering
  const { data: states } = useStates()

  if (!selectedParty) return null

  // Get party stance information
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

  const stances = getPartyStances(selectedParty.party_code)
  
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
  
  const spectrumPosition = getSpectrumPosition(selectedParty.party_code)

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

      {/* Political Spectrum */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Political Position</h3>
        <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-red-500"></div>
          <div 
            className="absolute top-0 w-1 h-full bg-white dark:bg-gray-800 border border-gray-400 shadow-sm"
            style={{ left: `${spectrumPosition}%`, transform: 'translateX(-50%)' }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>Far Left</span>
          <span>Left</span>
          <span>Center</span>
          <span>Right</span>
          <span>Far Right</span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About</h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {stances.description}
        </p>
      </div>

      {/* Key Issues */}
      <div className="mb-6">
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
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Party Leadership</h3>
        <PartyLeadership 
          partyCode={selectedParty.party_code}
          isExpanded={isLeadershipExpanded}
          onToggle={() => setIsLeadershipExpanded(!isLeadershipExpanded)}
        />
      </div>

      {/* Candidates */}
      <div>
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
