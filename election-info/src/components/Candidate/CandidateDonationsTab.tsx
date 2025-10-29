import { useState, useMemo } from "react";
import { FaSearch, FaSortAmountDown } from "react-icons/fa";
import type { ElectionCandidateDonation } from "../../types/api";

interface DonorInfo {
  type: 'Individual' | 'Corporation' | 'PAC' | 'Union' | 'Nonprofit' | 'Other';
  organization?: string;
  location: string;
  industry?: string;
  totalToCandidate: number;
  totalThisCycle: number;
  notes?: string;
  context?: {
    alignment: 'aligned' | 'conflicting' | 'neutral' | 'notable';
    analysis: string;
  };
}

interface CandidateDonationsTabProps {
  donations?: ElectionCandidateDonation[];
  candidateKeyIssues?: string[];
  candidateViews?: string[];
}

// Helper function to analyze candidate positions and match against donor interests
const analyzeDonationContext = (
  industry: string,
  keyIssues: string[],
  views: string[]
): { alignment: 'aligned' | 'conflicting' | 'neutral' | 'notable', analysis: string } => {
  const allText = [...keyIssues, ...views].join(' ').toLowerCase();
  
  // Industry-specific policy keywords
  const industryPolicies: Record<string, { supporting: string[], opposing: string[] }> = {
    'Energy': {
      supporting: ['oil', 'fracking', 'pipelines', 'drilling', 'fossil fuels', 'natural gas', 'coal'],
      opposing: ['renewable energy', 'solar', 'wind', 'climate change', 'carbon tax', 'emissions', 'green energy', 'ban fracking', 'offshore drilling ban']
    },
    'Healthcare': {
      supporting: ['private insurance', 'health savings accounts', 'medical choice'],
      opposing: ['universal healthcare', 'single payer', 'medicare for all', 'government healthcare']
    },
    'Finance': {
      supporting: ['deregulation', 'banking reform', 'financial services', 'credit access'],
      opposing: ['bank regulation', 'financial oversight', 'wall street reform', 'consumer protection']
    },
    'Technology': {
      supporting: ['tech innovation', 'data privacy', 'internet freedom', 'startup support'],
      opposing: ['tech regulation', 'antitrust', 'data protection laws', 'platform accountability']
    },
    'Agriculture': {
      supporting: ['farm subsidies', 'agricultural exports', 'crop insurance'],
      opposing: ['organic farming', 'sustainable agriculture', 'reduced subsidies']
    },
    'Defense': {
      supporting: ['military spending', 'defense contracts', 'weapons procurement'],
      opposing: ['military budget cuts', 'defense spending reduction', 'weapons reduction']
    },
    'Transportation': {
      supporting: ['highway funding', 'infrastructure investment', 'automobile industry'],
      opposing: ['public transit', 'green transportation', 'electric vehicles mandate']
    },
    'Telecommunications': {
      supporting: ['broadband access', '5g deployment', 'net neutrality repeal'],
      opposing: ['net neutrality', 'internet regulation', 'telecom oversight']
    }
  };

  // Check if industry has defined policies
  const policies = industryPolicies[industry];
  if (!policies) {
    return {
      alignment: 'neutral',
      analysis: 'Standard political contribution with no specific policy alignment identified.'
    };
  }

  // Check for supporting keywords
  const hasSupporting = policies.supporting.some(keyword => allText.includes(keyword));
  // Check for opposing keywords
  const hasOpposing = policies.opposing.some(keyword => allText.includes(keyword));

  if (hasOpposing && !hasSupporting) {
    return {
      alignment: 'conflicting',
      analysis: `Notable: This ${industry.toLowerCase()} sector donor has contributed despite the candidate's stated support for policies that may negatively impact this industry. This could indicate strategic engagement, regional factors, or other considerations beyond policy positions.`
    };
  } else if (hasSupporting && !hasOpposing) {
    return {
      alignment: 'aligned',
      analysis: `This donation aligns with the candidate's positions supporting ${industry.toLowerCase()} industry interests. The candidate has expressed views favorable to this sector's policy priorities.`
    };
  } else if (hasSupporting && hasOpposing) {
    return {
      alignment: 'notable',
      analysis: `Mixed alignment: The candidate has expressed both supporting and opposing views on ${industry.toLowerCase()}-related policies. This donation may reflect support for specific aspects of the candidate's platform.`
    };
  }

  return {
    alignment: 'neutral',
    analysis: `Standard political contribution from the ${industry.toLowerCase()} sector.`
  };
};

// Helper function to generate consistent dummy donor data based on donor name
const getDonorInfo = (
  donation: ElectionCandidateDonation, 
  allDonations: ElectionCandidateDonation[],
  candidateKeyIssues: string[] = [],
  candidateViews: string[] = []
): DonorInfo => {
  // Create a hash from the donor name for consistent dummy data
  const nameHash = donation.donor_name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const donorTypes: DonorInfo['type'][] = ['Individual', 'Corporation', 'PAC', 'Union', 'Nonprofit', 'Other'];
  const donorType = donorTypes[nameHash % donorTypes.length];
  
  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Energy', 'Education', 'Real Estate',
    'Manufacturing', 'Retail', 'Agriculture', 'Defense', 'Transportation', 'Telecommunications'
  ];
  const industry = industries[nameHash % industries.length];
  
  const cities = [
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
    'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
    'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC'
  ];
  const location = cities[nameHash % cities.length];
  
  const organizations = {
    Individual: undefined,
    Corporation: [
      'Acme Corporation', 'Global Tech Solutions', 'United Industries', 'Pacific Enterprises',
      'National Manufacturing Co.', 'Premier Services Group', 'Metro Business Holdings'
    ],
    PAC: [
      'Progress PAC', 'Forward Action Committee', 'Citizens United PAC', 'American Values PAC',
      'Future Leaders PAC', 'Community Voice PAC', 'National Interest PAC'
    ],
    Union: [
      'United Workers Union', 'National Labor Federation', 'Service Employees Union',
      'Transport Workers Union', 'Healthcare Professionals Union'
    ],
    Nonprofit: [
      'Community Foundation', 'Public Interest Group', 'Civic Action Network',
      'Policy Institute', 'Advocacy Alliance'
    ],
    Other: undefined
  };
  
  const organization = donorType !== 'Individual' && donorType !== 'Other'
    ? organizations[donorType]?.[(nameHash * 7) % (organizations[donorType]?.length || 1)]
    : undefined;
  
  // Calculate totals
  const totalToCandidate = allDonations
    .filter(d => d.donor_name === donation.donor_name)
    .reduce((sum, d) => sum + parseFloat(d.donation_amount), 0);
  
  const totalThisCycle = totalToCandidate * (1.2 + (nameHash % 10) / 20); // Vary between 1.2x and 1.7x
  
  const notes = donorType === 'Corporation' 
    ? 'Corporate Political Action Committee'
    : donorType === 'PAC'
    ? 'Registered Political Action Committee'
    : donorType === 'Union'
    ? 'Labor Union Political Fund'
    : donorType === 'Nonprofit'
    ? '501(c)(4) Social Welfare Organization'
    : undefined;
  
  // Analyze donation context based on candidate positions
  const context = donorType !== 'Individual' && industry
    ? analyzeDonationContext(industry, candidateKeyIssues, candidateViews)
    : undefined;
  
  return {
    type: donorType,
    organization,
    location,
    industry: donorType !== 'Individual' ? industry : undefined,
    totalToCandidate,
    totalThisCycle,
    notes,
    context
  };
};

const CandidateDonationsTab = ({ 
  donations, 
  candidateKeyIssues = [], 
  candidateViews = [] 
}: CandidateDonationsTabProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDonorType, setSelectedDonorType] = useState<string>("all");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"amount" | "date" | "donor">("amount");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Process all donations to get donor info
  const donationsWithInfo = useMemo(() => {
    if (!donations || donations.length === 0) return [];
    
    return donations.map(donation => ({
      donation,
      donorInfo: getDonorInfo(donation, donations, candidateKeyIssues, candidateViews)
    }));
  }, [donations, candidateKeyIssues, candidateViews]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (!donations || donations.length === 0) {
      return {
        totalDonations: 0,
        totalAmount: 0,
        averageAmount: 0,
        uniqueDonors: 0,
        byType: {} as Record<string, number>,
        byIndustry: {} as Record<string, number>,
        byAlignment: {} as Record<string, number>
      };
    }

    const totalAmount = donations.reduce((sum, d) => sum + parseFloat(d.donation_amount), 0);
    const uniqueDonors = new Set(donations.map(d => d.donor_name)).size;
    
    const byType: Record<string, number> = {};
    const byIndustry: Record<string, number> = {};
    const byAlignment: Record<string, number> = {};

    donationsWithInfo.forEach(({ donorInfo }) => {
      // Count by type
      byType[donorInfo.type] = (byType[donorInfo.type] || 0) + 1;
      
      // Count by industry
      if (donorInfo.industry) {
        byIndustry[donorInfo.industry] = (byIndustry[donorInfo.industry] || 0) + 1;
      }
      
      // Count by alignment
      if (donorInfo.context) {
        byAlignment[donorInfo.context.alignment] = (byAlignment[donorInfo.context.alignment] || 0) + 1;
      }
    });

    return {
      totalDonations: donations.length,
      totalAmount,
      averageAmount: totalAmount / donations.length,
      uniqueDonors,
      byType,
      byIndustry,
      byAlignment
    };
  }, [donations, donationsWithInfo]);

  // Filter and sort donations
  const filteredAndSortedDonations = useMemo(() => {
    if (!donations || donations.length === 0) return [];

    const filtered = donationsWithInfo.filter(({ donation, donorInfo }) => {
      // Search filter
      if (searchQuery && !donation.donor_name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Donor type filter
      if (selectedDonorType !== "all" && donorInfo.type !== selectedDonorType) {
        return false;
      }

      // Industry filter
      if (selectedIndustry !== "all" && donorInfo.industry !== selectedIndustry) {
        return false;
      }

      return true;
    });

    // Sort donations
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "amount":
          comparison = parseFloat(a.donation.donation_amount) - parseFloat(b.donation.donation_amount);
          break;
        case "date":
          comparison = new Date(a.donation.created_on).getTime() - new Date(b.donation.created_on).getTime();
          break;
        case "donor":
          comparison = a.donation.donor_name.localeCompare(b.donation.donor_name);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [donations, donationsWithInfo, searchQuery, selectedDonorType, selectedIndustry, sortBy, sortOrder]);

  // Get unique values for filters
  const uniqueIndustries = useMemo(() => {
    const industries = new Set<string>();
    donationsWithInfo.forEach(({ donorInfo }) => {
      if (donorInfo.industry) {
        industries.add(donorInfo.industry);
      }
    });
    return Array.from(industries).sort();
  }, [donationsWithInfo]);

  const donorTypes: DonorInfo['type'][] = ['Individual', 'Corporation', 'PAC', 'Union', 'Nonprofit', 'Other'];

  return (
    <div className="flex flex-col p-4 space-y-6">
      {donations && donations.length > 0 ? (
        <>
          {/* Summary Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Donations</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{summaryStats.totalDonations}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Amount</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${summaryStats.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Average</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${summaryStats.averageAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Unique Donors</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{summaryStats.uniqueDonors}</div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by donor name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Donor Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Donor Type
                </label>
                <select
                  value={selectedDonorType}
                  onChange={(e) => setSelectedDonorType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  {donorTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Industry Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Industry
                </label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Industries</option>
                  {uniqueIndustries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-4">
              <FaSortAmountDown className="text-gray-400" />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "amount" | "date" | "donor")}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="amount">Amount</option>
                <option value="date">Date</option>
                <option value="donor">Donor Name</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
              </button>
            </div>
          </div>

          {/* Donations List */}
          {filteredAndSortedDonations.length > 0 ? (
            <div className="space-y-4">
              {filteredAndSortedDonations.map(({ donation, donorInfo }) => (
                <div key={donation.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                {/* Header with donor name and amount */}
                <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex-1">
                    <div className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                      {donation.donor_name}
                    </div>
                    {donorInfo.organization && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {donorInfo.organization}
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-green-600 dark:text-green-400 font-mono text-xl font-bold">
                      ${parseFloat(donation.donation_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(donation.created_on).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Donor Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {/* Donor Type */}
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Donor Type:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {donorInfo.type}
                    </span>
                  </div>

                  {/* Location */}
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Location:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {donorInfo.location}
                    </span>
                  </div>

                  {/* Industry (if applicable) */}
                  {donorInfo.industry && (
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Industry:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">
                        {donorInfo.industry}
                      </span>
                    </div>
                  )}

                  {/* Total to Candidate */}
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Total to Candidate:</span>
                    <span className="ml-2 text-gray-900 dark:text-white font-semibold">
                      ${donorInfo.totalToCandidate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* Total This Cycle */}
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Total This Cycle:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      ${donorInfo.totalThisCycle.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Donation Context Analysis */}
                {donorInfo.context && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className={`p-3 rounded-md ${
                      donorInfo.context.alignment === 'conflicting' 
                        ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'
                        : donorInfo.context.alignment === 'aligned'
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : donorInfo.context.alignment === 'notable'
                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                        : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                    }`}>
                      <div className="flex items-start">
                        <span className={`text-sm font-semibold mr-2 ${
                          donorInfo.context.alignment === 'conflicting'
                            ? 'text-orange-700 dark:text-orange-300'
                            : donorInfo.context.alignment === 'aligned'
                            ? 'text-green-700 dark:text-green-300'
                            : donorInfo.context.alignment === 'notable'
                            ? 'text-blue-700 dark:text-blue-300'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {donorInfo.context.alignment === 'conflicting' && '⚠️ Policy Consideration'}
                          {donorInfo.context.alignment === 'aligned' && '✓ Policy Alignment'}
                          {donorInfo.context.alignment === 'notable' && 'ℹ️ Notable Context'}
                          {donorInfo.context.alignment === 'neutral' && 'Context'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
                        {donorInfo.context.analysis}
                      </p>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {donorInfo.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                      {donorInfo.notes}
                    </div>
                  </div>
                )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                No donations match your filters
              </div>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDonorType("all");
                  setSelectedIndustry("all");
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-gray-500 dark:text-gray-400 italic text-center py-8">
          No donation records available for this election
        </div>
      )}
    </div>
  );
};

export default CandidateDonationsTab;

