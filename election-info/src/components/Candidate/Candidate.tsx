import type { ElectionCandidate } from "../../types/api";
import { FaExternalLinkAlt } from "react-icons/fa";
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
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0 max-w-[120px]">
            {candidate.picture_link ? (
              <img 
                src={candidate.picture_link}
                alt={`${candidate.first_name} ${candidate.last_name}`}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl text-gray-500 dark:text-gray-400">
                {candidate.first_name?.[0]}{candidate.last_name?.[0]}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
              {candidate.first_name} {candidate.last_name}
              {candidate.nickname && (
                <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-2">
                  "{candidate.nickname}"
                </span>
              )}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {party?.name || 'Independent'}
            </p>
            {electionCandidate.website && (
              <a
                href={electionCandidate.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
              >
                <FaExternalLinkAlt className="text-md" />
                <span className="text-lg">{electionCandidate.website}</span>
              </a>
            )}
          </div>
        </div>
      </div>
      <CandidateInfoTabs tabs={tabData} />
    </>
  );
};

export default Candidate;