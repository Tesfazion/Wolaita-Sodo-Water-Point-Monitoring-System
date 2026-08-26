/**
 * Authentication Middleware
 * Handles JWT token verification and role-based access control
 */

const jwt = require('jsonwebtoken');

/**
 * Verify JWT token and attach user to request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticateToken = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Access token is required'
        });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                status: 'error',
                message: 'Invalid or expired token'
            });
        }

        // Attach user info to request object
        req.user = user;
        next();
    });
};

/**
 * Check if user has required role
 * @param {Array<string>} roles - Array of allowed roles
 * @returns {Function} Middleware function
 */
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Authentication required'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'You do not have permission to perform this action',
                requiredRoles: roles,
                yourRole: req.user.role
            });
        }

        next();
    };
};

/**
 * Optional authentication - attaches user if token exists but doesn't fail if missing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (!err) {
                req.user = user;
            }
        });
    }

    next();
};

module.exports = {
    authenticateToken,
    authorizeRoles,
    optionalAuth
};
