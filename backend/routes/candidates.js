const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const router = express.Router();

const prisma = new PrismaClient();

// GET /api/candidates - Get all candidates with pagination
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, state, election_type, party } = req.query;
    
    // If any of the new filter parameters are provided, use the election candidates endpoint
    if (state || election_type || party) {
      return await getElectionCandidates(req, res, next);
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = search ? {
      OR: [
        { first_name: { contains: search, mode: 'insensitive' } },
        { last_name: { contains: search, mode: 'insensitive' } },
        { nickname: { contains: search, mode: 'insensitive' } }
      ]
    } : {};
    
    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        where,
        include: {
          candidate_parties: {
            include: {
              political_party: true
            },
            where: {
              OR: [
                { end_date: null },
                { end_date: { gt: new Date() } }
              ]
            }
          },
        },
        skip,
        take: parseInt(limit),
        orderBy: [
          { last_name: 'asc' },
          { first_name: 'asc' }
        ]
      }),
      prisma.candidate.count({ where })
    ]);
    
    res.json({
      candidates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Helper function to get election candidates with filtering
async function getElectionCandidates(req, res, next) {
  try {
    const { search, state, election_type, party, page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    console.log('getElectionCandidates called with:', { search, state, election_type, party, page, limit });
    
    // Build where clause for filtering
    const where = {};
    
    if (search) {
      where.OR = [
        { candidate: { first_name: { contains: search, mode: 'insensitive' } } },
        { candidate: { last_name: { contains: search, mode: 'insensitive' } } },
        { candidate: { nickname: { contains: search, mode: 'insensitive' } } }
      ];
    }
    
    if (election_type) {
      console.log('Adding election_type filter:', election_type);
      where.election = {
        election_type: {
          name: { contains: election_type, mode: 'insensitive' }
        }
      };
    }
    
    if (party) {
      console.log('Adding party filter:', party);
      where.party = {
        name: { contains: party, mode: 'insensitive' }
      };
    }
    
         if (state) {
       console.log('Adding state filter:', state);
       
       // Try to find the state in the geographies
       // Since we don't know the exact structure yet, let's try a few approaches
       if (!where.election) {
         where.election = {};
       }
       
       where.election.geographies = {
         some: {
           OR: [
             // Try exact match first
             { scope_id: { equals: state } },
             // Try contains match
             { scope_id: { contains: state, mode: 'insensitive' } },
             // Try with state abbreviation (e.g., "DE" for "Delaware")
             { scope_id: { contains: state.substring(0, 2).toUpperCase(), mode: 'insensitive' } },
             // Try with state abbreviation (e.g., "Del" for "Delaware")
             { scope_id: { contains: state.substring(0, 3).toLowerCase(), mode: 'insensitive' } }
           ]
         }
       };
     }
    
    const [electionCandidates, total] = await Promise.all([
      prisma.electionCandidate.findMany({
        where,
        include: {
          candidate: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              nickname: true,
              picture_link: true,
              created_on: true,
              created_by: true,
              updated_on: true,
              updated_by: true
            }
          },
          party: true,
          election: {
            include: {
              election_cycle: true,
              election_type: true,
              geographies: true
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: [
          { candidate: { last_name: 'asc' } },
          { candidate: { first_name: 'asc' } }
        ]
      }),
      prisma.electionCandidate.count({ where })
    ]);
    
    res.json({
      data: electionCandidates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error in getElectionCandidates:', error);
    next(error);
  }
}

// GET /api/candidates/:id/elections - Get elections for a candidate (MUST come before /:id)
router.get('/:id/elections', async (req, res, next) => {
  try {
    const { id } = req.params;
    const elections = await prisma.electionCandidate.findMany({
      where: { candidate_id: BigInt(id) },
      include: {
        election: {
          include: {
            election_cycle: true,
            election_type: true,
            geographies: true
          }
        },
        party: true,
        key_issues: {
          orderBy: {
            order_of_important: 'asc'
          }
        }
      },
      orderBy: {
        election: {
          election_cycle: {
            election_year: 'desc'
          }
        }
      }
    });
    
    res.json(elections);
  } catch (error) {
    next(error);
  }
});

// GET /api/candidates/:id/key-issues - Get key issues for a candidate (MUST come before /:id)
router.get('/:id/key-issues', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { election_id } = req.query;
    
    const where = {
      election_candidate: {
        candidate_id: BigInt(id)
      }
    };
    
    if (election_id) {
      where.election_candidate.election_id = BigInt(election_id);
    }
    
    const keyIssues = await prisma.candidateKeyIssue.findMany({
      where,
      include: {
        election_candidate: {
          include: {
            election: {
              include: {
                election_cycle: true,
                election_type: true
              }
            }
          }
        }
      },
      orderBy: [
        {
          election_candidate: {
            election: {
              election_cycle: {
                election_year: 'desc'
              }
            }
          }
        },
        { order_of_important: 'asc' }
      ]
    });
    
    res.json(keyIssues);
  } catch (error) {
    next(error);
  }
});

// GET /api/candidates/:id/donations - Get donations for a candidate (MUST come before /:id)
router.get('/:id/donations', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { election_id } = req.query;
    
    const where = {
      election_candidate: {
        candidate_id: BigInt(id)
      }
    };
    
    if (election_id) {
      where.election_candidate.election_id = BigInt(election_id);
    }
    
    const donations = await prisma.electionCandidateDonation.findMany({
      where,
      include: {
        election_candidate: {
          include: {
            election: {
              include: {
                election_cycle: true,
                election_type: true
              }
            }
          }
        }
      },
      orderBy: [
        {
          election_candidate: {
            election: {
              election_cycle: {
                election_year: 'desc'
              }
            }
          }
        },
        { donation_amount: 'desc' }
      ]
    });
    
    res.json(donations);
  } catch (error) {
    next(error);
  }
});

// GET /api/candidates/:id - Get candidate by ID (MUST come after specific routes)
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const candidate = await prisma.candidate.findUnique({
      where: { id: BigInt(id) },
      include: {
        candidate_parties: {
          include: {
            political_party: true
          },
          orderBy: {
            start_date: 'desc'
          }
        },
        candidate_histories: {
          orderBy: {
            created_on: 'desc'
          }
        },
        candidate_views: {
          include: {
            view_category: true
          }
        },
        election_candidates: {
          include: {
            election: {
              include: {
                election_cycle: true,
                election_type: true
              }
            },
            party: true,
            key_issues: {
              orderBy: {
                order_of_important: 'asc'
              }
            },
            donations: {
              orderBy: {
                donation_amount: 'desc'
              }
            }
          },
          orderBy: {
            election: {
              election_cycle: {
                election_year: 'desc'
              }
            }
          }
        }
      }
    });
    
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    res.json(candidate);
  } catch (error) {
    next(error);
  }
});

// GET /api/candidates/debug/geography - Debug endpoint to see geography data structure
router.get('/debug/geography', async (req, res, next) => {
  try {
    const { state, election_type, party } = req.query;
    
    console.log('Debug geography request:', { state, election_type, party });
    
    // Get a sample of election candidates with their geography data
    const sampleData = await prisma.electionCandidate.findMany({
      take: 5,
      include: {
        candidate: true,
        party: true,
        election: {
          include: {
            election_type: true,
            geographies: true
          }
        }
      }
    });
    
    console.log('Sample data structure:', JSON.stringify(sampleData, null, 2));
    
    res.json({
      message: 'Check server console for sample data structure',
      sampleCount: sampleData.length,
      sampleData
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    next(error);
  }
});

module.exports = router; 