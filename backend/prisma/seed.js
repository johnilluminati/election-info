const { PrismaClient } = require('../generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Load real state and district data
  const dataPath = path.join(__dirname, '../data/states-and-districts.json');
  const geoData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  // Create all US States from real data
  console.log('Creating US States from real data...');
  const createdStates = [];
  for (const state of geoData.states) {
    const createdState = await prisma.uSState.upsert({
      where: { fips_code: state.fips_code },
      update: {},
      create: {
        name: state.name,
        abbreviation: state.abbreviation,
        fips_code: state.fips_code
      }
    });
    createdStates.push(createdState);
  }
  console.log(`✅ Created ${geoData.states.length} US States`);

  // Create Voting Districts from nested state data
  console.log('Creating Voting Districts from real data...');
  let totalDistricts = 0;
  for (const state of geoData.states) {
    if (state.districts && state.districts.length > 0) {
      for (const districtCode of state.districts) {
        await prisma.votingDistrict.upsert({
          where: { district_code: districtCode },
          update: {},
          create: {
            us_state_id: createdStates.find(s => s.fips_code === state.fips_code).id,
            district_code: districtCode
          }
        });
        totalDistricts++;
      }
    }
  }
  console.log(`✅ Created ${totalDistricts} Voting Districts`);

  // Create Counties from real data
  console.log('Creating Counties from real data...');
  let totalCounties = 0;
  for (const county of geoData.counties) {
    // Extract state FIPS code from county FIPS code (first 2 digits)
    const stateFipsCode = county.county_fips_code.substring(0, 2);
    const state = createdStates.find(s => s.fips_code === stateFipsCode);
    
    if (state) {
      await prisma.uSCounty.upsert({
        where: { fips_code: county.county_fips_code },
        update: {},
        create: {
          name: county.county_name,
          fips_code: county.county_fips_code,
          us_state_id: state.id
        }
      });
      totalCounties++;
    }
  }
  console.log(`✅ Created ${totalCounties} Counties`);

  // Political Parties data
  const parties = [
    { name: 'Democratic Party', party_code: 'DEM' },
    { name: 'Republican Party', party_code: 'REP' },
    { name: 'Libertarian Party', party_code: 'LIB' },
    { name: 'Green Party', party_code: 'GRN' },
    { name: 'Independent', party_code: 'IND' },
    { name: 'Reform Party', party_code: 'REF' },
    { name: 'Constitution Party', party_code: 'CON' }
  ];

  console.log('Creating Political Parties...');
  const createdParties = [];
  for (const party of parties) {
    const createdParty = await prisma.politicalParty.upsert({
      where: { party_code: party.party_code },
      update: {},
      create: {
        ...party,
        created_at: new Date(),
        created_by: 'seed',
        updated_at: new Date()
      }
    });
    createdParties.push(createdParty);
  }
  console.log(`✅ Created ${parties.length} Political Parties`);

  // Comprehensive candidates data
  const candidates = [
    {
      first_name: 'John',
      last_name: 'Smith',
      nickname: 'Johnny',
      picture_link: 'https://example.com/john-smith.jpg'
    },
    {
      first_name: 'Jane',
      last_name: 'Doe',
      nickname: null,
      picture_link: 'https://example.com/jane-doe.jpg'
    },
    {
      first_name: 'Michael',
      last_name: 'Johnson',
      nickname: 'Mike',
      picture_link: 'https://example.com/mike-johnson.jpg'
    },
    {
      first_name: 'Sarah',
      last_name: 'Williams',
      nickname: null,
      picture_link: 'https://example.com/sarah-williams.jpg'
    },
    {
      first_name: 'Robert',
      last_name: 'Brown',
      nickname: 'Bob',
      picture_link: 'https://example.com/bob-brown.jpg'
    },
    {
      first_name: 'Lisa',
      last_name: 'Garcia',
      nickname: null,
      picture_link: 'https://example.com/lisa-garcia.jpg'
    },
    {
      first_name: 'David',
      last_name: 'Miller',
      nickname: 'Dave',
      picture_link: 'https://example.com/dave-miller.jpg'
    },
    {
      first_name: 'Jennifer',
      last_name: 'Davis',
      nickname: 'Jen',
      picture_link: 'https://example.com/jen-davis.jpg'
    },
    {
      first_name: 'Christopher',
      last_name: 'Wilson',
      nickname: 'Chris',
      picture_link: 'https://example.com/chris-wilson.jpg'
    },
    {
      first_name: 'Amanda',
      last_name: 'Taylor',
      nickname: null,
      picture_link: 'https://example.com/amanda-taylor.jpg'
    }
  ];

  console.log('Creating Candidates...');
  const createdCandidates = [];
  for (const candidate of candidates) {
    const created = await prisma.candidate.create({
      data: {
        ...candidate,
        created_on: new Date(),
        created_by: 'seed',
        updated_on: new Date()
      }
    });
    createdCandidates.push(created);
  }
  console.log(`✅ Created ${candidates.length} Candidates`);

  // Create multiple Election Cycles
  const electionCycles = [
    {
      election_year: 2024,
      election_day: new Date('2024-11-05')
    },
    {
      election_year: 2022,
      election_day: new Date('2022-11-08')
    },
    {
      election_year: 2020,
      election_day: new Date('2020-11-03')
    },
    {
      election_year: 2018,
      election_day: new Date('2018-11-06')
    }
  ];

  console.log('Creating Election Cycles...');
  const createdElectionCycles = [];
  for (const cycle of electionCycles) {
    const createdCycle = await prisma.electionCycle.create({
      data: {
        ...cycle,
        created_on: new Date(),
        created_by: 'seed',
        updated_on: new Date()
      }
    });
    createdElectionCycles.push(createdCycle);
  }
  console.log(`✅ Created ${electionCycles.length} Election Cycles`);

  // Get party references
  const democraticParty = createdParties.find(p => p.party_code === 'DEM');
  const republicanParty = createdParties.find(p => p.party_code === 'REP');
  const libertarianParty = createdParties.find(p => p.party_code === 'LIB');
  const greenParty = createdParties.find(p => p.party_code === 'GRN');
  const independentParty = createdParties.find(p => p.party_code === 'IND');

  // Create multiple Elections (different types)
  const elections = [
    {
      election_cycle_id: createdElectionCycles[0].id, // 2024
      election_type_id: 1, // Presidential
      candidates: [
        { candidate_id: 0, party_id: democraticParty.id, website: 'https://johnsmith2024.com' },
        { candidate_id: 1, party_id: republicanParty.id, website: 'https://janedoe2024.com' },
        { candidate_id: 2, party_id: libertarianParty.id, website: 'https://mikejohnson2024.com' }
      ]
    },
    {
      election_cycle_id: createdElectionCycles[0].id, // 2024
      election_type_id: 2, // Congressional
      candidates: [
        { candidate_id: 3, party_id: democraticParty.id, website: 'https://sarahwilliams2024.com' },
        { candidate_id: 4, party_id: republicanParty.id, website: 'https://bobbrown2024.com' },
        { candidate_id: 5, party_id: greenParty.id, website: 'https://lisagarcia2024.com' }
      ]
    },
    {
      election_cycle_id: createdElectionCycles[1].id, // 2022
      election_type_id: 2, // Congressional
      candidates: [
        { candidate_id: 6, party_id: democraticParty.id, website: 'https://davemiller2022.com' },
        { candidate_id: 7, party_id: republicanParty.id, website: 'https://jendavis2022.com' }
      ]
    },
    {
      election_cycle_id: createdElectionCycles[2].id, // 2020
      election_type_id: 1, // Presidential
      candidates: [
        { candidate_id: 8, party_id: democraticParty.id, website: 'https://chriswilson2020.com' },
        { candidate_id: 9, party_id: republicanParty.id, website: 'https://amandataylor2020.com' },
        { candidate_id: 0, party_id: independentParty.id, website: 'https://johnsmith2020.com' }
      ]
    }
  ];

  console.log('Creating Elections and Election Candidates...');
  const createdElectionCandidates = [];
  for (const electionData of elections) {
    const election = await prisma.election.create({
      data: {
        election_cycle_id: electionData.election_cycle_id,
        election_type_id: electionData.election_type_id,
        created_on: new Date(),
        created_by: 'seed',
        updated_on: new Date()
      }
    });

    // Create election candidates for this election
    for (const candidateData of electionData.candidates) {
      const created = await prisma.electionCandidate.create({
        data: {
          election_id: election.id,
          candidate_id: createdCandidates[candidateData.candidate_id].id,
          party_id: candidateData.party_id,
          website: candidateData.website,
          created_on: new Date(),
          created_by: 'seed',
          updated_on: new Date()
        }
      });
      createdElectionCandidates.push(created);
    }
  }
  console.log(`✅ Created ${elections.length} Elections with ${createdElectionCandidates.length} Election Candidates`);

  // Create comprehensive key issues for candidates
  const keyIssues = [
    // John Smith (Democratic) - 2024 Presidential
    {
      election_candidate_id: createdElectionCandidates[0].id,
      issue_text: 'Climate Change',
      order_of_important: 1,
      view_text: 'We need to take immediate action to address climate change through renewable energy investments and carbon pricing.'
    },
    {
      election_candidate_id: createdElectionCandidates[0].id,
      issue_text: 'Healthcare Reform',
      order_of_important: 2,
      view_text: 'Universal healthcare should be accessible to all Americans through a public option and expanded Medicaid.'
    },
    {
      election_candidate_id: createdElectionCandidates[0].id,
      issue_text: 'Education',
      order_of_important: 3,
      view_text: 'Free community college and student debt relief are essential for economic mobility.'
    },
    
    // Jane Doe (Republican) - 2024 Presidential
    {
      election_candidate_id: createdElectionCandidates[1].id,
      issue_text: 'Economic Growth',
      order_of_important: 1,
      view_text: 'Focus on free market principles to drive economic growth and job creation through tax cuts and deregulation.'
    },
    {
      election_candidate_id: createdElectionCandidates[1].id,
      issue_text: 'National Security',
      order_of_important: 2,
      view_text: 'Strengthen our borders and maintain a strong military presence to protect American interests.'
    },
    {
      election_candidate_id: createdElectionCandidates[1].id,
      issue_text: 'Second Amendment',
      order_of_important: 3,
      view_text: 'Protect constitutional rights including the right to bear arms.'
    },

    // Mike Johnson (Libertarian) - 2024 Presidential
    {
      election_candidate_id: createdElectionCandidates[2].id,
      issue_text: 'Limited Government',
      order_of_important: 1,
      view_text: 'Reduce government intervention in personal and economic decisions.'
    },
    {
      election_candidate_id: createdElectionCandidates[2].id,
      issue_text: 'Civil Liberties',
      order_of_important: 2,
      view_text: 'Protect individual freedoms and privacy rights from government overreach.'
    },

    // Sarah Williams (Democratic) - 2024 Congressional
    {
      election_candidate_id: createdElectionCandidates[3].id,
      issue_text: 'Infrastructure',
      order_of_important: 1,
      view_text: 'Invest in roads, bridges, and broadband infrastructure to create jobs and improve connectivity.'
    },
    {
      election_candidate_id: createdElectionCandidates[3].id,
      issue_text: 'Small Business Support',
      order_of_important: 2,
      view_text: 'Provide tax incentives and access to capital for small businesses and entrepreneurs.'
    },

    // Bob Brown (Republican) - 2024 Congressional
    {
      election_candidate_id: createdElectionCandidates[4].id,
      issue_text: 'Fiscal Responsibility',
      order_of_important: 1,
      view_text: 'Balance the budget and reduce national debt through spending cuts and economic growth.'
    },
    {
      election_candidate_id: createdElectionCandidates[4].id,
      issue_text: 'Energy Independence',
      order_of_important: 2,
      view_text: 'Develop domestic energy resources including oil, gas, and nuclear power.'
    },

    // Lisa Garcia (Green) - 2024 Congressional
    {
      election_candidate_id: createdElectionCandidates[5].id,
      issue_text: 'Environmental Justice',
      order_of_important: 1,
      view_text: 'Address environmental racism and ensure clean air and water for all communities.'
    },
    {
      election_candidate_id: createdElectionCandidates[5].id,
      issue_text: 'Social Justice',
      order_of_important: 2,
      view_text: 'Fight for racial equality, LGBTQ+ rights, and criminal justice reform.'
    }
  ];

  console.log('Creating Candidate Key Issues...');
  for (const issue of keyIssues) {
    await prisma.candidateKeyIssue.create({
      data: {
        ...issue,
        created_on: new Date(),
        created_by: 'seed',
        updated_on: new Date()
      }
    });
  }
  console.log(`✅ Created ${keyIssues.length} Candidate Key Issues`);

  console.log('🎉 Database seeding completed successfully!');
  console.log(`📊 Summary: ${geoData.states.length} states, ${totalDistricts} districts, ${totalCounties} counties, ${candidates.length} candidates, ${parties.length} parties, ${elections.length} elections, ${keyIssues.length} key issues`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 