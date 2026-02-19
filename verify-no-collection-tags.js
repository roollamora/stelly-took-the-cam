// Verification script to ensure collection tags are completely removed
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath, { readonly: true });

console.log('🔍 Verifying Collection Tags Removal\n');

// 1. Check if collection_tags table exists
console.log('1. Checking for collection_tags table...');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
const tableNames = tables.map(t => t.name);
const hasCollectionTagsTable = tableNames.includes('collection_tags');

if (hasCollectionTagsTable) {
  console.log('   ❌ FAIL: collection_tags table still exists!');
} else {
  console.log('   ✅ PASS: collection_tags table does not exist');
}

// 2. Check collections table schema
console.log('\n2. Checking collections table schema...');
const collectionSchema = db.prepare("PRAGMA table_info(collections)").all();
const collectionColumns = collectionSchema.map(c => c.name);
const hasTagsColumn = collectionColumns.includes('tags');

if (hasTagsColumn) {
  console.log('   ❌ FAIL: collections table has tags column!');
} else {
  console.log('   ✅ PASS: collections table has no tags column');
}

console.log('   Columns:', collectionColumns.join(', '));

// 3. Check image_tags table exists
console.log('\n3. Checking for image_tags table...');
const hasImageTagsTable = tableNames.includes('image_tags');

if (hasImageTagsTable) {
  console.log('   ✅ PASS: image_tags table exists');
  
  // Count image tags
  const imageTagCount = db.prepare('SELECT COUNT(*) as count FROM image_tags').get();
  console.log(`   Image tags count: ${imageTagCount.count}`);
} else {
  console.log('   ❌ FAIL: image_tags table does not exist!');
}

// 4. Verify data integrity
console.log('\n4. Checking data integrity...');
const collectionCount = db.prepare('SELECT COUNT(*) as count FROM collections').get();
const imageCount = db.prepare('SELECT COUNT(*) as count FROM images').get();

console.log(`   Collections: ${collectionCount.count}`);
console.log(`   Images: ${imageCount.count}`);

// 5. Sample collection data
console.log('\n5. Sample collection (first collection):');
const sampleCollection = db.prepare('SELECT * FROM collections LIMIT 1').get();
console.log('   Fields:', Object.keys(sampleCollection).join(', '));
console.log('   Name:', sampleCollection.name);
console.log('   Category:', sampleCollection.category);

// 6. Sample image with tags
console.log('\n6. Sample image with tags:');
const sampleImage = db.prepare('SELECT * FROM images LIMIT 1').get();
const sampleImageTags = db.prepare('SELECT tag FROM image_tags WHERE imageId = ?').all(sampleImage.id);
console.log('   Image URL:', sampleImage.url);
console.log('   Tags:', sampleImageTags.map(t => t.tag).join(', '));

// 7. Summary
console.log('\n' + '='.repeat(50));
console.log('SUMMARY');
console.log('='.repeat(50));

const allPassed = !hasCollectionTagsTable && !hasTagsColumn && hasImageTagsTable;

if (allPassed) {
  console.log('✅ ALL CHECKS PASSED!');
  console.log('Collection tags have been completely removed.');
  console.log('Only images have tags now.');
} else {
  console.log('❌ SOME CHECKS FAILED!');
  console.log('Please review the issues above.');
}

db.close();
