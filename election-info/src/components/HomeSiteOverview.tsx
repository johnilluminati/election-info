const HomeSiteOverview = () => {
  return (
    <section className="py-16 sm:py-24 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            What We Provide
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Easily accessible information to help you understand your candidates and make informed voting decisions.
            {/* Comprehensive tools and information to help you understand your candidates and make informed voting decisions. */}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="relative">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Candidate Profiles
              </h3>
              <p className="text-gray-600 dark:text-gray-300 pb-4">
                Detailed information about candidates including their background, experience, and policy positions.
              </p>
            </div>
            {/* Vertical line on larger screens */}
            <div className="hidden md:block absolute top-1/2 -translate-y-1/2 right-[-1rem] w-px h-32 bg-gray-200 dark:bg-gray-700"></div>
            {/* Horizontal line on smaller screens */}
            <div className="md:hidden absolute bottom-[-0.5rem] left-8 right-8 h-px bg-gray-200 dark:bg-gray-700"></div>
          </div>

          {/* Feature 2 */}
          <div className="relative">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Issue Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-300 pb-4">
                Compare candidates' positions on key issues that matter to you and your community.
              </p>
            </div>
            {/* Vertical line on larger screens */}
            <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 right-[-1rem] w-px h-32 bg-gray-200 dark:bg-gray-700"></div>
            {/* Horizontal line on smaller screens */}
            <div className="lg:hidden absolute bottom-[-0.5rem] left-8 right-8 h-px bg-gray-200 dark:bg-gray-700"></div>
          </div>

          {/* Feature 3 */}
          <div className="relative">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Voting Records
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track how candidates have voted on important issues and legislation throughout their careers.
              </p>
            </div>
            {/* No line for the last item */}
          </div>
        </div>
      </section>
  )
}

export default HomeSiteOverview