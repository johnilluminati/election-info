import type { ElectionCandidate } from "../../types/api";
import CandidateInfoTabs from "./CandidateInfoTabs";

interface CandidateProps {
  electionCandidate: ElectionCandidate;
}

const Candidate = ({ electionCandidate }: CandidateProps) => {
  const candidate = electionCandidate.candidate;
  const party = electionCandidate.party;
  
  if (!candidate) {
    return <div>Candidate information not available</div>;
  }

  const tabData = [
    {
      title: "Key Issues",
      link: "/key_issues",
      component: (
        <div className="flex flex-col p-2">
          {electionCandidate.key_issues && electionCandidate.key_issues.length > 0 ? (
            electionCandidate.key_issues.map((issue) => (
              <div key={issue.id} className="border p-2 mb-2">
                <div className="font-semibold text-sm text-gray-600 mb-1">
                  Issue #{issue.order_of_important}
                </div>
                <div className="text-base">{issue.issue_text}</div>
                {issue.view_text && (
                  <div className="text-sm text-gray-600 mt-1 italic">
                    {issue.view_text}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic">No key issues available for this election</div>
          )}
        </div>
      )
    },
    {
      title: "Views",
      link: "/views",
      component: (
        <div className="flex flex-col p-2">
          {candidate.candidate_views && candidate.candidate_views.length > 0 ? (
            candidate.candidate_views.map((view) => (
              <div key={view.id} className="border p-2 mb-2">
                <div className="font-semibold text-sm text-gray-600 mb-1">
                  {view.view_category?.title || 'General View'}
                </div>
                <div className="text-base">{view.view_text}</div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic">No candidate views available</div>
          )}
        </div>
      )
    },
    {
      title: "History",
      link: "/history",
      component: (
        <div className="flex flex-col p-2">
          {candidate.candidate_histories && candidate.candidate_histories.length > 0 ? (
            candidate.candidate_histories.map((history) => (
              <div key={history.id} className="border p-2 mb-2">
                <div className="text-base">{history.history_text}</div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic">No candidate history available</div>
          )}
        </div>
      )
    },
    {
      title: "Donations",
      link: "/donations",
      component: (
        <div className="flex flex-col p-2">
          {electionCandidate.donations && electionCandidate.donations.length > 0 ? (
            electionCandidate.donations.map((donation) => (
              <div key={donation.id} className="border p-2 mb-2">
                <div className="flex justify-between items-center">
                  <div className="font-semibold">{donation.donor_name}</div>
                  <div className="text-green-600 font-mono">
                    ${parseFloat(donation.donation_amount).toLocaleString()}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(donation.created_on).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic">No donation records available for this election</div>
          )}
        </div>
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