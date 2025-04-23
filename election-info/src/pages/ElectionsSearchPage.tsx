import CandidateComparison from "../components/CandidateComparison"

const ElectionsSearchPage = () => {
  return (
    <>
      <section className="h-96 lg:h-[500px] overflow-hidden">
        <div className="h-full border-b">
          <div className="flex flex-row justify-center items-center text-center">
            <div className="flex basis-3/4 justify-center items-center">Just imagine this is where the interactivemap will go.</div>
            <div className="flex basis-1/4"></div>
          </div>
          <div className="flex flex-row justify-center items-center w-full h-[calc(100%-2rem)]">
            <div className="flex basis-3/4 h-full">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Pennsylvania_Congressional_Districts%2C_118th_Congress.svg" 
                alt="USA Map" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex basis-1/4 border-l h-full flex-col">
              <span className="text-2xl font-bold text-center w-full pb-4 border-b">
                <u>Upcoming Elections - PA</u>
              </span>
              <div className="overflow-y-auto p-4">
                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <h3 className="font-semibold text-lg">U.S. Senate</h3>
                    <ul className="list-disc pl-5 mt-1">
                      <li>John Smith (D)</li>
                      <li>Sarah Johnson (R)</li>
                      <li>Michael Brown (I)</li>
                    </ul>
                  </div>
                  <div className="border-b pb-2">
                    <h3 className="font-semibold text-lg">Governor</h3>
                    <ul className="list-disc pl-5 mt-1">
                      <li>Person McLastname (D)</li>
                      <li>Firstname McStupidface (R)</li>
                    </ul>
                  </div>
                  <div className="border-b pb-2">
                    <h3 className="font-semibold text-lg">PA House District 5</h3>
                    <ul className="list-disc pl-5 mt-1">
                      <li>David Miller (D)</li>
                      <li>Jennifer Wilson (R)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">PA Senate District 3</h3>
                    <ul className="list-disc pl-5 mt-1">
                      <li>Thomas Anderson (D)</li>
                      <li>Patricia White (R)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>
      <CandidateComparison />
    </>
  )
}

export default ElectionsSearchPage