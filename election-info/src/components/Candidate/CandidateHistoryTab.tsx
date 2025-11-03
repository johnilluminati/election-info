import type { CandidateHistory } from "../../types/api";

interface CandidateHistoryTabProps {
  histories?: CandidateHistory[];
}

const CandidateHistoryTab = ({ histories }: CandidateHistoryTabProps) => {
  if (!histories || histories.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 italic text-center py-8">
        No biography or history available for this candidate.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Work-in-Progress Notice */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 my-6">
        <p className="text-sm text-yellow-800 dark:text-yellow-300">
          <strong>Note:</strong> This tab is still a work-in-progress as we decide how best to structure the candidate history information.
        </p>
      </div>

      {/* Main Biography Section */}
      <section>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-300 dark:border-gray-600">
          Biography
        </h3>
        
        <div className="space-y-4">
          {histories.map((history) => (
            <div key={history.id} className="text-base leading-7 text-gray-900 dark:text-gray-200">
              {/* Split by paragraphs if text contains newlines */}
              {history.history_text.split('\n').map((paragraph, pIndex) => (
                <p key={pIndex} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CandidateHistoryTab;
