import type { CandidateKeyIssue } from "../../types/api";

interface CandidateKeyIssuesTabProps {
  keyIssues?: CandidateKeyIssue[];
}

const CandidateKeyIssuesTab = ({ keyIssues }: CandidateKeyIssuesTabProps) => {
  return (
    <div className="flex flex-col p-2">
      {keyIssues && keyIssues.length > 0 ? (
        keyIssues.map((issue) => (
          <div key={issue.id} className="border p-2 mb-2">
            <div className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-1">
              Issue #{issue.order_of_important}
            </div>
            <div className="text-base dark:text-gray-200">{issue.issue_text}</div>
            {issue.view_text && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 italic">
                {issue.view_text}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-gray-500 dark:text-gray-400 italic">
          No key issues available for this election
        </div>
      )}
    </div>
  );
};

export default CandidateKeyIssuesTab;

