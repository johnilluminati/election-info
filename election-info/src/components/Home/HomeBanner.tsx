const HomeBanner = () => {
  return (
    <section className="bg-white dark:bg-body-bg-color">
      <div className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white">
              It shouldn't have to be difficult...
            </h1>

            <p className="mt-6 text-lg text-gray-700 dark:text-gray-300">
              To learn about your candidates.
            </p>
            <p className="mt-2 text-lg text-gray-700 dark:text-gray-300"> 
              To know what candidates' stances are on the issues that matter to you.
            </p>
            <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">
              To determine if a candidate's actions are in line with their stated beliefs.
            </p>
            <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">
              To know of any conflicts of interest that a candidate may have.
            </p>            
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeBanner

