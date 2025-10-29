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
  return (
    <div className="flex flex-col p-4 space-y-4">
      {donations && donations.length > 0 ? (
        <>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Total Donations: {donations.length} record{donations.length !== 1 ? 's' : ''}
          </div>
          {donations.map((donation) => {
            const donorInfo = getDonorInfo(
              donation, 
              donations,
              candidateKeyIssues,
              candidateViews
            );
            return (
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
            );
          })}
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

