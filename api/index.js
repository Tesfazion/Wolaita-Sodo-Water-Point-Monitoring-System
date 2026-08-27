/**
 * Vercel serverless entry point.
 * Exports the Express app so Vercel can run the full API
 * (routed from /api/* via vercel.json rewrites).
 */
module.exports = require('../server/server');