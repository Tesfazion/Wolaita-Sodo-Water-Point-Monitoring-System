/**
 * Authentication Routes
 * Handles user login and token management
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

/**
 * POST /api/auth/login
 * Admin and office user login
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email and password are required'
            });
        }
        
        // Find user
        const query = `
            SELECT 
                u.id,
                u.name,
                u.email,
                u.phone,
                u.password_hash,
                u.role,
                u.office_id,
                u.is_active,
                o.name AS office_name
            FROM users u
            LEFT JOIN offices o ON u.office_id = o.id
            WHERE u.email = $1
        `;
        
        const result = await db.query(query, [email.toLowerCase()]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }
        
        const user = result.rows[0];
        
        // Check if user is active
        if (!user.is_active) {
            return res.status(403).json({
                status: 'error',
                message: 'Your account has been deactivated. Please contact administrator.'
            });
        }
        
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                office_id: user.office_id
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '30d' }
        );
        
        // Update last login time
        await db.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        );
        
        // Return user data and token (without password hash)
        const { password_hash, ...userData } = user;
        
        res.json({
            status: 'success',
            message: 'Login successful',
            data: {
                user: userData,
                token,
                expires_in: process.env.JWT_EXPIRE || '30d'
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Login failed. Please try again.'
        });
    }
});

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const query = `
            SELECT 
                u.id,
                u.name,
                u.email,
                u.phone,
                u.role,
                u.office_id,
                u.last_login,
                o.name AS office_name,
                j.name AS jurisdiction_name
            FROM users u
            LEFT JOIN offices o ON u.office_id = o.id
            LEFT JOIN jurisdictions j ON o.jurisdiction_id = j.id
            WHERE u.id = $1
        `;
        
        const result = await db.query(query, [req.user.id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }
        
        res.json({
            status: 'success',
            data: result.rows[0]
        });
        
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch user profile'
        });
    }
});

/**
 * POST /api/auth/change-password
 * Change user password
 */
router.post('/change-password', authenticateToken, async (req, res) => {
    try {
        const { current_password, new_password } = req.body;
        
        // Validation
        if (!current_password || !new_password) {
            return res.status(400).json({
                status: 'error',
                message: 'Current password and new password are required'
            });
        }
        
        if (new_password.length < 6) {
            return res.status(400).json({
                status: 'error',
                message: 'New password must be at least 6 characters long'
            });
        }
        
        // Get current password hash
        const userResult = await db.query(
            'SELECT password_hash FROM users WHERE id = $1',
            [req.user.id]
        );
        
        if (userResult.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }
        
        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(
            current_password,
            userResult.rows[0].password_hash
        );
        
        if (!isCurrentPasswordValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Current password is incorrect'
            });
        }
        
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(new_password, salt);
        
        // Update password
        await db.query(
            'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [newPasswordHash, req.user.id]
        );
        
        res.json({
            status: 'success',
            message: 'Password changed successfully'
        });
        
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to change password'
        });
    }
});

module.exports = router;
