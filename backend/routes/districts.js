const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const router = express.Router();

const prisma = new PrismaClient();

// GET /api/districts - Get all voting districts with filtering
router.get('/', async (req, res, next) => {
  try {
    const { state_id, page = 1, limit = 50, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {};
    
    if (state_id) {
      where.us_state_id = BigInt(state_id);
    }
    
    if (search) {
      where.district_code = { contains: search, mode: 'insensitive' };
    }
    
    const [districts, total] = await Promise.all([
      prisma.votingDistrict.findMany({
        where,
        include: {
          us_state: {
            select: {
              id: true,
              name: true,
              abbreviation: true
            }
          },
          _count: {
            select: {
              cities: true,
              counties: true
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: [
          { us_state: { name: 'asc' } },
          { district_code: 'asc' }
        ]
      }),
      prisma.votingDistrict.count({ where })
    ]);
    
    res.json({
      districts,
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

// GET /api/districts/:id - Get district by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const district = await prisma.votingDistrict.findUnique({
      where: { id: BigInt(id) },
      include: {
        us_state: true,
        cities: {
          include: {
            city: true
          }
        },
        counties: {
          include: {
            county: true
          }
        }
      }
    });
    
    if (!district) {
      return res.status(404).json({ error: 'District not found' });
    }
    
    res.json(district);
  } catch (error) {
    next(error);
  }
});

module.exports = router; 