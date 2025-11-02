import { Link } from 'react-router-dom'
import { FaMapMarkedAlt, FaUsers, FaVoteYea } from 'react-icons/fa'

const HomeSiteOverview = () => {
  return (
    <section className="py-16 sm:py-24 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-body-bg-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Your Educational Resource for Elections
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to understand upcoming elections and make informed voting decisions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Search Elections */}
          <Link 
            to="/elections"
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
          >
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
              <FaMapMarkedAlt className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              Search Elections
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Use our interactive map to find upcoming elections in your area. Explore by state, congressional district, or filter by election type to see what's on your ballot.
            </p>
          </Link>

          {/* Search Candidates */}
          <Link 
            to="/candidates"
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
          >
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-6">
              <FaUsers className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              Search Candidates
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Search for candidates by name, location, or party. View detailed profiles, compare candidates side-by-side, and explore voting records and campaign finance information.
            </p>
          </Link>

          {/* Political Parties */}
          <Link 
            to="/political-parties"
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
          >
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6">
              <FaVoteYea className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              Political Parties
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Explore where political parties stand on key issues, view party leadership, and see how candidates align with their party's positions and platform.
            </p>
          </Link>
        </div>

        {/* Call to action section */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 sm:p-10 border border-gray-200 dark:border-gray-700 mt-12">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your Vote Matters
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Every election matters, from local school boards to the presidency. Understanding who's running, what they stand for, and how they've governed in the past helps you vote with confidence. Start exploring above to find the information you need.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeSiteOverview