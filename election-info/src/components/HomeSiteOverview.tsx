const HomeSiteOverview = () => {
  return (
    // <section>
    //   <div className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32 border h-[500px]">
    //     <div className="text-center">
    //       Just imagine this is a section that shows an overview of the site. Like with an image of the map, perhaps.
    //     </div>
    //   </div>
    // </section>
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

          

          {/* Feature 4 */}
          {/* <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Conflict Disclosure
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Transparent reporting of potential conflicts of interest and financial disclosures.
            </p>
          </div> */}

          {/* Feature 5 */}
          {/* <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Interactive Maps
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Visual representation of voting districts and election results with interactive features.
            </p>
          </div> */}

          {/* Feature 6 */}
          {/* <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Educational Resources
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Guides and resources to help you understand the electoral process and make informed decisions.
            </p>
          </div> */}
        </div>
      </section>
  )
}

export default HomeSiteOverview