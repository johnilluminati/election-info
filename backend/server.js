const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// BigInt serialization middleware
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function(data) {
    const serializedData = JSON.parse(JSON.stringify(data, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));
    return originalJson.call(this, serializedData);
  };
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Election Info API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes with error handling
const routes = [
  { path: '/api/states', file: './routes/states' },
  { path: '/api/counties', file: './routes/counties' },
  { path: '/api/cities', file: './routes/cities' },
  { path: '/api/districts', file: './routes/districts' },
  { path: '/api/elections', file: './routes/elections' },
  { path: '/api/candidates', file: './routes/candidates' },
  { path: '/api/parties', file: './routes/parties' }
];

routes.forEach(route => {
  try {
    const router = require(route.file);
    if (router && typeof router === 'function') {
      app.use(route.path, router);
      console.log(`✅ Route loaded: ${route.path}`);
    } else {
      console.log(`❌ Invalid router export: ${route.file}`);
    }
  } catch (error) {
    console.log(`❌ Failed to load route ${route.path}: ${error.message}`);
  }
});

// 404 handler with available routes info
app.use((req, res) => {
  const availableRoutes = [
    'GET /health',
    'GET /api/states',
    'GET /api/states/:id',
    'GET /api/states/:id/counties',
    'GET /api/states/:id/cities', 
    'GET /api/states/:id/districts',
    'GET /api/counties',
    'GET /api/counties/:id',
    'GET /api/cities',
    'GET /api/cities/:id',
    'GET /api/districts',
    'GET /api/districts/:id',
    'GET /api/elections',
    'GET /api/elections/:id',
    'GET /api/elections/cycles/all',
    'GET /api/elections/types/all',
    'GET /api/elections/:id/candidates',
    'GET /api/candidates',
    'GET /api/candidates/:id',
    'GET /api/candidates/:id/elections',
    'GET /api/candidates/:id/key-issues',
    'GET /api/candidates/:id/donations',
    'GET /api/parties',
    'GET /api/parties/:id',
    'GET /api/parties/:id/candidates'
  ];
  
  res.status(404).json({ 
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableRoutes: availableRoutes,
    documentation: 'Check the README.md for detailed API documentation'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Election Info API server running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
});

module.exports = app; 