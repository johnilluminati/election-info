const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const router = express.Router();

const prisma = new PrismaClient();

// GET /api/states - Get all states
router.get('/', async (req, res, next) => {
  try {
    const states = await prisma.uSState.findMany({
      include: {
        _count: {
          select: {
            cities: true,
            counties: true,
            districts: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    res.json(states);
  } catch (error) {
    next(error);
  }
});

// GET /api/states/:id - Get state by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const state = await prisma.uSState.findUnique({
      where: { id: BigInt(id) },
      include: {
        cities: {
          include: {
            counties: {
              include: {
                county: true
              }
            }
          }
        },
        counties: true,
        districts: true
      }
    });
    
    if (!state) {
      return res.status(404).json({ error: 'State not found' });
    }
    
    res.json(state);
  } catch (error) {
    next(error);
  }
});

// GET /api/states/:id/counties - Get counties for a state
router.get('/:id/counties', async (req, res, next) => {
  try {
    const { id } = req.params;
    const counties = await prisma.uSCounty.findMany({
      where: { us_state_id: BigInt(id) },
      include: {
        _count: {
          select: {
            cities: true,
            districts: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    res.json(counties);
  } catch (error) {
    next(error);
  }
});

// GET /api/states/:id/cities - Get cities for a state
router.get('/:id/cities', async (req, res, next) => {
  try {
    const { id } = req.params;
    const cities = await prisma.uSCity.findMany({
      where: { us_state_id: BigInt(id) },
      include: {
        counties: {
          include: {
            county: true
          }
        },
        _count: {
          select: {
            counties: true,
            districts: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    res.json(cities);
  } catch (error) {
    next(error);
  }
});

// GET /api/states/:id/districts - Get voting districts for a state
router.get('/:id/districts', async (req, res, next) => {
  try {
    const { id } = req.params;
    const districts = await prisma.votingDistrict.findMany({
      where: { us_state_id: BigInt(id) },
      include: {
        cities: {
          include: {
            city: true
          }
        },
        counties: {
          include: {
            county: true
          }
        },
        _count: {
          select: {
            cities: true,
            counties: true
          }
        }
      },
      orderBy: {
        district_code: 'asc'
      }
    });
    
    res.json(districts);
  } catch (error) {
    next(error);
  }
});

module.exports = router; 