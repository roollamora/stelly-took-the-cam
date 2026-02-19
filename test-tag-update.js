// Test script to update image tags
const fetch = require('node-fetch');

async function testTagUpdate() {
  console.log('1. Fetching collection...');
  const getResponse = await fetch('http://localhost:3001/api/gallery/collections/1');
  const collection = await getResponse.json();
  
  console.log('2. Current first image tags:', collection.images[0].tags);
  
  // Add a test tag to first image
  collection.images[0].tags.push('test-tag-' + Date.now());
  
  console.log('3. Updated tags:', collection.images[0].tags);
  console.log('4. Sending update...');
  
  const updateResponse = await fetch('http://localhost:3001/api/gallery/collections/1', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(collection)
  });
  
  if (updateResponse.ok) {
    console.log('5. Update successful!');
    
    // Fetch again to verify
    const verifyResponse = await fetch('http://localhost:3001/api/gallery/collections/1');
    const updated = await verifyResponse.json();
    console.log('6. Verified tags:', updated.images[0].tags);
  } else {
    console.log('5. Update failed:', await updateResponse.text());
  }
}

testTagUpdate().catch(console.error);
