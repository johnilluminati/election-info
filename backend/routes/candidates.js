const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const router = express.Router();

const prisma = new PrismaClient();

// GET /api/candidates - Get all candidates with pagination
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, state, election_type, party } = req.query;
    
    // If any of the filter parameters (including search) are provided, use the election candidates endpoint
    // This ensures we return ElectionCandidate objects with all nested relations
    if (state || election_type || party || search) {
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
    
    // Resolve state to abbreviation if state filter is provided
    // This must be done BEFORE building the where clause
    let stateAbbreviation = null;
    if (state) {
      // Check if state is a numeric ID
      if (/^\d+$/.test(state)) {
        // It's a state ID, look up the abbreviation
        const stateRecord = await prisma.uSState.findUnique({
          where: { id: BigInt(state) },
          select: { abbreviation: true }
        });
        if (stateRecord) {
          stateAbbreviation = stateRecord.abbreviation;
        }
      } else {
        // Check if it's already an abbreviation (2 uppercase letters)
        if (/^[A-Z]{2}$/.test(state.toUpperCase())) {
          stateAbbreviation = state.toUpperCase();
        } else {
          // It's likely a state name, try to find the abbreviation
          const stateRecord = await prisma.uSState.findFirst({
            where: {
              OR: [
                { name: { equals: state, mode: 'insensitive' } },
                { abbreviation: { equals: state.toUpperCase(), mode: 'insensitive' } }
              ]
            },
            select: { abbreviation: true }
          });
          if (stateRecord) {
            stateAbbreviation = stateRecord.abbreviation;
          } else {
            // Fallback: assume it's an abbreviation if we can't find it
            stateAbbreviation = state.length === 2 ? state.toUpperCase() : null;
          }
        }
      }
    }
    
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
      where.election = {
        election_type: {
          name: { contains: election_type, mode: 'insensitive' }
        }
      };
    }
    
    if (party) {
      where.party = {
        name: { contains: party, mode: 'insensitive' }
      };
    }
    
    // Filter by state - only match STATE geography type with exact abbreviation match
    // This prevents matching district codes like "AL01" when searching for "AK"
    if (stateAbbreviation) {
      if (!where.election) {
        where.election = {};
      }
      where.election.geographies = {
        some: {
          scope_type: 'STATE',
          scope_id: stateAbbreviation
        }
      };
    }
    
    // For listing/searching, we don't need heavy relations like donations, views, or histories
    // These should only be loaded when viewing individual candidate details
    const [electionCandidates, total] = await Promise.all([
      prisma.electionCandidate.findMany({
        where,
        include: {
          candidate: {
            // Include basic candidate fields only - exclude heavy relations
            // candidate_views and candidate_histories removed for performance
          },
          party: true,
          election: {
            include: {
              election_cycle: true,
              election_type: true,
              geographies: true // Needed for grouping by state/district
            }
          }
          // Exclude key_issues and donations - too heavy for listing, should be loaded on demand
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
        donor: true,
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

// GET /api/candidates/views/:viewId/votes - Get votes related to a candidate view
router.get('/views/:viewId/votes', async (req, res, next) => {
  try {
    const { viewId } = req.params;
    const votes = await prisma.candidateVote.findMany({
      where: {
        candidate_view_id: BigInt(viewId)
      },
      include: {
        conflicts: true
      },
      orderBy: {
        vote_date: 'desc'
      }
    });
    res.json(votes);
  } catch (error) {
    next(error);
  }
});

// GET /api/candidates/views/:viewId/legislation - Get legislation related to a candidate view
router.get('/views/:viewId/legislation', async (req, res, next) => {
  try {
    const { viewId } = req.params;
    const legislation = await prisma.candidateLegislation.findMany({
      where: {
        candidate_view_id: BigInt(viewId)
      },
      include: {
        conflicts: true
      },
      orderBy: {
        date: 'desc'
      }
    });
    res.json(legislation);
  } catch (error) {
    next(error);
  }
});

// GET /api/candidates/views/:viewId/related-content - Get all related content (votes + legislation) for a view
router.get('/views/:viewId/related-content', async (req, res, next) => {
  try {
    const { viewId } = req.params;
    const [votes, legislation] = await Promise.all([
      prisma.candidateVote.findMany({
        where: {
          candidate_view_id: BigInt(viewId)
        },
        include: {
          conflicts: true
        },
        orderBy: {
          vote_date: 'desc'
        }
      }),
      prisma.candidateLegislation.findMany({
        where: {
          candidate_view_id: BigInt(viewId)
        },
        include: {
          conflicts: true
        },
        orderBy: {
          date: 'desc'
        }
      })
    ]);
    res.json({ votes, legislation });
  } catch (error) {
    next(error);
  }
});

// GET /api/candidates/donors/:donorName - Get donor information by name
router.get('/donors/:donorName', async (req, res, next) => {
  try {
    const { donorName } = req.params;
    const donor = await prisma.donor.findUnique({
      where: {
        name: decodeURIComponent(donorName)
      }
    });
    if (!donor) {
      return res.status(404).json({ error: 'Donor not found' });
    }
    res.json(donor);
  } catch (error) {
    next(error);
  }
});

// POST /api/candidates/donors/batch - Get donor information for multiple donor names
router.post('/donors/batch', async (req, res, next) => {
  try {
    const { donorNames } = req.body;
    if (!Array.isArray(donorNames)) {
      return res.status(400).json({ error: 'donorNames must be an array' });
    }
    
    const donors = await prisma.donor.findMany({
      where: {
        name: {
          in: donorNames
        }
      }
    });
    
    // Create a map for quick lookup
    const donorMap = {};
    donors.forEach(donor => {
      donorMap[donor.name] = donor;
    });
    
    res.json(donorMap);
  } catch (error) {
    next(error);
  }
});

// GET /api/candidates/election-candidate/:id - Get election candidate by ID with all relations for modal
router.get('/election-candidate/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const electionCandidate = await prisma.electionCandidate.findUnique({
      where: { id: BigInt(id) },
      include: {
        candidate: {
          include: {
            candidate_views: {
              include: {
                view_category: true
              }
            },
            candidate_histories: {
              orderBy: {
                created_on: 'desc'
              }
            }
          }
        },
        party: true,
        election: {
          include: {
            election_cycle: true,
            election_type: true,
            geographies: true
          }
        },
        key_issues: {
          orderBy: {
            order_of_important: 'asc'
          }
        },
        donations: {
          include: {
            donor: true
          },
          orderBy: {
            donation_amount: 'desc'
          }
        }
      }
    });
    
    if (!electionCandidate) {
      return res.status(404).json({ error: 'Election candidate not found' });
    }
    
    res.json(electionCandidate);
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
    
    res.json({
      message: 'Sample geography data structure',
      sampleCount: sampleData.length,
      sampleData
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 