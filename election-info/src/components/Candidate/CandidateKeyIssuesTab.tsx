import type { CandidateKeyIssue } from "../../types/api";

interface CandidateKeyIssuesTabProps {
  keyIssues?: CandidateKeyIssue[];
}

const CandidateKeyIssuesTab = ({ keyIssues }: CandidateKeyIssuesTabProps) => {
  if (!keyIssues || keyIssues.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 italic text-center py-12">
        No key issues available for this candidate's campaign
      </div>
    );
  }

  // Sort by order of importance
  const sortedIssues = [...keyIssues].sort((a, b) => a.order_of_important - b.order_of_important);

  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Campaign Priorities
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Key issues and positions for this election cycle
        </p>
      </div>

      <div className="space-y-4">
        {sortedIssues.map((issue) => (
          <div
            key={issue.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              {issue.issue_text}
            </h4>
            {issue.view_text && (
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {issue.view_text}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateKeyIssuesTab;

