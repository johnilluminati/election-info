const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const router = express.Router();

const prisma = new PrismaClient();

// GET /api/elections - Get all elections with filtering
router.get('/', async (req, res, next) => {
  try {
    const { 
      year, 
      type_id, 
      page = 1, 
      limit = 20,
      geography_type,
      geography_id,
      include_past = 'false'
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {};
    
    // Filter for upcoming elections unless include_past is true
    if (include_past !== 'true') {
      where.election_cycle = {
        election_day: {
          gt: new Date()
        }
      };
    }
    
    if (year) {
      where.election_cycle = {
        ...where.election_cycle,
        election_year: parseInt(year)
      };
    }
    
    if (type_id) {
      where.election_type_id = BigInt(type_id);
    }
    
    if (geography_type && geography_id) {
      where.geographies = {
        some: {
          scope_type: geography_type,
          scope_id: geography_id
        }
      };
    }
    
    const [elections, total] = await Promise.all([
      prisma.election.findMany({
        where,
        include: {
          election_cycle: true,
          election_type: true,
          geographies: true,
          election_candidates: {
            include: {
              candidate: {
                select: {
                  id: true,
                  first_name: true,
                  last_name: true,
                  nickname: true,
                  picture_link: true
                }
              },
              party: true,
              _count: {
                select: {
                  key_issues: true,
                  donations: true
                }
              }
            }
          },
          _count: {
            select: {
              election_candidates: true,
              geographies: true
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: [
          {
            election_cycle: {
              election_day: 'asc'
            }
          },
          {
            election_cycle: {
              election_year: 'asc'
            }
          }
        ]
      }),
      prisma.election.count({ where })
    ]);
    
    res.json({
      data: elections,
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

// GET /api/elections/cycles/all - Get all election cycles (MUST come before /:id)
router.get('/cycles/all', async (req, res, next) => {
  try {
    const { include_past = 'false' } = req.query;
    const where = {};
    
    if (include_past !== 'true') {
      where.election_day = {
        gt: new Date()
      };
    }
    
    const cycles = await prisma.electionCycle.findMany({
      where,
      include: {
        _count: {
          select: {
            elections: true
          }
        }
      },
      orderBy: [
        { election_day: 'asc' },
        { election_year: 'asc' }
      ]
    });
    
    res.json(cycles);
  } catch (error) {
    next(error);
  }
});

// GET /api/elections/types/all - Get all election types (MUST come before /:id)
router.get('/types/all', async (req, res, next) => {
  try {
    const types = await prisma.electionType.findMany({
      include: {
        _count: {
          select: {
            elections: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    res.json(types);
  } catch (error) {
    next(error);
  }
});

// GET /api/elections/:id - Get election by ID (MUST come after specific routes)
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const election = await prisma.election.findUnique({
      where: { id: BigInt(id) },
      include: {
        election_cycle: true,
        election_type: true,
        geographies: true,
        election_candidates: {
          include: {
            candidate: {
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
                candidate_views: {
                  include: {
                    view_category: true
                  }
                },
                candidate_histories: true
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
          }
        }
      }
    });
    
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }
    
    res.json(election);
  } catch (error) {
    next(error);
  }
});

// GET /api/elections/:id/candidates - Get candidates for an election
router.get('/:id/candidates', async (req, res, next) => {
  try {
    const { id } = req.params;
    const candidates = await prisma.electionCandidate.findMany({
      where: { election_id: BigInt(id) },
      include: {
        candidate: {
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
            candidate_views: {
              include: {
                view_category: true
              }
            },
            candidate_histories: true
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
      orderBy: [
        { party: { name: 'asc' } },
        { candidate: { last_name: 'asc' } }
      ]
    });
    
    res.json(candidates);
  } catch (error) {
    next(error);
  }
});

module.exports = router; 