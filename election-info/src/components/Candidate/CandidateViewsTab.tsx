import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaChevronDown, FaChevronRight, FaVoteYea, FaFileSignature, FaExclamationTriangle } from "react-icons/fa";
import { api } from "../../lib/api";
import type { CandidateView } from "../../types/api";

interface CandidateViewsTabProps {
  views?: CandidateView[];
}

// Component to fetch and display related content for a single view
const ViewRelatedContent = ({ viewId }: { viewId: string }) => {
  const { data: relatedContent, isLoading } = useQuery({
    queryKey: ['view-related-content', viewId],
    queryFn: () => api.getViewRelatedContent(viewId),
    enabled: !!viewId,
  });

  if (isLoading) {
    return <div className="text-sm text-gray-500 dark:text-gray-400 italic">Loading related content...</div>;
  }

  if (!relatedContent || (!relatedContent.votes?.length && !relatedContent.legislation?.length)) {
    return null;
  }

  const formatConflictType = (type: string): string => {
    return type.charAt(0) + type.slice(1).toLowerCase();
  };

  const formatVoteType = (type: string): string => {
    return type === 'NOT_VOTING' ? 'Not Voting' : type.charAt(0) + type.slice(1).toLowerCase();
  };

  const formatStatus = (status: string): string => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };


  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
      {/* Votes */}
      {relatedContent.votes && relatedContent.votes.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FaVoteYea className="text-blue-600 dark:text-blue-400" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Relevant Votes</h4>
          </div>
          <div className="space-y-2">
            {relatedContent.votes.map((vote) => (
              <div key={vote.id} className="bg-gray-50 dark:bg-gray-700 rounded p-3 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{vote.bill_title}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    vote.vote_type === "FOR" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                    vote.vote_type === "AGAINST" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                    "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300"
                  }`}>
                    {formatVoteType(vote.vote_type)}
                  </span>
                </div>
                {vote.description && (
                  <div className="text-xs text-gray-600 dark:text-gray-400">{vote.description}</div>
                )}
                
                {vote.impact && (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Impact:</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{vote.impact}</div>
                  </div>
                )}

                {vote.stated_reason && (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Stated Reason:</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed italic">"{vote.stated_reason}"</div>
                  </div>
                )}

                {vote.conflicts && vote.conflicts.length > 0 && (
                  <div className="pt-2 border-t border-orange-200 dark:border-orange-700">
                    <div className="flex items-center gap-1 mb-2">
                      <FaExclamationTriangle className="text-orange-600 dark:text-orange-400 text-xs" />
                      <div className="text-xs font-semibold text-orange-900 dark:text-orange-200">Potential Conflict of Interest</div>
                    </div>
                    {vote.conflicts.map((conflict) => (
                      <div key={conflict.id} className="bg-orange-50 dark:bg-orange-900/20 rounded p-2 mb-2 last:mb-0 space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-medium text-orange-900 dark:text-orange-200">{formatConflictType(conflict.conflict_type)} Conflict</span>
                        </div>
                        <div className="text-xs text-orange-800 dark:text-orange-300 leading-relaxed">{conflict.description}</div>
                        {conflict.impact && (
                          <div className="text-xs text-orange-800 dark:text-orange-300 leading-relaxed">
                            <span className="font-medium">Impact: </span>
                            {conflict.impact}
                          </div>
                        )}
                        {conflict.response && (
                          <div className="text-xs text-orange-800 dark:text-orange-300 leading-relaxed italic">
                            <span className="font-medium">Response: </span>
                            "{conflict.response}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-xs text-gray-500 dark:text-gray-500 pt-1">
                  {new Date(vote.vote_date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legislation */}
      {relatedContent.legislation && relatedContent.legislation.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FaFileSignature className="text-purple-600 dark:text-purple-400" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Legislation</h4>
          </div>
          <div className="space-y-2">
            {relatedContent.legislation.map((leg) => (
              <div key={leg.id} className="bg-gray-50 dark:bg-gray-700 rounded p-3 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{leg.title}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    leg.status === "PASSED" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                    leg.status === "PENDING" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                    "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300"
                  }`}>
                    {formatStatus(leg.status)}
                  </span>
                </div>
                {leg.description && (
                  <div className="text-xs text-gray-600 dark:text-gray-400">{leg.description}</div>
                )}
                
                {leg.impact && (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Potential Impact:</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{leg.impact}</div>
                  </div>
                )}

                {leg.stated_reason && (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Stated Reason:</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed italic">"{leg.stated_reason}"</div>
                  </div>
                )}

                {leg.conflicts && leg.conflicts.length > 0 && (
                  <div className="pt-2 border-t border-orange-200 dark:border-orange-700">
                    <div className="flex items-center gap-1 mb-2">
                      <FaExclamationTriangle className="text-orange-600 dark:text-orange-400 text-xs" />
                      <div className="text-xs font-semibold text-orange-900 dark:text-orange-200">Potential Conflict of Interest</div>
                    </div>
                    {leg.conflicts.map((conflict) => (
                      <div key={conflict.id} className="bg-orange-50 dark:bg-orange-900/20 rounded p-2 mb-2 last:mb-0 space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-medium text-orange-900 dark:text-orange-200">{formatConflictType(conflict.conflict_type)} Conflict</span>
                        </div>
                        <div className="text-xs text-orange-800 dark:text-orange-300 leading-relaxed">{conflict.description}</div>
                        {conflict.impact && (
                          <div className="text-xs text-orange-800 dark:text-orange-300 leading-relaxed">
                            <span className="font-medium">Impact: </span>
                            {conflict.impact}
                          </div>
                        )}
                        {conflict.response && (
                          <div className="text-xs text-orange-800 dark:text-orange-300 leading-relaxed italic">
                            <span className="font-medium">Response: </span>
                            "{conflict.response}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-xs text-gray-500 dark:text-gray-500 pt-1">
                  {new Date(leg.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CandidateViewsTab = ({ views }: CandidateViewsTabProps) => {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const grouped = useMemo(() => {
    const groups = new Map<string, CandidateView[]>();
    (views || []).forEach((v) => {
      const key = v.view_category?.title || "General";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(v);
    });
    // Sort categories alphabetically, with "General" last
    const entries = Array.from(groups.entries());
    entries.sort((a, b) => {
      if (a[0] === "General") return 1;
      if (b[0] === "General") return -1;
      return a[0].localeCompare(b[0]);
    });
    // Sort views within category by text length descending for readability emphasis
    entries.forEach(([, arr]) => arr.sort((x, y) => y.view_text.length - x.view_text.length));
    return entries;
  }, [views]);

  const toggleCategory = (name: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  if (!views || views.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 italic text-center py-8">
        No candidate views available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-2">
      {/* Category groups */}
      <div className="space-y-4">
        {grouped.map(([category, items]) => {
          const isCollapsed = collapsed.has(category);
          return (
            <section key={category} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {/* Header */}
              <button
                type="button"
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left"
                onClick={() => toggleCategory(category)}
                aria-expanded={!isCollapsed}
              >
                <div className="flex items-center gap-2">
                  {isCollapsed ? (
                    <FaChevronRight className="text-gray-500" />
                  ) : (
                    <FaChevronDown className="text-gray-500" />
                  )}
                  <h3 className="m-0 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    {category}
                  </h3>
                </div>
              </button>

              {/* Content */}
              {!isCollapsed && (
                <div className="p-4 sm:p-5 space-y-4">
                  {items.map((view) => (
                    <div
                      key={view.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-white dark:bg-gray-800 shadow-sm"
                    >
                      {/* View text */}
                      <div className="text-gray-900 dark:text-gray-100 text-base leading-relaxed">
                        {view.view_text}
                      </div>

                      {/* Related Content */}
                      <ViewRelatedContent viewId={view.id} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default CandidateViewsTab;

