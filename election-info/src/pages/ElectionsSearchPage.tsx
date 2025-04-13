import CandidateComparison from "../components/CandidateComparison"

const ElectionsSearchPage = () => {
  return (
    <>
      <section>
        <div className="px-4 py-4 border-b h-96 lg:h-[500px]">
          <div className="text-center">
            Just imagine this is where the interactivemap will go.
          </div>
          <div className="flex justify-center items-center w-full h-full">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Pennsylvania_Congressional_Districts%2C_118th_Congress.svg" 
              alt="USA Map" 
              className="max-w-full max-h-full object-contain" 
            />
          </div>
        </div>
    </section>
    <CandidateComparison />
    </>
  )
}

export default ElectionsSearchPage