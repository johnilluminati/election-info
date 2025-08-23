import { useState } from "react"

interface TabData {
  title: string;
  link: string;
  component: React.ReactNode;
}

const CandidateInfoTabs = ({ tabs }: { tabs: TabData[] }) => {
  const [activeTabTitle, setActiveTabTitle] = useState<string>(tabs[0]?.title || '');
  
  if (!tabs || tabs.length === 0) {
    return null;
  }
  
  // Find the currently active tab based on title
  const activeTab = tabs.find(tab => tab.title === activeTabTitle) || tabs[0];
  
  return (
    <>
      <div className="flex flex-row gap-4 justify-center">
        {tabs.map((tab, key) => {
          return (
            <div key={key}>
              <button
                className={activeTab.title === tab.title ? "text-[1.25rem] text-dark-mode-blue font-bold underline" : "text-[1.25rem]"}
                onClick={() => setActiveTabTitle(tab.title)}
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