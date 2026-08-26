/**
 * Admin Routes
 * Protected endpoints for office users and administrators
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

// All admin routes require authentication
router.use(authenticateToken);

/**
 * GET /api/admin/reports
 * Get all reports for office management
 */
router.get('/reports', async (req, res) => {
    try {
        const { status, priority, office_id } = req.query;
        
        let query = `
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
                r.reporter_name,
                r.reporter_phone,
                wp.name AS water_point_name,
                wp.type AS water_point_type,
                wp.address,
                wp.latitude,
                wp.longitude,
                o.name AS office_name,
                u.name AS technician_name,
                (SELECT COUNT(*) FROM report_confirmations WHERE report_id = r.id) AS confirmations,
                EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - r.reported_at))/3600 AS hours_since_report
            FROM reports r
            JOIN water_points wp ON r.water_point_id = wp.id
            LEFT JOIN offices o ON r.office_id = o.id
            LEFT JOIN users u ON r.assigned_technician_id = u.id
            WHERE 1=1
        `;
        
        const params = [];
        let paramIndex = 1;
        
        // Filter by status
        if (status) {
            query += ` AND r.status = $${paramIndex++}`;
            params.push(status);
        }
        
        // Filter by priority
        if (priority) {
            query += ` AND r.priority = $${paramIndex++}`;
            params.push(priority);
        }
        
        // Filter by office (if not admin)
        if (req.user.role !== 'admin') {
            query += ` AND r.office_id = $${paramIndex++}`;
            params.push(req.user.office_id);
        } else if (office_id) {
            query += ` AND r.office_id = $${paramIndex++}`;
            params.push(office_id);
        }
        
        query += ' ORDER BY r.priority DESC, r.reported_at DESC';
        
        const result = await db.query(query, params);
        
        res.json({
            status: 'success',
            count: result.rows.length,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error fetching admin reports:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch reports'
        });
    }
});

/**
 * PUT /api/admin/reports/:id/status
 * Update report status
 */
router.put('/reports/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes, assigned_technician_id } = req.body;
        
        // Validate status
        const validStatuses = ['reported', 'acknowledged', 'in_progress', 'resolved', 'closed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid status value'
            });
        }
        
        // Get current report
        const currentReport = await db.query(
            'SELECT * FROM reports WHERE id = $1',
            [id]
        );
        
        if (currentReport.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Report not found'
            });
        }
        
        // Build update query
        let updateQuery = 'UPDATE reports SET status = $1, updated_at = CURRENT_TIMESTAMP';
        const updateParams = [status];
        let paramIndex = 2;
        
        // Set timestamp fields based on status
        if (status === 'acknowledged' && !currentReport.rows[0].acknowledged_at) {
            updateQuery += `, acknowledged_at = CURRENT_TIMESTAMP`;
        }
        
        if (status === 'in_progress' && !currentReport.rows[0].started_at) {
            updateQuery += `, started_at = CURRENT_TIMESTAMP`;
        }
        
        if (status === 'resolved' || status === 'closed') {
            updateQuery += `, resolved_at = CURRENT_TIMESTAMP`;
            if (notes) {
                updateQuery += `, resolution_notes = $${paramIndex++}`;
                updateParams.push(notes);
            }
        }
        
        // Assign technician if provided
        if (assigned_technician_id) {
            updateQuery += `, assigned_technician_id = $${paramIndex++}`;
            updateParams.push(assigned_technician_id);
        }
        
        updateQuery += ` WHERE id = $${paramIndex}`;
        updateParams.push(id);
        
        await db.query(updateQuery, updateParams);
        
        // Log status change with user info
        await db.query(
            `INSERT INTO status_history (report_id, old_status, new_status, changed_by_user_id, notes)
             VALUES ($1, $2, $3, $4, $5)`,
            [id, currentReport.rows[0].status, status, req.user.id, notes]
        );
        
        res.json({
            status: 'success',
            message: 'Report status updated successfully'
        });
        
    } catch (error) {
        console.error('Error updating report status:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update report status'
        });
    }
});

/**
 * POST /api/admin/water-points
 * Add a new water point (admin only)
 */
router.post('/water-points', authorizeRoles('admin'), upload.single('photo'), handleMulterError, async (req, res) => {
    try {
        const {
            name,
            type,
            latitude,
            longitude,
            address,
            jurisdiction_id,
            office_id,
            installation_date,
            population_served,
            notes
        } = req.body;
        
        // Validation
        if (!name || !type || !latitude || !longitude) {
            return res.status(400).json({
                status: 'error',
                message: 'Name, type, latitude, and longitude are required'
            });
        }
        
        const photo_url = req.file ? `/uploads/${req.file.filename}` : null;
        
        const query = `
            INSERT INTO water_points (
                name,
                type,
                latitude,
                longitude,
                address,
                jurisdiction_id,
                office_id,
                installation_date,
                beneficiaries,
                current_status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'working')
            RETURNING id
        `;
        
        const result = await db.query(query, [
            name,
            type,
            latitude,
            longitude,
            address,
            jurisdiction_id,
            office_id,
            installation_date,
            population_served || 0
        ]);
        
        res.status(201).json({
            status: 'success',
            message: 'Water point added successfully',
            data: {
                id: result.rows[0].id
            }
        });
        
    } catch (error) {
        console.error('Error adding water point:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to add water point'
        });
    }
});

/**
 * PUT /api/admin/water-points/:id
 * Update water point information
 */
router.put('/water-points/:id', authorizeRoles('admin', 'office_user'), async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        // Build dynamic update query
        const allowedFields = [
            'name', 'type', 'address', 'current_status',
            'population_served', 'notes', 'last_maintenance_date'
        ];
        
        const setClauses = [];
        const values = [];
        let paramIndex = 1;
        
        for (const [key, value] of Object.entries(updates)) {
            if (allowedFields.includes(key)) {
                setClauses.push(`${key} = $${paramIndex++}`);
                values.push(value);
            }
        }
        
        if (setClauses.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'No valid fields to update'
            });
        }
        
        setClauses.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);
        
        const query = `
            UPDATE water_points
            SET ${setClauses.join(', ')}
            WHERE id = $${paramIndex}
        `;
        
        await db.query(query, values);
        
        res.json({
            status: 'success',
            message: 'Water point updated successfully'
        });
        
    } catch (error) {
        console.error('Error updating water point:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update water point'
        });
    }
});

/**
 * GET /api/admin/technicians
 * Get all technicians for assignment
 */
router.get('/technicians', async (req, res) => {
    try {
        let query = `
            SELECT 
                id,
                name,
                phone,
                email,
                office_id
            FROM users
            WHERE role = 'technician' AND is_active = true
        `;
        
        const params = [];
        
        // Filter by office if not admin
        if (req.user.role !== 'admin') {
            query += ' AND office_id = $1';
            params.push(req.user.office_id);
        }
        
        query += ' ORDER BY name';
        
        const result = await db.query(query, params);
        
        res.json({
            status: 'success',
            count: result.rows.length,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error fetching technicians:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch technicians'
        });
    }
});

/**
 * GET /api/admin/offices
 * Get all offices (admin only)
 */
router.get('/offices', authorizeRoles('admin'), async (req, res) => {
    try {
        const query = `
            SELECT 
                o.id,
                o.name,
                o.type,
                o.contact_person,
                o.email,
                o.phone,
                o.address,
                o.is_active,
                j.name AS jurisdiction_name,
                COUNT(DISTINCT wp.id) AS water_points_count,
                COUNT(DISTINCT r.id) AS total_reports
            FROM offices o
            LEFT JOIN jurisdictions j ON o.jurisdiction_id = j.id
            LEFT JOIN water_points wp ON o.id = wp.office_id
            LEFT JOIN reports r ON o.id = r.office_id
            GROUP BY o.id, j.name
            ORDER BY o.name
        `;
        
        const result = await db.query(query);
        
        res.json({
            status: 'success',
            count: result.rows.length,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error fetching offices:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch offices'
        });
    }
});

module.exports = router;
