// Script to remove collection tags from database
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new Database(dbPath);

console.log('Removing collection tags...\n');

try {
  // Drop the collection_tags table
  db.prepare('DROP TABLE IF EXISTS collection_tags').run();
  console.log('✅ Dropped collection_tags table');
  
  // Get stats
  const imageTagCount = db.prepare('SELECT COUNT(*) as count FROM image_tags').get();
  const uniqueTags = db.prepare('SELECT COUNT(DISTINCT tag) as count FROM image_tags').get();
  
  console.log(`\n📊 Database Stats:`);
  console.log(`   - Image tags: ${imageTagCount.count}`);
  console.log(`   - Unique tags: ${uniqueTags.count}`);
  console.log(`\n✅ Collection tags removed successfully!`);
  console.log('Only images have tags now.\n');
  
} catch (error) {
  console.error('Error:', error);
} finally {
  db.close();
}
