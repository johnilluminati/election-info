import type { CandidateView } from "../../types/api";

interface CandidateViewsTabProps {
  views?: CandidateView[];
}

const CandidateViewsTab = ({ views }: CandidateViewsTabProps) => {
  return (
    <div className="flex flex-col p-2">
      {views && views.length > 0 ? (
        views.map((view) => (
          <div key={view.id} className="border p-2 mb-2 dark:border-gray-700">
            <div className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-1">
              {view.view_category?.title || 'General View'}
            </div>
            <div className="text-base dark:text-gray-200">{view.view_text}</div>
          </div>
        ))
      ) : (
        <div className="text-gray-500 dark:text-gray-400 italic">
          No candidate views available
        </div>
      )}
    </div>
  );
};

export default CandidateViewsTab;

