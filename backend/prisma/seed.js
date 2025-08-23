const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

// Function to fetch random dog image
async function fetchRandomDogImage() {
  try {
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.log('Failed to fetch dog image, using fallback URL');
    return 'https://images.dog.ceo/breeds/retriever-golden/n02099601_1024.jpg';
  }
}

// Generate comprehensive US states data
function generateAllStates() {
  return [
    { name: 'Alabama', abbreviation: 'AL', fips_code: '01' },
    { name: 'Alaska', abbreviation: 'AK', fips_code: '02' },
    { name: 'Arizona', abbreviation: 'AZ', fips_code: '04' },
    { name: 'Arkansas', abbreviation: 'AR', fips_code: '05' },
    { name: 'California', abbreviation: 'CA', fips_code: '06' },
    { name: 'Colorado', abbreviation: 'CO', fips_code: '08' },
    { name: 'Connecticut', abbreviation: 'CT', fips_code: '09' },
    { name: 'Delaware', abbreviation: 'DE', fips_code: '10' },
    { name: 'Florida', abbreviation: 'FL', fips_code: '12' },
    { name: 'Georgia', abbreviation: 'GA', fips_code: '13' },
    { name: 'Hawaii', abbreviation: 'HI', fips_code: '15' },
    { name: 'Idaho', abbreviation: 'ID', fips_code: '16' },
    { name: 'Illinois', abbreviation: 'IL', fips_code: '17' },
    { name: 'Indiana', abbreviation: 'IN', fips_code: '18' },
    { name: 'Iowa', abbreviation: 'IA', fips_code: '19' },
    { name: 'Kansas', abbreviation: 'KS', fips_code: '20' },
    { name: 'Kentucky', abbreviation: 'KY', fips_code: '21' },
    { name: 'Louisiana', abbreviation: 'LA', fips_code: '22' },
    { name: 'Maine', abbreviation: 'ME', fips_code: '23' },
    { name: 'Maryland', abbreviation: 'MD', fips_code: '24' },
    { name: 'Massachusetts', abbreviation: 'MA', fips_code: '25' },
    { name: 'Michigan', abbreviation: 'MI', fips_code: '26' },
    { name: 'Minnesota', abbreviation: 'MN', fips_code: '27' },
    { name: 'Mississippi', abbreviation: 'MS', fips_code: '28' },
    { name: 'Missouri', abbreviation: 'MO', fips_code: '29' },
    { name: 'Montana', abbreviation: 'MT', fips_code: '30' },
    { name: 'Nebraska', abbreviation: 'NE', fips_code: '31' },
    { name: 'Nevada', abbreviation: 'NV', fips_code: '32' },
    { name: 'New Hampshire', abbreviation: 'NH', fips_code: '33' },
    { name: 'New Jersey', abbreviation: 'NJ', fips_code: '34' },
    { name: 'New Mexico', abbreviation: 'NM', fips_code: '35' },
    { name: 'New York', abbreviation: 'NY', fips_code: '36' },
    { name: 'North Carolina', abbreviation: 'NC', fips_code: '37' },
    { name: 'North Dakota', abbreviation: 'ND', fips_code: '38' },
    { name: 'Ohio', abbreviation: 'OH', fips_code: '39' },
    { name: 'Oklahoma', abbreviation: 'OK', fips_code: '40' },
    { name: 'Oregon', abbreviation: 'OR', fips_code: '41' },
    { name: 'Pennsylvania', abbreviation: 'PA', fips_code: '42' },
    { name: 'Rhode Island', abbreviation: 'RI', fips_code: '44' },
    { name: 'South Carolina', abbreviation: 'SC', fips_code: '45' },
    { name: 'South Dakota', abbreviation: 'SD', fips_code: '46' },
    { name: 'Tennessee', abbreviation: 'TN', fips_code: '47' },
    { name: 'Texas', abbreviation: 'TX', fips_code: '48' },
    { name: 'Utah', abbreviation: 'UT', fips_code: '49' },
    { name: 'Vermont', abbreviation: 'VT', fips_code: '50' },
    { name: 'Virginia', abbreviation: 'VA', fips_code: '51' },
    { name: 'Washington', abbreviation: 'WA', fips_code: '53' },
    { name: 'West Virginia', abbreviation: 'WV', fips_code: '54' },
    { name: 'Wisconsin', abbreviation: 'WI', fips_code: '55' },
    { name: 'Wyoming', abbreviation: 'WY', fips_code: '56' }
  ];
}

// Generate voting districts for each state (approximate numbers)
function generateDistrictsForState(stateAbbr) {
  const districtCounts = {
    'CA': 52, 'TX': 38, 'FL': 28, 'NY': 26, 'IL': 17, 'PA': 17, 'OH': 15, 'GA': 14, 'NC': 14, 'MI': 13,
    'NJ': 12, 'VA': 11, 'WA': 10, 'AZ': 9, 'TN': 9, 'IN': 9, 'MA': 9, 'MO': 8, 'MD': 8, 'CO': 8,
    'MN': 8, 'WI': 8, 'LA': 6, 'KY': 6, 'OR': 6, 'SC': 7, 'AL': 7, 'CT': 5, 'IA': 4, 'UT': 4,
    'MS': 4, 'AR': 4, 'KS': 4, 'NV': 4, 'NE': 3, 'ID': 2, 'HI': 2, 'NH': 2, 'ME': 2, 'RI': 2,
    'MT': 2, 'DE': 1, 'SD': 1, 'ND': 1, 'VT': 1, 'WY': 1, 'AK': 1, 'WV': 3, 'OK': 5, 'NM': 3
  };
  
  const count = districtCounts[stateAbbr] || 1;
  const districts = [];
  
  for (let i = 1; i <= count; i++) {
    districts.push(`${stateAbbr}${i.toString().padStart(2, '0')}`);
  }
  
  return districts;
}

// Generate unique candidate names
function generateCandidateNames(count) {
  const firstNames = [
    'Marcus', 'Elizabeth', 'James', 'Aisha', 'Robert', 'Sofia', 'David', 'Jennifer', 'Christopher', 'Maria',
    'Michael', 'Sarah', 'William', 'Emily', 'John', 'Jessica', 'Richard', 'Ashley', 'Joseph', 'Amanda',
    'Thomas', 'Nicole', 'Charles', 'Stephanie', 'Daniel', 'Lauren', 'Matthew', 'Megan', 'Anthony', 'Heather',
    'Mark', 'Brittany', 'Donald', 'Danielle', 'Steven', 'Melissa', 'Paul', 'Christina', 'Andrew', 'Kelly',
    'Joshua', 'Tiffany', 'Kenneth', 'Crystal', 'Kevin', 'Amber', 'Brian', 'George', 'Natalie', 'Timothy',
    'Ronald', 'Jason', 'Edward', 'Jeffrey', 'Ryan', 'Jacob', 'Gary', 'Nicholas', 'Eric', 'Jonathan',
    'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon', 'Benjamin', 'Samuel', 'Frank', 'Gregory', 'Raymond',
    'Alexander', 'Patrick', 'Jack', 'Dennis', 'Jerry', 'Tyler', 'Aaron', 'Jose', 'Adam', 'Nathan',
    'Henry', 'Douglas', 'Zachary', 'Peter', 'Kyle', 'Walter', 'Ethan', 'Jeremy', 'Harold', 'Carl',
    'Keith', 'Roger', 'Gerald', 'Christian', 'Terry', 'Sean', 'Gavin', 'Austin', 'Noah', 'Lucas',
    'Mason', 'Oliver', 'Carter', 'Elijah', 'Sebastian', 'Jackson', 'Owen', 'Dylan', 'Isaac', 'Evan',
    'Miles', 'Jace', 'Cooper', 'Parker', 'Xavier', 'Chase', 'Colton', 'Blake', 'Carson', 'Brody'
  ];
  
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
    'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
    'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes',
    'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper',
    'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
    'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes',
    'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez',
    'Powell', 'Jenkins', 'Perry', 'Russell', 'Sullivan', 'Bell', 'Coleman', 'Butler', 'Henderson', 'Barnes',
    'Gonzales', 'Fisher', 'Vasquez', 'Simmons', 'Romero', 'Jordan', 'Patterson', 'Alexander', 'Hamilton', 'Graham',
    'Reynolds', 'Griffin', 'Wallace', 'Moreno', 'West', 'Cole', 'Hayes', 'Bryant', 'Herrera', 'Gibson',
    'Ellis', 'Tran', 'Medina', 'Aguilar', 'Stevens', 'Murray', 'Ford', 'Castro', 'Marshall', 'Harrison',
    'Fernandez', 'Mcdonald', 'Woods', 'Washington', 'Kennedy', 'Wells', 'Vargas', 'Henry', 'Chen', 'Freeman',
    'Webb', 'Tucker', 'Guzman', 'Burns', 'Crawford', 'Olson', 'Simpson', 'Porter', 'Hunter', 'Gordon',
    'Mendez', 'Silva', 'Shaw', 'Snyder', 'Mason', 'Dixon', 'Munoz', 'Hunt', 'Hicks', 'Holmes',
    'Palmer', 'Wagner', 'Black', 'Robertson', 'Boyd', 'Rose', 'Stone', 'Spencer', 'Grant', 'Ward'
  ];
  
  const candidates = [];
  const usedNames = new Set();
  
  for (let i = 0; i < count; i++) {
    let firstName, lastName, fullName;
    
    do {
      firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      fullName = `${firstName} ${lastName}`;
    } while (usedNames.has(fullName));
    
    usedNames.add(fullName);
    
    candidates.push({
      first_name: firstName,
      last_name: lastName,
      nickname: Math.random() > 0.7 ? firstName.substring(0, 3) : null
    });
  }
  
  return candidates;
}

async function main() {
  console.log('🗑️  Clearing all existing data...');
  
  // Clear all data in reverse dependency order
  await prisma.electionCandidateDonation.deleteMany();
  await prisma.candidateKeyIssue.deleteMany();
  await prisma.electionCandidate.deleteMany();
  await prisma.electionGeography.deleteMany();
  await prisma.election.deleteMany();
  await prisma.electionCycle.deleteMany();
  await prisma.candidateHistory.deleteMany();
  await prisma.candidateView.deleteMany();
  await prisma.candidateParty.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.politicalParty.deleteMany();
  await prisma.electionType.deleteMany();
  await prisma.votingDistrictCity.deleteMany();
  await prisma.votingDistrictCounty.deleteMany();
  await prisma.votingDistrict.deleteMany();
  await prisma.uSCityCounty.deleteMany();
  await prisma.uSCity.deleteMany();
  await prisma.uSCounty.deleteMany();
  await prisma.uSState.deleteMany();
  await prisma.candidateViewCategory.deleteMany();
  
  console.log('✅ All existing data cleared');

  // Create all 50 US States
  console.log('Creating all 50 US States...');
  const states = generateAllStates();
  const createdStates = [];
  
  for (const state of states) {
    const createdState = await prisma.uSState.create({
      data: state
    });
    createdStates.push(createdState);
  }
  console.log(`✅ Created ${states.length} US States`);

  // Create Voting Districts for all states
  console.log('Creating Voting Districts for all states...');
  let totalDistricts = 0;
  const createdDistricts = [];
  
  for (const state of createdStates) {
    const districts = generateDistrictsForState(state.abbreviation);
    for (const districtCode of districts) {
      const district = await prisma.votingDistrict.create({
        data: {
          us_state_id: state.id,
          district_code: districtCode
        }
      });
      createdDistricts.push(district);
      totalDistricts++;
    }
  }
  console.log(`✅ Created ${totalDistricts} Voting Districts`);

  // Create Election Types
  console.log('Creating Election Types...');
  const electionTypes = [
    { name: 'Presidential', description: 'Presidential election for the United States' },
    { name: 'Congressional', description: 'Election for members of the House of Representatives' },
    { name: 'Senate', description: 'Election for members of the Senate' },
    { name: 'Gubernatorial', description: 'State governor election' },
    { name: 'State Legislature', description: 'State legislative body election' },
    { name: 'Local', description: 'Local government elections including mayors, city council, etc.' }
  ];

  const createdElectionTypes = [];
  for (const type of electionTypes) {
    const createdType = await prisma.electionType.create({
      data: type
    });
    createdElectionTypes.push(createdType);
  }
  console.log(`✅ Created ${electionTypes.length} Election Types`);

  // Create Election Cycle for November 3, 2026 ONLY
  console.log('Creating Election Cycle for November 3, 2026...');
  const electionCycle = await prisma.electionCycle.create({
    data: {
      election_year: 2026,
      election_day: new Date('2026-11-03'),
      created_on: new Date(),
      created_by: 'seed',
      updated_on: new Date()
    }
  });
  console.log('✅ Created Election Cycle for November 3, 2026');

  // Political Parties data
  const parties = [
    { name: 'Democratic Party', party_code: 'DEM' },
    { name: 'Republican Party', party_code: 'REP' },
    { name: 'Libertarian Party', party_code: 'LIB' },
    { name: 'Green Party', party_code: 'GRN' },
    { name: 'Independent', party_code: 'IND' },
    { name: 'Reform Party', party_code: 'REF' },
    { name: 'Constitution Party', party_code: 'CON' },
    { name: 'Working Families Party', party_code: 'WFP' }
  ];

  console.log('Creating Political Parties...');
  const createdParties = [];
  for (const party of parties) {
    const createdParty = await prisma.politicalParty.create({
      data: {
        ...party,
        created_at: new Date(),
        created_by: 'seed',
        updated_at: new Date()
      }
    });
    createdParties.push(createdParty);
  }
  console.log(`✅ Created ${parties.length} Political Parties`);

  // Generate candidates for all elections
  console.log('Generating comprehensive candidate list...');
  const candidateCount = 2000; // Generate 2000 unique candidates
  const candidateData = generateCandidateNames(candidateCount);
  
  console.log('Creating Candidates with random dog images...');
  const createdCandidates = [];
  for (let i = 0; i < candidateData.length; i++) {
    const candidate = candidateData[i];
    const created = await prisma.candidate.create({
      data: {
        ...candidate,
        picture_link: await fetchRandomDogImage(),
        created_on: new Date(),
        created_by: 'seed',
        updated_on: new Date()
      }
    });
    createdCandidates.push(created);
    
    if (i % 100 === 0) {
      console.log(`Created ${i} candidates...`);
    }
  }
  console.log(`✅ Created ${candidateData.length} Candidates`);

  // Create comprehensive elections for November 3, 2026 ONLY
  console.log('Creating comprehensive elections for November 3, 2026...');
  let totalElections = 0;
  let totalElectionCandidates = 0;
  let candidateIndex = 0;
  
  // Function to get next candidate with wrapping
  const getNextCandidate = () => {
    const candidate = createdCandidates[candidateIndex % createdCandidates.length];
    candidateIndex++;
    return candidate;
  };

  // 1. Presidential Election (National)
  console.log('Creating Presidential Election...');
  const presidentialElection = await prisma.election.create({
    data: {
      election_cycle_id: electionCycle.id,
      election_type_id: createdElectionTypes[0].id,
      created_on: new Date(),
      created_by: 'seed',
      updated_on: new Date()
    }
  });

  // Add national geography
  await prisma.electionGeography.create({
    data: {
      election_id: presidentialElection.id,
      scope_type: 'NATIONAL',
      scope_id: 'US'
    }
  });

  // Add presidential candidates
  for (let i = 0; i < 5; i++) {
    const candidate = getNextCandidate();
    await prisma.electionCandidate.create({
      data: {
        election_id: presidentialElection.id,
        candidate_id: candidate.id,
        party_id: createdParties[i % createdParties.length].id,
        website: `https://candidate${candidateIndex}2026.com`,
        created_on: new Date(),
        created_by: 'seed',
        updated_on: new Date()
      }
    });
    totalElectionCandidates++;
  }
  totalElections++;

  // 2. Congressional Elections (one per district)
  console.log('Creating Congressional Elections...');
  for (const district of createdDistricts) {
    const congressionalElection = await prisma.election.create({
      data: {
        election_cycle_id: electionCycle.id,
        election_type_id: createdElectionTypes[1].id,
        created_on: new Date(),
        created_by: 'seed',
        updated_on: new Date()
      }
    });

    // Add district geography
    await prisma.electionGeography.create({
      data: {
        election_id: congressionalElection.id,
        scope_type: 'DISTRICT',
        scope_id: district.district_code
      }
    });

    // Add state geography
    const state = createdStates.find(s => s.id === district.us_state_id);
    await prisma.electionGeography.create({
      data: {
        election_id: congressionalElection.id,
        scope_type: 'STATE',
        scope_id: state.abbreviation
      }
    });

    // Add 3-5 candidates per district
    const candidateCount = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < candidateCount; i++) {
      const candidate = getNextCandidate();
      await prisma.electionCandidate.create({
        data: {
          election_id: congressionalElection.id,
          candidate_id: candidate.id,
          party_id: createdParties[i % createdParties.length].id,
          website: `https://candidate${candidateIndex}2026.com`,
          created_on: new Date(),
          created_by: 'seed',
          updated_on: new Date()
        }
      });
      totalElectionCandidates++;
    }
    totalElections++;
  }

  // 3. Senate Elections (one per state)
  console.log('Creating Senate Elections...');
  for (const state of createdStates) {
    const senateElection = await prisma.election.create({
      data: {
        election_cycle_id: electionCycle.id,
        election_type_id: createdElectionTypes[2].id,
        created_on: new Date(),
        created_by: 'seed',
        updated_on: new Date()
      }
    });

    // Add state geography
    await prisma.electionGeography.create({
      data: {
        election_id: senateElection.id,
        scope_type: 'STATE',
        scope_id: state.abbreviation
      }
    });

    // Add 2-4 candidates per state
    const candidateCount = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < candidateCount; i++) {
      const candidate = getNextCandidate();
      await prisma.electionCandidate.create({
        data: {
          election_id: senateElection.id,
          candidate_id: candidate.id,
          party_id: createdParties[i % createdParties.length].id,
          website: `https://candidate${candidateIndex}2026.com`,
          created_on: new Date(),
          created_by: 'seed',
          updated_on: new Date()
        }
      });
      totalElectionCandidates++;
    }
    totalElections++;
  }

  // 4. Gubernatorial Elections (one per state)
  console.log('Creating Gubernatorial Elections...');
  for (const state of createdStates) {
    const gubernatorialElection = await prisma.election.create({
      data: {
        election_cycle_id: electionCycle.id,
        election_type_id: createdElectionTypes[3].id,
        created_on: new Date(),
        created_by: 'seed',
        updated_on: new Date()
      }
    });

    // Add state geography
    await prisma.electionGeography.create({
      data: {
        election_id: gubernatorialElection.id,
        scope_type: 'STATE',
        scope_id: state.abbreviation
      }
    });

    // Add 2-4 candidates per state
    const candidateCount = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < candidateCount; i++) {
      const candidate = getNextCandidate();
      await prisma.electionCandidate.create({
        data: {
          election_id: gubernatorialElection.id,
          candidate_id: candidate.id,
          party_id: createdParties[i % createdParties.length].id,
          website: `https://candidate${candidateIndex}2026.com`,
          created_on: new Date(),
          created_by: 'seed',
          updated_on: new Date()
        }
      });
      totalElectionCandidates++;
    }
    totalElections++;
  }

  console.log(`✅ Created ${totalElections} Elections with ${totalElectionCandidates} Election Candidates`);

  // Create candidate view categories
  console.log('Creating candidate view categories...');
  const viewCategories = [
    'Economic Policy', 'Social Issues', 'Foreign Policy', 'Environmental Policy', 
    'Healthcare', 'Education', 'Immigration', 'National Security', 'Tax Policy',
    'Infrastructure', 'Criminal Justice', 'Veterans Affairs', 'Agriculture',
    'Technology', 'Labor Rights', 'Gun Policy', 'Abortion', 'LGBTQ Rights'
  ];

  const createdViewCategories = [];
  for (const category of viewCategories) {
    const createdCategory = await prisma.candidateViewCategory.create({
      data: {
        title: category
      }
    });
    createdViewCategories.push(createdCategory);
  }
  console.log(`✅ Created ${viewCategories.length} candidate view categories`);

  // Get ALL election candidates to create comprehensive data
  console.log('Fetching all election candidates for comprehensive data creation...');
  const allElectionCandidates = await prisma.electionCandidate.findMany();
  console.log(`Found ${allElectionCandidates.length} election candidates`);

  // Create comprehensive data for ALL candidates
  console.log('Creating comprehensive data for all candidates...');

  // 1. Key Issues for ALL candidates
  console.log('Creating key issues for all candidates...');
  const keyIssueTemplates = [
    'Economic Growth and Job Creation',
    'Healthcare Reform and Access',
    'Education Funding and Reform',
    'Infrastructure Investment',
    'Environmental Protection',
    'National Security',
    'Immigration Reform',
    'Tax Policy',
    'Social Justice and Equality',
    'Public Safety and Law Enforcement',
    'Climate Change Action',
    'Small Business Support',
    'Rural Development',
    'Veterans Affairs',
    'Mental Health Services',
    'Affordable Housing',
    'Transportation and Roads',
    'Energy Independence',
    'Criminal Justice Reform',
    'Workforce Development'
  ];

  let totalKeyIssues = 0;
  for (const candidate of allElectionCandidates) {
    const issueCount = Math.floor(Math.random() * 3) + 1; // 1-3 issues per candidate
    for (let i = 0; i < issueCount; i++) {
      const randomIssue = keyIssueTemplates[Math.floor(Math.random() * keyIssueTemplates.length)];
      await prisma.candidateKeyIssue.create({
        data: {
          election_candidate_id: candidate.id,
          issue_text: randomIssue,
          order_of_important: i + 1,
          view_text: `Strong stance on ${randomIssue.toLowerCase()} with comprehensive policy proposals.`,
          created_on: new Date(),
          created_by: 'seed',
          updated_on: new Date()
        }
      });
      totalKeyIssues++;
    }
  }
  console.log(`✅ Created ${totalKeyIssues} key issues for all candidates`);

  // 2. Views for ALL candidates
  console.log('Creating candidate views for all candidates...');
  let totalViews = 0;
  for (const candidate of allElectionCandidates) {
    const viewCount = Math.floor(Math.random() * 4) + 2; // 2-5 views per candidate
    for (let i = 0; i < viewCount; i++) {
      const randomCategory = createdViewCategories[Math.floor(Math.random() * createdViewCategories.length)];
      const viewTexts = [
        `Strong advocate for ${randomCategory.title.toLowerCase()} with proven track record.`,
        `Committed to advancing ${randomCategory.title.toLowerCase()} through bipartisan cooperation.`,
        `Leading voice on ${randomCategory.title.toLowerCase()} with innovative policy solutions.`,
        `Dedicated to protecting ${randomCategory.title.toLowerCase()} for future generations.`,
        `Experienced leader in ${randomCategory.title.toLowerCase()} with measurable results.`
      ];
      const randomViewText = viewTexts[Math.floor(Math.random() * viewTexts.length)];
      
      await prisma.candidateView.create({
        data: {
          candidate_id: candidate.candidate_id,
          view_type_id: randomCategory.id,
          view_text: randomViewText,
          created_on: new Date(),
          created_by: 'seed',
          updated_on: new Date()
        }
      });
      totalViews++;
    }
  }
  console.log(`✅ Created ${totalViews} candidate views for all candidates`);

  // 3. History for ALL candidates
  console.log('Creating candidate histories for all candidates...');
  const historyTemplates = [
    'Served as State Representative for 8 years, focusing on economic development and job creation.',
    'Former Mayor with 12 years of experience in municipal government and infrastructure projects.',
    'Business leader with 20+ years in private sector, specializing in small business growth.',
    'Military veteran with 15 years of service, including deployments to multiple conflict zones.',
    'Educator with 18 years of experience in public schools, advocating for education reform.',
    'Healthcare professional with 14 years of clinical practice and healthcare policy expertise.',
    'Environmental scientist with 16 years of research experience in climate change mitigation.',
    'Law enforcement officer with 22 years of service, including leadership roles in community policing.',
    'Non-profit executive with 19 years of experience in social services and community development.',
    'Technology entrepreneur with 13 years of experience in software development and digital innovation.',
    'Agricultural expert with 17 years of experience in sustainable farming and rural development.',
    'Legal professional with 21 years of experience in constitutional law and civil rights.',
    'Financial advisor with 16 years of experience in economic policy and fiscal responsibility.',
    'Transportation engineer with 15 years of experience in infrastructure planning and development.',
    'Public health official with 18 years of experience in disease prevention and health policy.'
  ];

  let totalHistories = 0;
  for (const candidate of allElectionCandidates) {
    const historyCount = Math.floor(Math.random() * 3) + 1; // 1-3 histories per candidate
    for (let i = 0; i < historyCount; i++) {
      const randomHistory = historyTemplates[Math.floor(Math.random() * historyTemplates.length)];
      
      await prisma.candidateHistory.create({
        data: {
          candidate_id: candidate.candidate_id,
          history_text: randomHistory,
          created_on: new Date(),
          created_by: 'seed',
          updated_on: new Date()
        }
      });
      totalHistories++;
    }
  }
  console.log(`✅ Created ${totalHistories} candidate histories for all candidates`);

  // 4. Donations for ALL candidates
  console.log('Creating campaign donations for all candidates...');
  const donorNames = [
    'Progressive PAC', 'Conservative Coalition', 'Liberty Fund', 'Labor Union Local 123', 'Business Roundtable',
    'Environmental Action Fund', 'Veterans for America', 'Small Business Alliance', 'Healthcare Reform PAC',
    'Education First Coalition', 'Infrastructure Now', 'National Security PAC', 'Immigration Reform Fund',
    'Taxpayers Alliance', 'Social Justice PAC', 'Law Enforcement Support', 'Climate Action Fund',
    'Rural Development PAC', 'Veterans Affairs Fund', 'Mental Health Coalition', 'Affordable Housing PAC',
    'Technology Innovation Fund', 'Agricultural PAC', 'Transportation PAC', 'Energy Independence Fund',
    'Criminal Justice Reform PAC', 'Workforce Development Fund', 'Small Business PAC', 'Manufacturing PAC',
    'Retail PAC', 'Healthcare PAC', 'Education PAC', 'Defense PAC', 'Homeland Security PAC'
  ];

  let totalDonations = 0;
  for (const candidate of allElectionCandidates) {
    const donationCount = Math.floor(Math.random() * 5) + 2; // 2-6 donations per candidate
    for (let i = 0; i < donationCount; i++) {
      const randomDonor = donorNames[Math.floor(Math.random() * donorNames.length)];
      const amount = (Math.random() * 10000 + 1000).toFixed(2);
      
      await prisma.electionCandidateDonation.create({
        data: {
          election_candidate_id: candidate.id,
          donor_name: randomDonor,
          donation_amount: amount,
          created_on: new Date(),
          created_by: 'seed',
          updated_on: new Date()
        }
      });
      totalDonations++;
    }
  }
  console.log(`✅ Created ${totalDonations} campaign donations for all candidates`);

  console.log('🎉 Database seeding completed successfully!');
  console.log(`📊 Summary: ${states.length} states, ${totalDistricts} districts, ${candidateCount} candidates, ${parties.length} parties, ${totalElections} elections, ${totalElectionCandidates} election candidates`);
  console.log(`📊 Comprehensive Data: ${totalKeyIssues} key issues, ${totalViews} views, ${totalHistories} histories, ${totalDonations} donations`);
  console.log('🗓️  All elections are scheduled for November 3, 2026 ONLY');
  console.log('🐕 Candidate profile pictures are random dog images from dog.ceo API');
  console.log('🌍 Comprehensive coverage: Presidential, Congressional (all districts), Senate (all states), Gubernatorial (all states)');
  console.log('✅ EVERY candidate has Key Issues, Views, History, and Donations data');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 