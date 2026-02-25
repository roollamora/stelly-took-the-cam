// Database abstraction layer - switches between SQLite (local) and Turso (production)
const isProduction = process.env.NODE_ENV === 'production' || process.env.TURSO_DATABASE_URL;

// Export the appropriate database module based on environment
if (isProduction) {
  // Use Turso for production
  const turso = require('./turso');
  module.exports = turso;
} else {
  // Use SQLite for local development
  const sqlite = require('./sqlite');
  module.exports = sqlite;
}

// TypeScript type exports
export * from './sqlite';
