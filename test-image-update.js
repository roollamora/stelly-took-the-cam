// Test updating a single image
const fetch = require('node-fetch');

async function testImageUpdate() {
  console.log('1. Fetching image...');
  const getResponse = await fetch('http://localhost:3001/api/gallery/collections/1');
  const collection = await getResponse.json();
  const image = collection.images[0];
  
  console.log('2. Current tags:', image.tags);
  
  // Add a new tag
  image.tags.push('direct-update-' + Date.now());
  
  console.log('3. Updated tags:', image.tags);
  console.log('4. Sending update to /api/gallery/images/' + image.id);
  
  const updateResponse = await fetch(`http://localhost:3001/api/gallery/images/${image.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(image)
  });
  
  if (updateResponse.ok) {
    const updated = await updateResponse.json();
    console.log('5. Update successful!');
    console.log('6. Returned tags:', updated.tags);
  } else {
    console.log('5. Update failed:', await updateResponse.text());
  }
}

testImageUpdate().catch(console.error);
