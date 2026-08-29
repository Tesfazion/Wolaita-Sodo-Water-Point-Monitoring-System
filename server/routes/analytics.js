/**
 * Analytics Routes
 * Statistical data for dashboards and reporting
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

/**
 * GET /api/analytics/dashboard
 * Get dashboard statistics
 */
router.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        const isAdmin = req.user.role === 'admin';
        // Office filter fragment. When non-admin, $1 is the user's office id.
        const officeFilter = isAdmin ? '' : ' AND office_id = $1';
        const officeParams = isAdmin ? [] : [req.user.office_id];

        // Total water points (office filter uses WHERE here since there is no other predicate)
        const waterPointsFilter = isAdmin ? '' : 'WHERE office_id = $1';
        const waterPointsQuery = `
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE current_status = 'working') as working,
                COUNT(*) FILTER (WHERE current_status = 'reported_broken') as broken,
                COUNT(*) FILTER (WHERE current_status = 'under_repair') as under_repair
            FROM water_points
            ${waterPointsFilter}
        `;

        const wpResult = await db.query(waterPointsQuery, officeParams);

        // Reports statistics
        const reportsQuery = `
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE status = 'reported') as new_reports,
                COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
                COUNT(*) FILTER (WHERE status = 'resolved') as resolved,
                COUNT(*) FILTER (WHERE priority = 'urgent') as urgent
            FROM reports
            WHERE 1=1
            ${officeFilter}
        `;

        const reportsResult = await db.query(reportsQuery, officeParams);

        // Average resolution time (in hours)
        const avgTimeQuery = `
            SELECT 
                AVG(EXTRACT(EPOCH FROM (resolved_at - reported_at))/3600) as avg_hours
            FROM reports
            WHERE resolved_at IS NOT NULL
            ${officeFilter}
        `;

        const avgTimeResult = await db.query(avgTimeQuery, officeParams);

        // Recent activity (qualify office_id since reports and water_points both have the column)
        const recentOfficeFilter = isAdmin ? '' : ' AND r.office_id = $1';
        const recentQuery = `
            SELECT 
                r.id,
                r.fault_type,
                r.status,
                r.priority,
                r.reported_at,
                wp.name as water_point_name
            FROM reports r
            JOIN water_points wp ON r.water_point_id = wp.id
            WHERE 1=1
            ${recentOfficeFilter}
            ORDER BY r.reported_at DESC
            LIMIT 5
        `;

        const recentResult = await db.query(recentQuery, officeParams);

        // Fault types breakdown
        const faultTypesQuery = `
            SELECT 
                fault_type,
                COUNT(*) as count
            FROM reports
            WHERE 1=1
            ${officeFilter}
            GROUP BY fault_type
            ORDER BY count DESC
        `;

        const faultTypesResult = await db.query(faultTypesQuery, officeParams);

        // Monthly trends (last 6 months)
        const trendsQuery = `
            SELECT 
                TO_CHAR(reported_at, 'YYYY-MM') as month,
                COUNT(*) as reports_count,
                COUNT(*) FILTER (WHERE status = 'resolved') as resolved_count
            FROM reports
            WHERE reported_at >= CURRENT_DATE - INTERVAL '6 months'
            ${officeFilter}
            GROUP BY TO_CHAR(reported_at, 'YYYY-MM')
            ORDER BY month DESC
        `;

        const trendsResult = await db.query(trendsQuery, officeParams);
        
        res.json({
            status: 'success',
            data: {
                water_points: wpResult.rows[0],
                reports: reportsResult.rows[0],
                avg_resolution_time_hours: parseFloat(avgTimeResult.rows[0].avg_hours || 0).toFixed(2),
                recent_activity: recentResult.rows,
                fault_types: faultTypesResult.rows,
                monthly_trends: trendsResult.rows
            }
        });
        
    } catch (error) {
        console.error('Error fetching dashboard analytics:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch analytics data'
        });
    }
});

/**
 * GET /api/analytics/performance
 * Office performance metrics (admin only)
 */
router.get('/performance', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Access denied. Admin only.'
            });
        }
        
        const query = `
            SELECT 
                o.id,
                o.name as office_name,
                COUNT(DISTINCT wp.id) as water_points,
                COUNT(r.id) as total_reports,
                COUNT(r.id) FILTER (WHERE r.status = 'resolved') as resolved_reports,
                AVG(
                    EXTRACT(EPOCH FROM (r.resolved_at - r.reported_at))/3600
                ) as avg_resolution_hours,
                COUNT(r.id) FILTER (WHERE r.status IN ('reported', 'acknowledged') 
                    AND r.reported_at < CURRENT_TIMESTAMP - INTERVAL '48 hours') as overdue_reports
            FROM offices o
            LEFT JOIN water_points wp ON o.id = wp.office_id
            LEFT JOIN reports r ON o.id = r.office_id
            WHERE o.is_active = true
            GROUP BY o.id, o.name
            ORDER BY o.name
        `;
        
        const result = await db.query(query);
        
        res.json({
            status: 'success',
            data: result.rows.map(row => ({
                ...row,
                avg_resolution_hours: parseFloat(row.avg_resolution_hours || 0).toFixed(2),
                resolution_rate: row.total_reports > 0
                    ? ((row.resolved_reports / row.total_reports) * 100).toFixed(1)
                    : '0.0'
            }))
        });
        
    } catch (error) {
        console.error('Error fetching performance analytics:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch performance data'
        });
    }
});

/**
 * GET /api/analytics/map-data
 * Get data for map visualization (public access)
 */
router.get('/map-data', async (req, res) => {
    try {
        const query = `
            SELECT 
                wp.id,
                wp.name,
                wp.type,
                wp.current_status,
                wp.latitude,
                wp.longitude,
                wp.address,
                COUNT(r.id) FILTER (WHERE r.status IN ('reported', 'acknowledged', 'in_progress')) as active_reports
            FROM water_points wp
            LEFT JOIN reports r ON wp.id = r.water_point_id
            GROUP BY wp.id
            ORDER BY wp.name
        `;
        
        const result = await db.query(query);
        
        res.json({
            status: 'success',
            count: result.rows.length,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error fetching map data:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch map data'
        });
    }
});

module.exports = router;
