/**
 * Wolaita Sodo Water-Point Monitoring - Backend Server
 * Community Water-Point Monitoring System
 * Location: Wolaita Zone, South Ethiopia
 * 
 * This is the main entry point for the Express.js backend server.
 * It handles API routing, database connections, and middleware configuration.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

// Import routes
const waterPointRoutes = require('./routes/waterPoints');
const reportRoutes = require('./routes/reports');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');

// Initialize Express app
const app = express();

// Trust proxy for rate limiting and IP detection
app.set('trust proxy', 1);

// =====================================================
// SECURITY MIDDLEWARE
// =====================================================

// Set security HTTP headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            scriptSrc: ["'self'", "https://maps.googleapis.com"],
            connectSrc: ["'self'", "https://maps.googleapis.com"]
        }
    }
}));

// Rate limiting for API calls
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per windowMs
    message: 'Too many login attempts, please try again later.',
    skipSuccessfulRequests: true
});
app.use('/api/auth/login', authLimiter);

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Parse cookies
app.use(cookieParser());

// =====================================================
// MIDDLEWARE CONFIGURATION
// =====================================================

// Enable CORS for frontend communication
app.use(cors({
    origin: process.env.APP_URL || 'http://localhost:4000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON request bodies with size limit
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (uploaded photos)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// =====================================================
// API ROUTES
// =====================================================

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'Wolaita Sodo Water-Point Monitoring API is running',
        timestamp: new Date().toISOString(),
        location: 'Wolaita Zone, South Ethiopia'
    });
});

// Public routes (no authentication required)
app.use('/api/water-points', waterPointRoutes);
app.use('/api/reports', reportRoutes);

// Authentication routes
app.use('/api/auth', authRoutes);

// Protected admin routes (authentication required)
app.use('/api/admin', adminRoutes);

// Analytics routes
app.use('/api/analytics', analyticsRoutes);

// =====================================================
// PRODUCTION FRONTEND (React build)
// =====================================================

// Serve the built React frontend when it exists
const clientBuildDir = path.join(__dirname, '../client/build');
if (fs.existsSync(clientBuildDir)) {
    // Serve static assets from the build
    app.use(express.static(clientBuildDir));

    // SPA fallback for client-side routing (React Router)
    app.use((req, res, next) => {
        if (req.method === 'GET' && !req.path.startsWith('/api/') && !req.path.startsWith('/uploads/')) {
            return res.sendFile(path.join(clientBuildDir, 'index.html'));
        }
        return next();
    });
}

// =====================================================
// ERROR HANDLING
// =====================================================

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found',
        path: req.path
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// =====================================================
// SERVER STARTUP
// =====================================================

// On Vercel the app is exported as a serverless function (api/index.js),
// so skip app.listen there.
const isServerless = process.env.VERCEL !== undefined;

if (!isServerless) {
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
        console.log('═══════════════════════════════════════════════════════');
        console.log('  Wolaita Sodo Water-Point Monitoring API');
        console.log('  Community Water-Point Monitoring System');
        console.log('  Location: Wolaita Zone, South Ethiopia');
        console.log('═══════════════════════════════════════════════════════');
        console.log(`  Server running on port ${PORT}`);
        console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`  API: http://localhost:${PORT}/api`);
        console.log(`  Health Check: http://localhost:${PORT}/api/health`);
        console.log('═══════════════════════════════════════════════════════');
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log('SIGTERM signal received: closing HTTP server');
        server.close(() => {
            console.log('HTTP server closed');
        });
    });
}

module.exports = app;
