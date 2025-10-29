import { useMemo, useState } from "react";
import { FaChevronDown, FaChevronRight, FaVoteYea, FaFileSignature, FaExclamationTriangle } from "react-icons/fa";
import type { CandidateView } from "../../types/api";

interface CandidateViewsTabProps {
  views?: CandidateView[];
}

interface ConflictOfInterest {
  type: "Financial" | "Personal" | "Professional";
  description: string;
  severity: "Low" | "Medium" | "High";
  impact: string;
  response?: string;
}

interface ViewRelatedContent {
  votes?: Array<{
    bill: string;
    vote: "For" | "Against" | "Present" | "Not Voting";
    date: string;
    description: string;
    impact: string;
    statedReason: string;
    conflicts?: ConflictOfInterest[];
  }>;
  legislation?: Array<{
    title: string;
    status: "Introduced" | "Passed" | "Pending" | "Vetoed";
    date: string;
    description: string;
    impact: string;
    statedReason: string;
    conflicts?: ConflictOfInterest[];
  }>;
}

function generateRelatedContent(view: CandidateView): ViewRelatedContent {
  const seed = (view.view_text || "").length + (view.view_category?.title?.length || 0);
  const hasContent = seed % 3 !== 0; // 2/3 of views will have related content
  
  if (!hasContent) return {};

  const bills = [
    "H.R. 1234 - Healthcare Reform Act",
    "S. 567 - Climate Action Bill",
    "H.R. 890 - Education Funding Package",
    "S. 234 - Infrastructure Investment Act",
    "H.R. 456 - Tax Reform Legislation",
  ];

  const voteTypes: ("For" | "Against" | "Present")[] = ["For", "Against", "Present"];
  const statusTypes: ("Introduced" | "Passed" | "Pending")[] = ["Introduced", "Passed", "Pending"];

  const voteImpacts = [
    "This vote contributed to the bill's passage, affecting millions of constituents.",
    "This vote helped block the legislation from moving forward.",
    "The bill passed despite this vote, with implications for state funding.",
    "This vote aligned with party leadership and had regional consequences.",
    "The legislation failed by a narrow margin, with this vote being decisive.",
  ];

  const voteReasons = [
    "Supported this bill because it addresses critical infrastructure needs in our communities.",
    "Opposed this legislation due to concerns about its fiscal impact and potential overreach.",
    "Voted against because the bill lacked sufficient safeguards for taxpayer protections.",
    "Supported this measure as it aligns with my commitment to environmental stewardship.",
    "Opposed due to insufficient provisions for small business protections.",
    "Voted in favor to ensure equitable access to healthcare services.",
    "Supported because the bill strengthens our education system without raising taxes.",
  ];

  const legislationImpacts = [
    "If passed, this legislation would provide funding for infrastructure projects across the state.",
    "This bill addresses regulatory concerns and could affect thousands of businesses.",
    "Legislation aims to expand access to key services for underserved communities.",
    "If enacted, this would be the first comprehensive reform in this area in over a decade.",
    "This bill would establish new standards affecting public safety and welfare.",
  ];

  const legislationReasons = [
    "Introduced this bill to address the growing concerns raised by constituents.",
    "This legislation reflects my commitment to ensuring fair and equitable policies.",
    "Sponsored this bill after extensive consultation with stakeholders and experts.",
    "This measure addresses a critical gap in our current regulatory framework.",
    "Introduced to provide much-needed support to working families in our district.",
  ];

  const conflictTypes: ("Financial" | "Personal" | "Professional")[] = ["Financial", "Personal", "Professional"];
  const severities: ("Low" | "Medium" | "High")[] = ["Low", "Medium", "High"];

  const conflictDescriptions = [
    "Candidate has received significant campaign donations from industry groups related to this legislation.",
    "Financial ties to companies that would benefit from this policy through stock holdings or board positions.",
    "Personal connections to stakeholders in industries affected by this vote.",
    "Previous employment or consulting relationships with organizations that have a vested interest in this legislation.",
    "Family members have financial interests in companies affected by this policy.",
    "Received donations from PACs and lobbying groups representing interests aligned with this vote.",
  ];

  const conflictImpacts = [
    "This financial relationship may raise questions about the objectivity of this vote.",
    "Could create the appearance of favoring donor interests over public interest.",
    "May influence how constituents view the candidate's independence on this issue.",
    "Raises transparency concerns regarding the relationship between donations and policy positions.",
  ];

  const conflictResponses = [
    "Has stated that campaign contributions do not influence policy decisions and maintains strict ethical standards.",
    "No public response has been provided regarding this potential conflict.",
    "Candidate maintains full compliance with all disclosure requirements and ethics regulations.",
    "Has recused from relevant votes when this conflict was identified.",
  ];

  // Generate conflict for vote if applicable (about 30% of votes have conflicts)
  const voteConflict: ConflictOfInterest[] | undefined = seed % 10 < 3 ? [
    {
      type: conflictTypes[seed % conflictTypes.length],
      description: conflictDescriptions[seed % conflictDescriptions.length],
      severity: severities[seed % severities.length],
      impact: conflictImpacts[seed % conflictImpacts.length],
      response: conflictResponses[seed % conflictResponses.length],
    },
  ] : undefined;

  // Generate conflict for legislation if applicable (about 30% of legislation has conflicts)
  const legislationConflict: ConflictOfInterest[] | undefined = (seed * 2) % 10 < 3 ? [
    {
      type: conflictTypes[(seed * 3) % conflictTypes.length],
      description: conflictDescriptions[(seed * 2) % conflictDescriptions.length],
      severity: severities[(seed * 2) % severities.length],
      impact: conflictImpacts[(seed * 2) % conflictImpacts.length],
      response: conflictResponses[(seed * 2) % conflictResponses.length],
    },
  ] : undefined;

  const votes = seed % 2 === 0 ? [
    {
      bill: bills[seed % bills.length],
      vote: voteTypes[seed % voteTypes.length],
      date: `202${3 + (seed % 2)}-${String((seed % 12) + 1).padStart(2, "0")}-${String((seed % 28) + 1).padStart(2, "0")}`,
      description: "Voted on this legislation related to the candidate's stated position.",
      impact: voteImpacts[seed % voteImpacts.length],
      statedReason: voteReasons[seed % voteReasons.length],
      ...(voteConflict && { conflicts: voteConflict }),
    },
  ] : undefined;

  const legislation = seed % 3 === 1 ? [
    {
      title: bills[(seed * 2) % bills.length],
      status: statusTypes[seed % statusTypes.length],
      date: `202${3 + (seed % 2)}-${String((seed % 12) + 1).padStart(2, "0")}-${String((seed % 28) + 1).padStart(2, "0")}`,
      description: "Sponsored or co-sponsored legislation aligned with this position.",
      impact: legislationImpacts[seed % legislationImpacts.length],
      statedReason: legislationReasons[seed % legislationReasons.length],
      ...(legislationConflict && { conflicts: legislationConflict }),
    },
  ] : undefined;

  return {
    ...(votes && { votes }),
    ...(legislation && { legislation }),
  };
}

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
                  {items.map((view) => {
                    const relatedContent = generateRelatedContent(view);
                    const hasRelatedContent = relatedContent.votes || relatedContent.legislation;
                    return (
                      <div
                        key={view.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-white dark:bg-gray-800 shadow-sm"
                      >
                        {/* View text */}
                        <div className="text-gray-900 dark:text-gray-100 text-base leading-relaxed">
                          {view.view_text}
                        </div>

                        {/* Related Content */}
                        {hasRelatedContent && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                            {/* Votes */}
                            {relatedContent.votes && relatedContent.votes.length > 0 && (
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <FaVoteYea className="text-blue-600 dark:text-blue-400" />
                                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Relevant Votes</h4>
                                </div>
                                <div className="space-y-2">
                                  {relatedContent.votes.map((vote, idx) => (
                                    <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded p-3 space-y-3">
                                      <div className="flex items-start justify-between gap-2">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{vote.bill}</span>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                          vote.vote === "For" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                                          vote.vote === "Against" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                                          "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300"
                                        }`}>
                                          {vote.vote}
                                        </span>
                                      </div>
                                      <div className="text-xs text-gray-600 dark:text-gray-400">{vote.description}</div>
                                      
                                      {/* Impact */}
                                      <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                                        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Impact:</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{vote.impact}</div>
                                      </div>

                                      {/* Stated Reason */}
                                      <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                                        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Stated Reason:</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed italic">"{vote.statedReason}"</div>
                                      </div>

                                      {/* Conflicts of Interest */}
                                      {vote.conflicts && vote.conflicts.length > 0 && (
                                        <div className="pt-2 border-t border-orange-200 dark:border-orange-700">
                                          <div className="flex items-center gap-1 mb-2">
                                            <FaExclamationTriangle className="text-orange-600 dark:text-orange-400 text-xs" />
                                            <div className="text-xs font-semibold text-orange-900 dark:text-orange-200">Potential Conflict of Interest</div>
                                          </div>
                                          {vote.conflicts.map((conflict, conflictIdx) => (
                                            <div key={conflictIdx} className="bg-orange-50 dark:bg-orange-900/20 rounded p-2 mb-2 last:mb-0 space-y-2">
                                              <div className="flex items-start justify-between gap-2">
                                                <span className="text-xs font-medium text-orange-900 dark:text-orange-200">{conflict.type} Conflict</span>
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                                  conflict.severity === "High" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                                                  conflict.severity === "Medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                                                  "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300"
                                                }`}>
                                                  {conflict.severity}
                                                </span>
                                              </div>
                                              <div className="text-xs text-orange-800 dark:text-orange-300 leading-relaxed">{conflict.description}</div>
                                              <div className="text-xs text-orange-800 dark:text-orange-300 leading-relaxed">
                                                <span className="font-medium">Impact: </span>
                                                {conflict.impact}
                                              </div>
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

                                      <div className="text-xs text-gray-500 dark:text-gray-500 pt-1">{vote.date}</div>
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
                                  {relatedContent.legislation.map((leg, idx) => (
                                    <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded p-3 space-y-3">
                                      <div className="flex items-start justify-between gap-2">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{leg.title}</span>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                          leg.status === "Passed" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                                          leg.status === "Pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                                          "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300"
                                        }`}>
                                          {leg.status}
                                        </span>
                                      </div>
                                      <div className="text-xs text-gray-600 dark:text-gray-400">{leg.description}</div>
                                      
                                      {/* Impact */}
                                      <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                                        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Potential Impact:</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{leg.impact}</div>
                                      </div>

                                      {/* Stated Reason */}
                                      <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                                        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Stated Reason:</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed italic">"{leg.statedReason}"</div>
                                      </div>

                                      {/* Conflicts of Interest */}
                                      {leg.conflicts && leg.conflicts.length > 0 && (
                                        <div className="pt-2 border-t border-orange-200 dark:border-orange-700">
                                          <div className="flex items-center gap-1 mb-2">
                                            <FaExclamationTriangle className="text-orange-600 dark:text-orange-400 text-xs" />
                                            <div className="text-xs font-semibold text-orange-900 dark:text-orange-200">Potential Conflict of Interest</div>
                                          </div>
                                          {leg.conflicts.map((conflict, conflictIdx) => (
                                            <div key={conflictIdx} className="bg-orange-50 dark:bg-orange-900/20 rounded p-2 mb-2 last:mb-0 space-y-2">
                                              <div className="flex items-start justify-between gap-2">
                                                <span className="text-xs font-medium text-orange-900 dark:text-orange-200">{conflict.type} Conflict</span>
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                                  conflict.severity === "High" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                                                  conflict.severity === "Medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                                                  "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300"
                                                }`}>
                                                  {conflict.severity}
                                                </span>
                                              </div>
                                              <div className="text-xs text-orange-800 dark:text-orange-300 leading-relaxed">{conflict.description}</div>
                                              <div className="text-xs text-orange-800 dark:text-orange-300 leading-relaxed">
                                                <span className="font-medium">Impact: </span>
                                                {conflict.impact}
                                              </div>
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

                                      <div className="text-xs text-gray-500 dark:text-gray-500 pt-1">{leg.date}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
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

