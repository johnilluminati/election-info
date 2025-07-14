const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const router = express.Router();

const prisma = new PrismaClient();

// GET /api/candidates - Get all candidates with pagination
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
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
          _count: {
            select: {
              election_candidates: true,
              candidate_histories: true,
              candidate_views: true
            }
          }
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

module.exports = router; 