// Helper functions for donation context analysis
// Shared between election-info and election-info-admin projects

export interface DonationContext {
  alignment: 'aligned' | 'conflicting' | 'neutral' | 'notable';
  analysis: string;
}

// Helper function to analyze candidate positions and match against donor interests
export function analyzeDonationContext(
  industry: string,
  keyIssues: string[],
  views: string[]
): DonationContext {
  const allText = [...keyIssues, ...views].join(' ').toLowerCase();
  
  // Industry-specific policy keywords
  const industryPolicies: Record<string, { supporting: string[]; opposing: string[] }> = {
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
}

// Helper to generate notes based on donor type
export function getDonorNotes(donorType: string): string | undefined {
  const mapping: Record<string, string> = {
    'CORPORATION': 'Corporate Political Action Committee',
    'PAC': 'Registered Political Action Committee',
    'UNION': 'Labor Union Political Fund',
    'NONPROFIT': '501(c)(4) Social Welfare Organization'
  };
  return mapping[donorType];
}

