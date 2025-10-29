import type { ElectionCandidate } from "../../types/api";
import CandidateInfoTabs from "./CandidateInfoTabs";
import CandidateKeyIssuesTab from "./CandidateKeyIssuesTab";
import CandidateViewsTab from "./CandidateViewsTab";
import CandidateHistoryTab from "./CandidateHistoryTab";
import CandidateDonationsTab from "./CandidateDonationsTab";

interface CandidateProps {
  electionCandidate: ElectionCandidate;
}

const Candidate = ({ electionCandidate }: CandidateProps) => {
  const candidate = electionCandidate.candidate;
  const party = electionCandidate.party;
  
  if (!candidate) {
    return <div>Candidate information not available</div>;
  }

  // Extract candidate positions for context analysis
  const candidateKeyIssues = electionCandidate.key_issues?.map(issue => 
    `${issue.issue_text} ${issue.view_text || ''}`
  ) || [];
  
  const candidateViews = candidate.candidate_views?.map(view => view.view_text) || [];

  const tabData = [
    {
      title: "Key Issues",
      link: "/key_issues",
      component: <CandidateKeyIssuesTab keyIssues={electionCandidate.key_issues} />
    },
    {
      title: "Views",
      link: "/views",
      component: <CandidateViewsTab views={candidate.candidate_views} />
    },
    {
      title: "History",
      link: "/history",
      component: <CandidateHistoryTab histories={candidate.candidate_histories} />
    },
    {
      title: "Donations",
      link: "/donations",
      component: (
        <CandidateDonationsTab 
          donations={electionCandidate.donations}
          candidateKeyIssues={candidateKeyIssues}
          candidateViews={candidateViews}
        />
      )
    }
  ];

  return (
    <>
      <div className="flex flex-row gap-4 mb-4 p-2">
        <div className="basis-1/6 flex items-center">
          <img 
            className="rounded-full aspect-square object-cover" 
            src={candidate.picture_link || "/src/assets/candidate1.png"} 
            alt={`${candidate.first_name} ${candidate.last_name}`}
          />
        </div>
        <div className="basis-5/6 flex flex-col justify-center dark:text-slate-200">
          <div>
            <span className="text-[2rem] pr-2">{`${candidate.first_name} ${candidate.last_name}`}</span>
            {candidate.nickname && (
              <span className="text-[1rem] text-gray-600">"{candidate.nickname}"</span>
            )}
          </div>
          <span className="text-[1.25rem]">
            {electionCandidate.election?.election_type?.name || 'Candidate'} - {party?.name || 'Independent'}
          </span>
          {electionCandidate.website && (
            <span className="text-[1.25rem] block">
              Website: <a href={electionCandidate.website} className="text-blue-500 dark:text-dark-mode-blue underline" target="_blank" rel="noopener noreferrer">
                {electionCandidate.website}
              </a>
            </span>
          )}
        </div>
      </div>
      <CandidateInfoTabs tabs={tabData} />
    </>
  );
};

export default Candidate;