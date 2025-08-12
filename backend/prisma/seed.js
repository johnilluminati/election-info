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

// Generate sample counties for each state
function generateCountiesForState(stateAbbr, stateId) {
  const countyCounts = {
    'TX': 254, 'GA': 159, 'VA': 133, 'KY': 120, 'MO': 115, 'KS': 105, 'IL': 102, 'NC': 100, 'IA': 99, 'TN': 95,
    'NE': 93, 'IN': 92, 'OH': 88, 'MN': 87, 'MI': 83, 'MS': 82, 'AR': 75, 'WI': 72, 'OK': 77, 'PA': 67,
    'FL': 67, 'NY': 62, 'AL': 67, 'LA': 64, 'SC': 46, 'WV': 55, 'MD': 23, 'WA': 39, 'OR': 36, 'CA': 58,
    'CO': 64, 'NV': 16, 'UT': 29, 'AZ': 15, 'ID': 44, 'MT': 56, 'WY': 23, 'ND': 53, 'SD': 66, 'KS': 105,
    'OK': 77, 'NM': 33, 'TX': 254, 'LA': 64, 'AR': 75, 'MS': 82, 'TN': 95, 'KY': 120, 'VA': 133, 'NC': 100,
    'SC': 46, 'GA': 159, 'FL': 67, 'AL': 67, 'MS': 82, 'TN': 95, 'KY': 120, 'OH': 88, 'IN': 92, 'IL': 102,
    'MI': 83, 'WI': 72, 'MN': 87, 'IA': 99, 'MO': 115, 'AR': 75, 'LA': 64, 'OK': 77, 'TX': 254, 'KS': 105,
    'NE': 93, 'SD': 66, 'ND': 53, 'MT': 56, 'WY': 23, 'CO': 64, 'NM': 33, 'AZ': 15, 'UT': 29, 'ID': 44,
    'NV': 16, 'WA': 39, 'OR': 36, 'CA': 58, 'HI': 5, 'AK': 19
  };
  
  const count = Math.min(countyCounts[stateAbbr] || 10, 20); // Limit to 20 for performance
  const counties = [];
  
  for (let i = 1; i <= count; i++) {
    counties.push({
      name: `${stateAbbr} County ${i}`,
      fips_code: `${stateAbbr}${i.toString().padStart(3, '0')}`,
      us_state_id: stateId
    });
  }
  
  return counties;
}

// Generate unique candidate names
function generateCandidateNames(count) {
  const firstNames = [
    'Marcus', 'Elizabeth', 'James', 'Aisha', 'Robert', 'Sofia', 'David', 'Jennifer', 'Christopher', 'Maria',
    'Michael', 'Sarah', 'William', 'Emily', 'John', 'Jessica', 'Richard', 'Ashley', 'Joseph', 'Amanda',
    'Thomas', 'Nicole', 'Charles', 'Stephanie', 'Christopher', 'Rachel', 'Daniel', 'Lauren', 'Matthew', 'Megan',
    'Anthony', 'Heather', 'Mark', 'Brittany', 'Donald', 'Danielle', 'Steven', 'Melissa', 'Paul', 'Christina',
    'Andrew', 'Kelly', 'Joshua', 'Tiffany', 'Kenneth', 'Crystal', 'Kevin', 'Amber', 'Brian', 'Stephanie',
    'George', 'Natalie', 'Timothy', 'Heather', 'Ronald', 'Melissa', 'Jason', 'Nicole', 'Edward', 'Christina',
    'Jeffrey', 'Amanda', 'Ryan', 'Brittany', 'Jacob', 'Danielle', 'Gary', 'Megan', 'Nicholas', 'Lauren',
    'Eric', 'Rachel', 'Jonathan', 'Stephanie', 'Stephen', 'Ashley', 'Larry', 'Jessica', 'Justin', 'Emily',
    'Scott', 'Sarah', 'Brandon', 'Nicole', 'Benjamin', 'Amanda', 'Samuel', 'Brittany', 'Frank', 'Danielle',
    'Gregory', 'Megan', 'Raymond', 'Lauren', 'Alexander', 'Rachel', 'Patrick', 'Stephanie', 'Jack', 'Ashley',
    'Dennis', 'Jessica', 'Jerry', 'Emily', 'Tyler', 'Sarah', 'Aaron', 'Nicole', 'Jose', 'Amanda',
    'Adam', 'Brittany', 'Nathan', 'Danielle', 'Henry', 'Megan', 'Douglas', 'Lauren', 'Zachary', 'Rachel',
    'Peter', 'Stephanie', 'Kyle', 'Ashley', 'Walter', 'Jessica', 'Ethan', 'Emily', 'Jeremy', 'Sarah',
    'Harold', 'Nicole', 'Carl', 'Amanda', 'Keith', 'Brittany', 'Roger', 'Danielle', 'Gerald', 'Megan',
    'Christian', 'Lauren', 'Terry', 'Rachel', 'Sean', 'Stephanie', 'Gavin', 'Ashley', 'Austin', 'Jessica',
    'Noah', 'Emily', 'Lucas', 'Sarah', 'Mason', 'Nicole', 'Oliver', 'Amanda', 'Carter', 'Brittany',
    'Elijah', 'Danielle', 'Sebastian', 'Megan', 'William', 'Lauren', 'James', 'Rachel', 'Benjamin', 'Stephanie',
    'Lucas', 'Ashley', 'Mason', 'Jessica', 'Ethan', 'Emily', 'Alexander', 'Sarah', 'Henry', 'Nicole',
    'Jacob', 'Amanda', 'Michael', 'Brittany', 'Daniel', 'Danielle', 'Logan', 'Megan', 'Jackson', 'Lauren',
    'Sebastian', 'Rachel', 'Jack', 'Stephanie', 'Owen', 'Ashley', 'Dylan', 'Jessica', 'Nathan', 'Emily',
    'Isaac', 'Sarah', 'Ryan', 'Nicole', 'Adam', 'Amanda', 'Robert', 'Brittany', 'Tyler', 'Danielle',
    'Nicholas', 'Megan', 'Evan', 'Lauren', 'Gavin', 'Rachel', 'Miles', 'Stephanie', 'Jace', 'Ashley'
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
    'Palmer', 'Wagner', 'Black', 'Robertson', 'Boyd', 'Rose', 'Stone', 'Spencer', 'Grant', 'Ward',
    'Torres', 'Peterson', 'Gray', 'Ramirez', 'James', 'Watson', 'Brooks', 'Kelly', 'Sanders', 'Price',
    'Bennett', 'Wood', 'Barnes', 'Ross', 'Henderson', 'Coleman', 'Jenkins', 'Perry', 'Powell', 'Long',
    'Patterson', 'Hughes', 'Flores', 'Washington', 'Butler', 'Simmons', 'Foster', 'Gonzales', 'Bryant', 'Alexander',
    'Russell', 'Griffin', 'Diaz', 'Hayes', 'Myers', 'Ford', 'Hamilton', 'Graham', 'Sullivan', 'Wallace',
    'Woods', 'Cole', 'West', 'Jordan', 'Owens', 'Reynolds', 'Fisher', 'Ellis', 'Harrison', 'Gibson',
    'Mcdonald', 'Cruz', 'Marshall', 'Ortiz', 'Gomez', 'Murray', 'Freeman', 'Wells', 'Webb', 'Simpson',
    'Stevens', 'Tucker', 'Porter', 'Hunter', 'Hicks', 'Crawford', 'Henry', 'Boyd', 'Mason', 'Morris',
    'Morgan', 'Hunt', 'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim',
    'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray'
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

  // Create Counties for all states
  console.log('Creating Counties for all states...');
  let totalCounties = 0;
  
  for (const state of createdStates) {
    const counties = generateCountiesForState(state.abbreviation, state.id);
    for (const county of counties) {
      await prisma.uSCounty.create({
        data: county
      });
      totalCounties++;
    }
  }
  console.log(`✅ Created ${totalCounties} Counties`);

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

  // Create Election Cycle for November 3, 2026
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

  // Generate candidates for all elections (need many more for comprehensive coverage)
  console.log('Generating comprehensive candidate list...');
  const candidateCount = 5000; // Generate 5000 unique candidates to cover all elections
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

  // Create comprehensive elections for all states
  console.log('Creating comprehensive elections for all states...');
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

  // Create sample key issues for some candidates
  console.log('Creating sample key issues...');
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
  const electionCandidates = await prisma.electionCandidate.findMany({
    take: 100 // Limit to first 100 for performance
  });

  for (const candidate of electionCandidates) {
    const issueCount = Math.floor(Math.random() * 3) + 1;
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
  console.log(`✅ Created ${totalKeyIssues} sample key issues`);

  // Create sample donations
  console.log('Creating sample campaign donations...');
  const donorNames = [
    'Progressive PAC', 'Conservative Coalition', 'Liberty Fund', 'Labor Union Local 123', 'Business Roundtable',
    'Environmental Action Fund', 'Veterans for America', 'Small Business Alliance', 'Healthcare Reform PAC',
    'Education First Coalition', 'Infrastructure Now', 'National Security PAC', 'Immigration Reform Fund',
    'Taxpayers Alliance', 'Social Justice PAC', 'Law Enforcement Support', 'Climate Action Fund',
    'Rural Development PAC', 'Veterans Affairs Fund', 'Mental Health Coalition', 'Affordable Housing PAC'
  ];

  let totalDonations = 0;
  for (let i = 0; i < 200; i++) {
    const randomCandidate = electionCandidates[Math.floor(Math.random() * electionCandidates.length)];
    const randomDonor = donorNames[Math.floor(Math.random() * donorNames.length)];
    const amount = (Math.random() * 10000 + 1000).toFixed(2);
    
    await prisma.electionCandidateDonation.create({
      data: {
        election_candidate_id: randomCandidate.id,
        donor_name: randomDonor,
        donation_amount: amount,
        created_on: new Date(),
        created_by: 'seed',
        updated_on: new Date()
      }
    });
    totalDonations++;
  }
  console.log(`✅ Created ${totalDonations} sample donations`);

  console.log('🎉 Database seeding completed successfully!');
  console.log(`📊 Summary: ${states.length} states, ${totalDistricts} districts, ${totalCounties} counties, ${candidateCount} candidates, ${parties.length} parties, ${totalElections} elections, ${totalElectionCandidates} election candidates, ${totalKeyIssues} key issues, ${totalDonations} donations`);
  console.log('🗓️  All elections are scheduled for November 3, 2026 (future date)');
  console.log('🐕 Candidate profile pictures are random dog images from dog.ceo API');
  console.log('🌍 Comprehensive coverage: Presidential, Congressional (all districts), Senate (all states), Gubernatorial (all states)');
  console.log('🔄 Candidates are reused across elections to ensure comprehensive coverage');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 