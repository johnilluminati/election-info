const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const router = express.Router();

const prisma = new PrismaClient();

// GET /api/parties - Get all political parties
router.get('/', async (req, res, next) => {
  try {
    const parties = await prisma.politicalParty.findMany({
      include: {
        _count: {
          select: {
            candidate_parties: true,
            election_candidates: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    res.json(parties);
  } catch (error) {
    next(error);
  }
});

// GET /api/parties/:id/candidates - Get candidates for a party (MUST come before /:id)
router.get('/:id/candidates', async (req, res, next) => {
  try {
    const { id } = req.params;
    const candidates = await prisma.candidateParty.findMany({
      where: { 
        political_party_id: BigInt(id),
        OR: [
          { end_date: null },
          { end_date: { gt: new Date() } }
        ]
      },
      include: {
        candidate: {
          include: {
            _count: {
              select: {
                election_candidates: true,
                candidate_histories: true,
                candidate_views: true
              }
            }
          }
        }
      },
      orderBy: [
        { candidate: { last_name: 'asc' } },
        { candidate: { first_name: 'asc' } }
      ]
    });
    
    res.json(candidates);
  } catch (error) {
    next(error);
  }
});

// GET /api/parties/:id - Get party by ID (MUST come after specific routes)
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const party = await prisma.politicalParty.findUnique({
      where: { id: BigInt(id) },
      include: {
        candidate_parties: {
          include: {
            candidate: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                nickname: true,
                picture_link: true
              }
            }
          },
          where: {
            OR: [
              { end_date: null },
              { end_date: { gt: new Date() } }
            ]
          }
        },
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
            election: {
              include: {
                election_cycle: true,
                election_type: true
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
    
    if (!party) {
      return res.status(404).json({ error: 'Party not found' });
    }
    
    res.json(party);
  } catch (error) {
    next(error);
  }
});

module.exports = router; 