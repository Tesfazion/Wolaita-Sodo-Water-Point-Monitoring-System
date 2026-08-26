/**
 * Reports Routes
 * Public API endpoints for submitting and tracking reports
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { upload, handleMulterError } = require('../middleware/upload');

/**
 * POST /api/reports
 * Submit a new water point fault report
 * Accepts multipart/form-data with optional photo
 */
router.post('/', upload.single('photo'), handleMulterError, async (req, res) => {
    try {
        const {
            water_point_id,
            reporter_name,
            reporter_phone,
            reporter_email,
            fault_type,
            description,
            priority
        } = req.body;
        
        // Validation
        if (!water_point_id || !fault_type) {
            return res.status(400).json({
                status: 'error',
                message: 'Water point ID and fault type are required'
            });
        }
        
        // Check if water point exists
        const wpCheck = await db.query(
            'SELECT id, office_id FROM water_points WHERE id = $1',
            [water_point_id]
        );
        
        if (wpCheck.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Water point not found'
            });
        }
        
        const office_id = wpCheck.rows[0].office_id;
        
        // Handle uploaded photo
        const photo_url = req.file ? `/uploads/${req.file.filename}` : null;
        
        // Insert report
        const insertQuery = `
            INSERT INTO reports (
                water_point_id,
                reporter_name,
                reporter_phone,
                reporter_email,
                fault_type,
                description,
                photo_url,
                priority,
                status,
                office_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'reported', $9)
            RETURNING id, reported_at
        `;
        
        const result = await db.query(insertQuery, [
            water_point_id,
            reporter_name,
            reporter_phone,
            reporter_email,
            fault_type,
            description,
            photo_url,
            priority || 'normal',
            office_id
        ]);
        
        // Update water point status
        await db.query(
            `UPDATE water_points 
             SET current_status = 'reported_broken'
             WHERE id = $1 AND current_status = 'working'`,
            [water_point_id]
        );
        
        res.status(201).json({
            status: 'success',
            message: 'Report submitted successfully',
            data: {
                report_id: result.rows[0].id,
                reported_at: result.rows[0].reported_at,
                tracking_url: `/reports/${result.rows[0].id}`
            }
        });
        
    } catch (error) {
        console.error('Error submitting report:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to submit report'
        });
    }
});

/**
 * GET /api/reports/:id
 * Get report status and details (for tracking)
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = `
            SELECT 
                r.id,
                r.fault_type,
                r.description,
                r.priority,
                r.status,
                r.photo_url,
                r.reported_at,
                r.acknowledged_at,
                r.started_at,
                r.resolved_at,
                r.resolution_notes,
                r.resolved_photo_url,
                wp.name AS water_point_name,
                wp.type AS water_point_type,
                wp.address,
                wp.latitude,
                wp.longitude,
                o.name AS office_name,
                o.phone AS office_phone,
                u.name AS technician_name,
                (SELECT COUNT(*) FROM report_confirmations WHERE report_id = r.id) AS confirmations
            FROM reports r
            JOIN water_points wp ON r.water_point_id = wp.id
            LEFT JOIN offices o ON r.office_id = o.id
            LEFT JOIN users u ON r.assigned_technician_id = u.id
            WHERE r.id = $1
        `;
        
        const result = await db.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Report not found'
            });
        }
        
        // Get status history
        const historyQuery = `
            SELECT 
                old_status,
                new_status,
                notes,
                changed_at
            FROM status_history
            WHERE report_id = $1
            ORDER BY changed_at DESC
        `;
        
        const historyResult = await db.query(historyQuery, [id]);
        
        res.json({
            status: 'success',
            data: {
                ...result.rows[0],
                status_history: historyResult.rows
            }
        });
        
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch report details'
        });
    }
});

/**
 * POST /api/reports/:id/confirm
 * Add a "me too" confirmation to a report
 */
router.post('/:id/confirm', async (req, res) => {
    try {
        const { id } = req.params;
        const { confirmer_name, confirmer_phone } = req.body;
        
        // Check if report exists and is still active
        const reportCheck = await db.query(
            `SELECT id, status FROM reports 
             WHERE id = $1 AND status IN ('reported', 'acknowledged', 'in_progress')`,
            [id]
        );
        
        if (reportCheck.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Report not found or already resolved'
            });
        }
        
        // Check for duplicate confirmation from same phone
        if (confirmer_phone) {
            const duplicateCheck = await db.query(
                `SELECT id FROM report_confirmations 
                 WHERE report_id = $1 AND confirmer_phone = $2`,
                [id, confirmer_phone]
            );
            
            if (duplicateCheck.rows.length > 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'You have already confirmed this report'
                });
            }
        }
        
        // Add confirmation
        await db.query(
            `INSERT INTO report_confirmations (report_id, confirmer_name, confirmer_phone)
             VALUES ($1, $2, $3)`,
            [id, confirmer_name, confirmer_phone]
        );
        
        // Update priority if many confirmations
        const countResult = await db.query(
            'SELECT COUNT(*) as count FROM report_confirmations WHERE report_id = $1',
            [id]
        );
        
        const confirmCount = parseInt(countResult.rows[0].count);
        
        if (confirmCount >= 3) {
            await db.query(
                `UPDATE reports SET priority = 'high' 
                 WHERE id = $1 AND priority = 'normal'`,
                [id]
            );
        }
        
        res.json({
            status: 'success',
            message: 'Confirmation added successfully',
            total_confirmations: confirmCount
        });
        
    } catch (error) {
        console.error('Error adding confirmation:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to add confirmation'
        });
    }
});

/**
 * GET /api/reports
 * Get all reports with optional filtering (public view)
 */
router.get('/', async (req, res) => {
    try {
        const { status, water_point_id } = req.query;
        
        let query = `
            SELECT 
                r.id,
                r.fault_type,
                r.status,
                r.priority,
                r.reported_at,
                wp.name AS water_point_name,
                wp.latitude,
                wp.longitude
            FROM reports r
            JOIN water_points wp ON r.water_point_id = wp.id
            WHERE 1=1
        `;
        
        const params = [];
        let paramIndex = 1;
        
        if (status) {
            query += ` AND r.status = $${paramIndex++}`;
            params.push(status);
        }
        
        if (water_point_id) {
            query += ` AND r.water_point_id = $${paramIndex++}`;
            params.push(water_point_id);
        }
        
        query += ' ORDER BY r.reported_at DESC LIMIT 100';
        
        const result = await db.query(query, params);
        
        res.json({
            status: 'success',
            count: result.rows.length,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch reports'
        });
    }
});

module.exports = router;
