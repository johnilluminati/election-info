import type { CandidateHistory } from "../../types/api";

interface CandidateHistoryTabProps {
  histories?: CandidateHistory[];
}

const CandidateHistoryTab = ({ histories }: CandidateHistoryTabProps) => {
  return (
    <div className="flex flex-col p-2">
      {histories && histories.length > 0 ? (
        histories.map((history) => (
          <div key={history.id} className="border p-2 mb-2 dark:border-gray-700">
            <div className="text-base dark:text-gray-200">{history.history_text}</div>
          </div>
        ))
      ) : (
        <div className="text-gray-500 dark:text-gray-400 italic">
          No candidate history available
        </div>
      )}
    </div>
  );
};

export default CandidateHistoryTab;

