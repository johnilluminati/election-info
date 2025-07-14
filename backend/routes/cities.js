const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const router = express.Router();

const prisma = new PrismaClient();

// GET /api/cities - Get all cities with filtering
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
    
    const [cities, total] = await Promise.all([
      prisma.uSCity.findMany({
        where,
        include: {
          us_state: {
            select: {
              id: true,
              name: true,
              abbreviation: true
            }
          },
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
        skip,
        take: parseInt(limit),
        orderBy: [
          { us_state: { name: 'asc' } },
          { name: 'asc' }
        ]
      }),
      prisma.uSCity.count({ where })
    ]);
    
    res.json({
      cities,
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

// GET /api/cities/:id - Get city by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const city = await prisma.uSCity.findUnique({
      where: { id: BigInt(id) },
      include: {
        us_state: true,
        counties: {
          include: {
            county: true
          }
        },
        districts: {
          include: {
            district: true
          }
        }
      }
    });
    
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }
    
    res.json(city);
  } catch (error) {
    next(error);
  }
});

module.exports = router; 