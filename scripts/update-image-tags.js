// Script to update image tags to be unique per image
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new Database(dbPath);

console.log('Updating image tags to be unique per image...\n');

// Get all collections
const collections = db.prepare('SELECT * FROM collections').all();

// Tag variations for different image positions
const tagVariations = {
  urban: ['city', 'street', 'downtown', 'metropolitan', 'skyline', 'buildings', 'architecture', 'urban-life'],
  night: ['evening', 'dusk', 'twilight', 'nighttime', 'after-dark', 'nocturnal', 'moonlight', 'starry'],
  neon: ['lights', 'glow', 'illuminated', 'bright', 'colorful-lights', 'signs', 'electric', 'vibrant'],
  portrait: ['face', 'person', 'model', 'expression', 'close-up', 'headshot', 'profile', 'gaze'],
  nature: ['natural', 'outdoors', 'wilderness', 'landscape', 'scenic', 'environment', 'earth', 'organic'],
  macro: ['close-up', 'detail', 'texture', 'pattern', 'intricate', 'magnified', 'tiny', 'micro'],
  abstract: ['artistic', 'creative', 'conceptual', 'modern', 'experimental', 'unique', 'imaginative', 'expressive'],
  color: ['vibrant', 'colorful', 'bright', 'vivid', 'saturated', 'rainbow', 'multicolor', 'chromatic'],
  monochrome: ['black-white', 'grayscale', 'noir', 'contrast', 'tonal', 'bw', 'classic', 'timeless'],
  fashion: ['style', 'clothing', 'outfit', 'trendy', 'chic', 'elegant', 'designer', 'couture'],
  street: ['candid', 'urban', 'documentary', 'real-life', 'spontaneous', 'authentic', 'raw', 'unposed'],
  landscape: ['scenic', 'vista', 'panorama', 'horizon', 'nature', 'outdoors', 'wide-angle', 'expansive'],
  indoor: ['interior', 'inside', 'room', 'space', 'domestic', 'enclosed', 'shelter', 'home'],
  outdoor: ['outside', 'exterior', 'open-air', 'alfresco', 'nature', 'environment', 'fresh-air', 'landscape']
};

// Function to get unique tags for an image based on its position
function getUniqueTags(collectionTags, imageIndex, totalImages) {
  const tags = [];
  
  collectionTags.forEach((baseTag, tagIndex) => {
    const variations = tagVariations[baseTag] || [baseTag];
    // Use image index to select different variations
    const variationIndex = (imageIndex + tagIndex) % variations.length;
    tags.push(variations[variationIndex]);
  });
  
  // Add position-based tags
  if (imageIndex === 0) {
    tags.push('featured');
  } else if (imageIndex === totalImages - 1) {
    tags.push('final');
  } else if (imageIndex < totalImages / 3) {
    tags.push('early');
  } else if (imageIndex > (totalImages * 2) / 3) {
    tags.push('late');
  } else {
    tags.push('mid');
  }
  
  return tags;
}

let totalUpdated = 0;

collections.forEach(collection => {
  console.log(`Processing collection: ${collection.name}`);
  
  // Get collection tags
  const collectionTags = db.prepare(`
    SELECT tag FROM collection_tags WHERE collectionId = ?
  `).all(collection.id).map(row => row.tag);
  
  // Get all images in collection
  const images = db.prepare(`
    SELECT * FROM images WHERE collectionId = ? ORDER BY sortOrder
  `).all(collection.id);
  
  console.log(`  - ${images.length} images found`);
  
  images.forEach((image, index) => {
    // Delete existing tags for this image
    db.prepare('DELETE FROM image_tags WHERE imageId = ?').run(image.id);
    
    // Generate unique tags for this image
    const uniqueTags = getUniqueTags(collectionTags, index, images.length);
    
    // Insert new unique tags
    const insertTag = db.prepare('INSERT INTO image_tags (imageId, tag) VALUES (?, ?)');
    uniqueTags.forEach(tag => {
      try {
        insertTag.run(image.id, tag);
        totalUpdated++;
      } catch (err) {
        // Ignore duplicates
      }
    });
    
    console.log(`  - Image ${index + 1}: ${uniqueTags.join(', ')}`);
  });
  
  console.log('');
});

console.log(`\n✅ Updated ${totalUpdated} image tags across ${collections.length} collections!`);
console.log('Each image now has unique tags based on its position and collection theme.\n');

db.close();
