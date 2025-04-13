import { CandidateInfoTab } from "../../types"
import { useState } from "react"

const CandidateInfoTabs = ({ tabs }: { tabs: CandidateInfoTab[] }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  return (
    <>
      <div className="flex flex-row gap-4">
        {tabs.map((tab, key) => {
          return (
            <div key={key}>
              <button
                className={activeTab === tab ? "text-[1.25rem] text-dark-mode-blue font-bold underline" : "text-[1.25rem]"}
                onClick={() => setActiveTab(tab)}
              >
                {tab.title}
              </button>
            </div>
          )
        })}
      </div>
      <div>
        {activeTab.component}
      </div>
    </>
  )
}

export default CandidateInfoTabs