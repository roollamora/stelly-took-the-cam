// Initialize SQLite database with gallery collections
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Create database file
const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new Database(dbPath);

console.log('📦 Creating database at:', dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
console.log('📋 Creating tables...');

db.exec(`
  -- Collections table
  CREATE TABLE IF NOT EXISTS collections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    coverImage TEXT NOT NULL,
    category TEXT NOT NULL,
    isPublic INTEGER DEFAULT 1,
    sortOrder INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  -- Images table
  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    collectionId INTEGER NOT NULL,
    url TEXT NOT NULL,
    alt TEXT NOT NULL,
    caption TEXT,
    description TEXT,
    width INTEGER DEFAULT 0,
    height INTEGER DEFAULT 0,
    sortOrder INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (collectionId) REFERENCES collections(id) ON DELETE CASCADE
  );

  -- Image tags table (for image filtering/search)
  CREATE TABLE IF NOT EXISTS image_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    imageId INTEGER NOT NULL,
    tag TEXT NOT NULL,
    FOREIGN KEY (imageId) REFERENCES images(id) ON DELETE CASCADE,
    UNIQUE(imageId, tag)
  );

  -- Create indexes for better performance
  CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);
  CREATE INDEX IF NOT EXISTS idx_collections_category ON collections(category);
  CREATE INDEX IF NOT EXISTS idx_images_collection ON images(collectionId);
  CREATE INDEX IF NOT EXISTS idx_image_tags_tag ON image_tags(tag);
`);

console.log('✅ Tables created successfully');

// Load collections from JSON
console.log('📥 Loading collections from JSON...');
const collectionsPath = path.join(__dirname, '..', 'public', 'gallery', 'collections.json');
const collections = JSON.parse(fs.readFileSync(collectionsPath, 'utf-8'));

console.log(`Found ${collections.length} collections`);

// Insert collections
const insertCollection = db.prepare(`
  INSERT INTO collections (id, name, slug, description, coverImage, category, sortOrder)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const insertImage = db.prepare(`
  INSERT INTO images (collectionId, url, alt, sortOrder)
  VALUES (?, ?, ?, ?)
`);

const insertImageTag = db.prepare(`
  INSERT INTO image_tags (imageId, tag)
  VALUES (?, ?)
`);

// Transaction for better performance
const insertAll = db.transaction(() => {
  collections.forEach((collection, index) => {
    console.log(`  Processing: ${collection.name}`);
    
    // Determine file extension
    const extension = collection.slug === 'monochrome-moments' ? 'jpg' : 'jpeg';
    const coverImage = `/gallery/${collection.slug}/00.${extension}`;
    
    // Insert collection
    insertCollection.run(
      collection.id,
      collection.name,
      collection.slug,
      collection.description,
      coverImage,
      collection.category,
      index
    );
    
    // Check if gallery folder exists and count images
    const galleryPath = path.join(__dirname, '..', 'public', 'gallery', collection.slug);
    if (fs.existsSync(galleryPath)) {
      const files = fs.readdirSync(galleryPath)
        .filter(file => file.match(/\.(jpg|jpeg|png)$/i))
        .sort();
      
      console.log(`    Found ${files.length} images`);
      
      // Insert images
      files.forEach((file, imgIndex) => {
        const imageUrl = `/gallery/${collection.slug}/${file}`;
        const result = insertImage.run(
          collection.id,
          imageUrl,
          `${collection.name} - Image ${imgIndex + 1}`,
          imgIndex
        );
        
        // Image tags will be added separately via update-image-tags.js script
      });
    }
  });
});

console.log('💾 Inserting data...');
insertAll();

// Verify data
const collectionCount = db.prepare('SELECT COUNT(*) as count FROM collections').get();
const imageCount = db.prepare('SELECT COUNT(*) as count FROM images').get();
const imageTagCount = db.prepare('SELECT COUNT(*) as count FROM image_tags').get();

console.log('\n✅ Database initialized successfully!');
console.log(`📊 Statistics:`);
console.log(`   Collections: ${collectionCount.count}`);
console.log(`   Images: ${imageCount.count}`);
console.log(`   Image Tags: ${imageTagCount.count}`);
console.log(`\n📁 Database file: ${dbPath}`);

db.close();
