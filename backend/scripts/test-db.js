const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function test() {
  try {
    console.log('Testing database connection...');
    
    const stateCount = await prisma.uSState.count();
    console.log('States:', stateCount);
    
    const districtCount = await prisma.votingDistrict.count();
    console.log('Districts:', districtCount);
    
    const partyCount = await prisma.politicalParty.count();
    console.log('Parties:', partyCount);
    
    const candidateCount = await prisma.candidate.count();
    console.log('Candidates:', candidateCount);
    
    const electionCount = await prisma.election.count();
    console.log('Elections:', electionCount);
    
    const electionTypeCount = await prisma.electionType.count();
    console.log('Election Types:', electionTypeCount);
    
    const cycleCount = await prisma.electionCycle.count();
    console.log('Election Cycles:', cycleCount);
    
    const electionCandidateCount = await prisma.electionCandidate.count();
    console.log('Election Candidates:', electionCandidateCount);
    
    const keyIssueCount = await prisma.candidateKeyIssue.count();
    console.log('Candidate Key Issues:', keyIssueCount);
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

test(); 