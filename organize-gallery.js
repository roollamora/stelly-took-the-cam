const fs = require('fs');
const path = require('path');

// Collection structure based on galleryCollections.ts
const collections = [
  { id: 1, name: 'urban-nights', images: ['BTC_1.6.jpeg', 'BTC_1.7.jpeg', 'BTC_1.8.jpeg', 'BTC_1.9.jpeg', 'BTC_2.0.jpeg', 'DUO_5.0.jpeg', 'DUO_5.1.jpeg', 'DUO_5.2.jpeg'] },
  { id: 2, name: 'studio-portraits', images: ['DUO_1.0.jpeg', 'DUO_1.1.jpeg', 'DUO_1.2.jpeg', 'DUO_1.3.jpg', 'DUO_1.4.jpeg', 'DUO_1.5.jpeg', 'DUO_1.6.jpeg', 'DUO_1.7.jpeg', 'DUO_1.8.jpeg', 'DUO_1.9.jpeg'] },
  { id: 3, name: 'macro-world', images: ['DETAILS_1.0.jpeg', 'DETAILS_1.1.jpeg', 'DETAILS_1.2.jpeg', 'DETAILS_1.3.jpeg', 'DETAILS_1.4.jpeg', 'DETAILS_1.5.jpeg', 'DETAILS_1.6.jpeg', 'DETAILS_1.7.jpeg', 'DETAILS_1.8.jpeg', 'DETAILS_1.9.jpeg', 'DETAILS_2.0.jpeg', 'DETAILS_2.1.jpeg'] },
  { id: 4, name: 'street-life', images: ['DUO_2.0.jpeg', 'DUO_2.1.jpeg', 'DUO_2.2.jpeg', 'DUO_2.3.jpeg', 'DUO_2.4.jpeg', 'DUO_2.5.jpeg', 'DUO_2.6.jpeg', 'DUO_2.7.jpeg', 'DUO_2.8.jpeg', 'DUO_2.9.jpeg', 'DUO_3.0.jpeg', 'DUO_3.1.jpeg', 'DUO_3.2.jpeg', 'DUO_3.3.jpeg'] },
  { id: 5, name: 'natural-landscapes', images: ['DUO_3.4.jpeg', 'DUO_3.5.jpeg', 'DUO_3.6.jpeg', 'DUO_3.7.jpeg', 'DUO_3.8.jpeg', 'DUO_3.9.jpeg', 'DUO_4.0.jpeg', 'DUO_4.1.jpeg', 'DUO_4.2.jpeg'] },
  { id: 6, name: 'architectural-forms', images: ['DUO_4.3.jpeg', 'DUO_4.4.jpeg', 'DUO_4.5.jpeg', 'DUO_4.6.jpeg', 'DUO_4.7.jpeg', 'DUO_4.8.jpeg', 'DUO_4.9.jpeg', 'DUO_5.0.jpeg', 'DUO_5.1.jpeg', 'DUO_5.2.jpeg', 'DUO_5.3.jpeg'] },
  { id: 7, name: 'fashion-forward', images: ['DUO_5.4.jpeg', 'DUO_5.5.jpeg', 'DUO_5.6.jpeg', 'DUO_5.7.jpeg', 'DUO_5.8.jpeg', 'DUO_5.9.jpeg', 'DUO_6.0.jpeg', 'DUO_6.1.jpeg', 'DUO_6.2.jpeg', 'DUO_6.3.jpeg', 'DUO_6.4.jpeg', 'DUO_6.5.jpeg'] },
  { id: 8, name: 'monochrome-moments', images: ['DETAILS_1.5.jpg', 'DETAILS_1.7.jpg', 'DETAILS_1.9.jpg', 'DETAILS_2.1.jpg', 'DUO_1.3.jpg', 'DUO_1.9.jpg', 'DUO_2.2.jpg', 'DUO_3.2.jpg', 'DUO_3.4.jpg', 'DUO_3.7.jpg', 'DUO_3.9.jpg', 'DUO_4.0.jpg'] },
  { id: 9, name: 'real-stories', images: ['BTC_1.6.jpeg', 'BTC_1.7.jpeg', 'BTC_1.8.jpeg', 'BTC_1.9.jpeg', 'BTC_2.0.jpeg', 'DUO_2.0.jpeg', 'DUO_2.1.jpeg', 'DUO_2.2.jpeg', 'DUO_2.3.jpeg', 'DUO_2.4.jpeg', 'DUO_2.5.jpeg', 'DUO_2.6.jpeg', 'DUO_2.7.jpeg', 'DUO_2.8.jpeg', 'DUO_2.9.jpeg'] },
  { id: 10, name: 'abstract-visions', images: ['DETAILS_2.0.jpeg', 'DETAILS_2.1.jpeg', 'DETAILS_2.2.jpeg', 'DETAILS_1.0.jpeg', 'DETAILS_1.1.jpeg', 'DETAILS_1.2.jpeg', 'DETAILS_1.3.jpeg', 'DETAILS_1.4.jpeg'] },
  { id: 11, name: 'golden-hour-magic', images: ['DUO_3.4.jpeg', 'DUO_3.5.jpeg', 'DUO_3.6.jpeg', 'DUO_3.7.jpeg', 'DUO_3.8.jpeg', 'DUO_3.9.jpeg', 'DUO_4.0.jpeg', 'DUO_4.1.jpeg', 'DUO_4.2.jpeg', 'DUO_4.3.jpeg'] },
  { id: 12, name: 'interior-spaces', images: ['DUO_1.0.jpeg', 'DUO_1.1.jpeg', 'DUO_1.2.jpeg', 'DUO_1.4.jpeg', 'DUO_1.5.jpeg', 'DUO_1.6.jpeg', 'DUO_1.7.jpeg', 'DUO_1.8.jpeg', 'DUO_1.9.jpeg', 'DETAILS_1.0.jpeg', 'DETAILS_1.1.jpeg', 'DETAILS_1.2.jpeg', 'DETAILS_1.3.jpeg', 'DETAILS_1.4.jpeg', 'DETAILS_1.5.jpeg', 'DETAILS_1.6.jpeg', 'DETAILS_1.7.jpeg', 'DETAILS_1.8.jpeg', 'DETAILS_1.9.jpeg', 'DETAILS_2.0.jpeg'] },
  { id: 13, name: 'wild-and-free', images: ['DUO_4.4.jpeg', 'DUO_4.5.jpeg', 'DUO_4.6.jpeg', 'DUO_4.7.jpeg', 'DUO_4.8.jpeg', 'DUO_4.9.jpeg', 'DUO_5.0.jpeg', 'DUO_5.1.jpeg', 'DUO_5.2.jpeg', 'DUO_5.3.jpeg', 'DUO_5.4.jpeg'] },
  { id: 14, name: 'less-is-more', images: ['DETAILS_2.2.jpeg', 'DETAILS_2.1.jpeg', 'DETAILS_2.0.jpeg', 'DETAILS_1.9.jpeg', 'DETAILS_1.8.jpeg', 'DETAILS_1.7.jpeg', 'DETAILS_1.6.jpeg', 'DETAILS_1.5.jpeg', 'DETAILS_1.4.jpeg', 'DETAILS_1.3.jpeg', 'DETAILS_1.2.jpeg', 'DETAILS_1.1.jpeg', 'DETAILS_1.0.jpeg'] },
  { id: 15, name: 'color-explosion', images: ['DUO_5.5.jpeg', 'DUO_5.6.jpeg', 'DUO_5.7.jpeg', 'DUO_5.8.jpeg', 'DUO_5.9.jpeg', 'DUO_6.0.jpeg', 'DUO_6.1.jpeg', 'DUO_6.2.jpeg', 'DUO_6.3.jpeg', 'DUO_6.4.jpeg', 'DUO_6.5.jpeg', 'DUO_4.0.jpeg', 'DUO_4.1.jpeg', 'DUO_4.2.jpeg'] },
  { id: 16, name: 'unposed-reality', images: ['DUO_2.6.jpeg', 'DUO_2.7.jpeg', 'DUO_2.8.jpeg', 'DUO_2.9.jpeg', 'DUO_3.0.jpeg', 'DUO_3.1.jpeg', 'DUO_3.2.jpeg', 'DUO_3.3.jpeg', 'BTC_1.6.jpeg', 'BTC_1.7.jpeg', 'BTC_1.8.jpeg', 'BTC_1.9.jpeg', 'BTC_2.0.jpeg', 'DUO_1.0.jpeg', 'DUO_1.1.jpeg'] },
  { id: 17, name: 'creative-experiments', images: ['DETAILS_1.8.jpeg', 'DETAILS_1.9.jpeg', 'DETAILS_2.0.jpeg', 'DETAILS_2.1.jpeg', 'DETAILS_2.2.jpeg', 'DETAILS_1.0.jpeg', 'DETAILS_1.1.jpeg', 'DETAILS_1.2.jpeg', 'DETAILS_1.3.jpeg', 'DETAILS_1.4.jpeg', 'DETAILS_1.5.jpeg', 'DETAILS_1.6.jpeg', 'DETAILS_1.7.jpeg', 'DUO_6.0.jpeg', 'DUO_6.1.jpeg', 'DUO_6.2.jpeg', 'DUO_6.3.jpeg', 'DUO_6.4.jpeg', 'DUO_6.5.jpeg'] }
];

const sourceDir = path.join(__dirname, 'public', 'filler');
const targetDir = path.join(__dirname, 'public', 'gallery');

// Create gallery directory
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log('Organizing gallery collections...\n');

collections.forEach(collection => {
  const collectionDir = path.join(targetDir, collection.name);
  
  // Create collection directory
  if (!fs.existsSync(collectionDir)) {
    fs.mkdirSync(collectionDir, { recursive: true });
  }
  
  console.log(`Collection ${collection.id}: ${collection.name}`);
  
  collection.images.forEach((image, index) => {
    const sourcePath = path.join(sourceDir, image);
    const ext = path.extname(image);
    const newName = String(index).padStart(2, '0') + ext;
    const targetPath = path.join(collectionDir, newName);
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`  ✓ ${image} → ${newName}`);
    } else {
      console.log(`  ✗ ${image} (not found)`);
    }
  });
  
  console.log('');
});

console.log('Done! Collections organized in public/gallery/');
console.log('\nFolder structure:');
console.log('public/gallery/');
collections.forEach(c => {
  console.log(`  ${c.name}/ (${c.images.length} images)`);
});
