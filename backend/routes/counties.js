const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const router = express.Router();

const prisma = new PrismaClient();

// GET /api/counties - Get all counties with filtering
router.get('/', async (req, res, next) => {
  try {
    const { state_id, page = 1, limit = 50, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {};
    
    if (state_id) {
      where.us_state_id = BigInt(state_id);
    }
    
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    
    const [counties, total] = await Promise.all([
      prisma.uSCounty.findMany({
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
              districts: true
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: [
          { us_state: { name: 'asc' } },
          { name: 'asc' }
        ]
      }),
      prisma.uSCounty.count({ where })
    ]);
    
    res.json({
      counties,
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

// GET /api/counties/:id - Get county by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const county = await prisma.uSCounty.findUnique({
      where: { id: BigInt(id) },
      include: {
        us_state: true,
        cities: {
          include: {
            city: true
          }
        },
        districts: {
          include: {
            district: true
          }
        }
      }
    });
    
    if (!county) {
      return res.status(404).json({ error: 'County not found' });
    }
    
    res.json(county);
  } catch (error) {
    next(error);
  }
});

module.exports = router; 