/**
 * PM2 process configuration for production.
 * Start:  pm2 start ecosystem.config.js
 * Save:   pm2 save
 * Logs:   pm2 logs wolaita-water-api
 */
module.exports = {
    apps: [{
        name: 'wolaita-water-api',
        script: 'server/server.js',
        instances: 1,
        exec_mode: 'fork',
        autorestart: true,
        max_memory_restart: '300M',
        env: {
            NODE_ENV: 'production'
        },
        error_file: './logs/err.log',
        out_file: './logs/out.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        merge_logs: true,
        kill_timeout: 5000
    }]
};