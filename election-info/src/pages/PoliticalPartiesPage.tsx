import { useState, useRef, useLayoutEffect } from 'react'
import { useParties } from '../hooks'
import PartyCard from '../components/PoliticalParties/PartyCard'
import PartyDetailSection from '../components/PoliticalParties/PartyDetailSection'
import type { PoliticalParty } from '../types/api'
import { FaInfoCircle } from 'react-icons/fa'

const PoliticalPartiesPage = () => {
  const { data: parties, isLoading, error } = useParties()
  const [selectedParty, setSelectedParty] = useState<PoliticalParty | null>(null)
  const detailSectionRef = useRef<HTMLDivElement>(null)

  // Scroll to detail section when a party is selected
  useLayoutEffect(() => {
    if (selectedParty && detailSectionRef.current) {
      // Use requestAnimationFrame to wait for the browser to paint the new content
      requestAnimationFrame(() => {
        const element = detailSectionRef.current
        if (element) {
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
          const offsetPosition = elementPosition - 80 // Account for sticky header
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      })
    }
  }, [selectedParty])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-blue-600 dark:text-blue-400 text-lg mb-2">
              Loading political parties...
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Please wait while we fetch the latest party information.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-red-600 dark:text-red-400 text-lg mb-2">
              Error loading parties
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
              {error instanceof Error ? error.message : 'An error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="dark:bg-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Political Parties
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-6">
              Learn about the positions, values, and candidates of political parties.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore party platforms, key issues, and leadership to make informed decisions about your vote.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        {/* Two-Party System Explanation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              The Two-Party System
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The United States operates under a two-party system dominated by the Democratic and Republican parties. 
              While other parties exist, these two receive the vast majority of votes and hold nearly all elected offices.
            </p>
          </div>

          {/* Major Party Comparison */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Democratic Party</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                Generally supports social equality, environmental protection, and government intervention in the economy. 
                Focuses on healthcare access, climate change, and social justice issues.
              </p>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <strong>Key Values:</strong> Social equality, environmental protection, healthcare access
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Republican Party</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                Generally supports free markets, limited government, traditional values, and strong national defense. 
                Focuses on economic freedom, individual responsibility, and conservative social policies.
              </p>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <strong>Key Values:</strong> Free markets, limited government, traditional values
              </div>
            </div>
          </div>

          {/* Educational Note */}
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-start space-x-3">
              <FaInfoCircle className="text-blue-600 dark:text-blue-400 text-lg mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Note:</strong> These are simplified descriptions. Both parties have diverse viewpoints within them, 
                and individual candidates may have different positions on specific issues. Click on any party below to learn more.
              </div>
            </div>
          </div>
        </div>

        {/* Political Parties Section */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Political Parties
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm">
              Click on any party below to learn more about their positions, leadership, and candidates.
            </p>
          </div>
          
          {parties && parties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {parties
                .sort((a, b) => {
                  // Prioritize Democratic and Republican parties
                  const aIsMajor = a.party_code === 'DEM' || a.party_code === 'REP'
                  const bIsMajor = b.party_code === 'DEM' || b.party_code === 'REP'
                  
                  // If one is major and the other isn't, major comes first
                  if (aIsMajor && !bIsMajor) return -1
                  if (!aIsMajor && bIsMajor) return 1
                  
                  // If both are major, prioritize DEM then REP
                  if (aIsMajor && bIsMajor) {
                    if (a.party_code === 'DEM' && b.party_code === 'REP') return -1
                    if (a.party_code === 'REP' && b.party_code === 'DEM') return 1
                  }
                  
                  // For non-major parties, sort by candidate count
                  return (b._count?.election_candidates || 0) - (a._count?.election_candidates || 0)
                })
                .map((party) => (
                  <PartyCard 
                    key={party.id} 
                    party={party}
                    onSelect={setSelectedParty}
                  />
                ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No political parties found</p>
            </div>
          )}
        </div>

        {/* Party Detail Section */}
        {selectedParty && (
          <div ref={detailSectionRef} className="mt-8">
            <PartyDetailSection 
              selectedParty={selectedParty}
              onClose={() => setSelectedParty(null)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default PoliticalPartiesPage