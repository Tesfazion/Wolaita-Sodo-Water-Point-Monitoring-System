/**
 * Water Points Routes
 * Public API endpoints for accessing water point information
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * GET /api/water-points
 * Get all water points with optional filtering
 * Query params: status, jurisdiction_id, type
 */
router.get('/', async (req, res) => {
    try {
        const { status, jurisdiction_id, type } = req.query;
        
        let query = `
            SELECT 
                wp.id,
                wp.name,
                wp.type,
                wp.current_status,
                wp.latitude,
                wp.longitude,
                wp.address,
                wp.beneficiaries AS population_served,
                NULL AS photo_url,
                j.name AS jurisdiction_name,
                o.name AS office_name,
                COUNT(DISTINCT r.id) AS total_reports,
                COUNT(DISTINCT CASE WHEN r.status IN ('reported', 'acknowledged', 'in_progress') THEN r.id END) AS active_reports
            FROM water_points wp
            LEFT JOIN jurisdictions j ON wp.jurisdiction_id = j.id
            LEFT JOIN offices o ON wp.office_id = o.id
            LEFT JOIN reports r ON wp.id = r.water_point_id
            WHERE 1=1
        `;
        
        const params = [];
        let paramIndex = 1;
        
        // Add filters if provided
        if (status) {
            query += ` AND wp.current_status = $${paramIndex++}`;
            params.push(status);
        }
        
        if (jurisdiction_id) {
            query += ` AND wp.jurisdiction_id = $${paramIndex++}`;
            params.push(jurisdiction_id);
        }
        
        if (type) {
            query += ` AND wp.type = $${paramIndex++}`;
            params.push(type);
        }
        
        query += `
            GROUP BY wp.id, j.name, o.name
            ORDER BY wp.name
        `;
        
        const result = await db.query(query, params);
        
        res.json({
            status: 'success',
            count: result.rows.length,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error fetching water points:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch water points'
        });
    }
});

/**
 * GET /api/water-points/:id
 * Get detailed information about a specific water point
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get water point details
        const wpQuery = `
            SELECT 
                wp.id,
                wp.name,
                wp.type,
                wp.current_status,
                wp.latitude,
                wp.longitude,
                wp.address,
                wp.beneficiaries AS population_served,
                wp.installation_date,
                NULL AS last_maintenance_date,
                NULL AS photo_url,
                NULL AS notes,
                j.name AS jurisdiction_name,
                o.name AS office_name,
                o.phone AS office_phone
            FROM water_points wp
            LEFT JOIN jurisdictions j ON wp.jurisdiction_id = j.id
            LEFT JOIN offices o ON wp.office_id = o.id
            WHERE wp.id = $1
        `;
        
        const wpResult = await db.query(wpQuery, [id]);
        
        if (wpResult.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Water point not found'
            });
        }
        
        // Get recent reports for this water point
        const reportsQuery = `
            SELECT 
                id,
                fault_type,
                status,
                priority,
                reported_at,
                resolved_at
            FROM reports
            WHERE water_point_id = $1
            ORDER BY reported_at DESC
            LIMIT 5
        `;
        
        const reportsResult = await db.query(reportsQuery, [id]);
        
        res.json({
            status: 'success',
            data: {
                ...wpResult.rows[0],
                recent_reports: reportsResult.rows
            }
        });
        
    } catch (error) {
        console.error('Error fetching water point:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch water point details'
        });
    }
});

/**
 * GET /api/water-points/nearby/:latitude/:longitude
 * Find water points near a specific location
 */
router.get('/nearby/:latitude/:longitude', async (req, res) => {
    try {
        const { latitude, longitude } = req.params;
        const radius = req.query.radius || 5000; // Default 5km radius
        
        const query = `
            SELECT 
                wp.id,
                wp.name,
                wp.type,
                wp.current_status,
                wp.latitude,
                wp.longitude,
                wp.address,
                (
                    6371000 * acos(
                        cos(radians($1)) * cos(radians(wp.latitude)) *
                        cos(radians(wp.longitude) - radians($2)) +
                        sin(radians($1)) * sin(radians(wp.latitude))
                    )
                ) AS distance_meters
            FROM water_points wp
            WHERE (
                6371000 * acos(
                    cos(radians($1)) * cos(radians(wp.latitude)) *
                    cos(radians(wp.longitude) - radians($2)) +
                    sin(radians($1)) * sin(radians(wp.latitude))
                )
            ) <= $3
            ORDER BY distance_meters
            LIMIT 20
        `;
        
        const result = await db.query(query, [latitude, longitude, radius]);
        
        res.json({
            status: 'success',
            count: result.rows.length,
            search_radius_meters: radius,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error finding nearby water points:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to find nearby water points'
        });
    }
});

module.exports = router;
