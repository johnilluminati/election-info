import type { Candidate, CandidateInfoTab } from "../../types";
import CandidateInfoTabs from "./CandidateInfoTabs";
import CandidateKeyIssues from "./CandidateKeyIssues";

const Candidate = ({ candidate }: { candidate: Candidate }) => {
  const tabData: CandidateInfoTab[] = [
    {
      title: "Key Issues",
      link: "/key_issues",
      component: <CandidateKeyIssues positions={candidate.keyIssues.map(issue => issue.position)} />
    },
    {
      title: "Views",
      link: "/views",
      component: <div>Positions</div>
    },
    {
      title: "History",
      link: "/history",
      component: <div>History</div>
    },
    {
      title: "Donations",
      link: "/donations",
      component: <div>Donations</div>
    }
  ]
  return (
    <>
      <div className="flex flex-row gap-4 mb-4 p-2 border-l">
        <div className="basis-1/6 flex items-center">
          <img className="rounded-full aspect-square object-cover" src={candidate.image} />
        </div>
        <div className="basis-5/6 flex flex-col justify-center dark:text-slate-200">
          <div>
            <span className="text-[2rem] pr-2">{`${candidate.firstName} ${candidate.lastName}`}</span>
            <span className="text-[1rem]">{`${candidate.party}`}</span>
          </div>
          <span className="text-[1.25rem]">{`${candidate.position.title} (${candidate.position.tenure})`}</span>
          <span className="text-[1.25rem]">Website: <a href="/" className="text-blue-500 dark:text-dark-mode-blue underline">{candidate.website}</a></span>
        </div>
      </div>
      <CandidateInfoTabs tabs={tabData} />
      {/* <div className="flex flex-col p-2 border">
        {candidate.keyIssues.map((item, key) => (
          <div key={key} className="border p-2">
            <span>{item.position}</span>
          </div>
        ))}
      </div> */}
    </>
  )
}

export default Candidate