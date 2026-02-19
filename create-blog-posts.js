// Script to create 20 diverse blog posts with lorem ipsum text
// Run this with: node create-blog-posts.js

const fs = require('fs');
const path = require('path');

// Get all available filler images
const fillerDir = path.join(__dirname, 'public', 'filler');
const fillerImages = fs.readdirSync(fillerDir)
  .filter(file => file.match(/\.(jpg|jpeg|png)$/i))
  .map(file => `/filler/${file}`);

console.log(`Found ${fillerImages.length} filler images`);

// Helper to get random images
function getRandomImages(count) {
  const shuffled = [...fillerImages].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Helper to generate lorem ipsum
function generateLoremIpsum(wordCount = 400) {
  const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.

Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.`;
  
  const words = lorem.split(' ');
  const result = [];
  
  while (result.join(' ').split(' ').length < wordCount) {
    result.push(...words);
  }
  
  return result.slice(0, wordCount).join(' ');
}

// Blog post templates
const blogPosts = [
  {
    title: 'Exploring Urban Landscapes',
    subtitle: 'A journey through city streets',
    category: 'Urban Photography',
    tags: ['urban', 'city', 'street', 'architecture'],
    imageCount: 3
  },
  {
    title: 'The Art of Portrait Photography',
    subtitle: 'Capturing human emotion',
    category: 'Portrait',
    tags: ['portrait', 'people', 'emotion', 'studio'],
    imageCount: 4
  },
  {
    title: 'Minimalist Compositions',
    subtitle: 'Less is more in photography',
    category: 'Minimalism',
    tags: ['minimalist', 'simple', 'clean', 'composition'],
    imageCount: 2
  },
  {
    title: 'Night Photography Techniques',
    subtitle: 'Mastering low light conditions',
    category: 'Technical',
    tags: ['night', 'low-light', 'technique', 'tutorial'],
    imageCount: 3
  },
  {
    title: 'Fashion Photography Trends',
    subtitle: 'Current styles and approaches',
    category: 'Fashion',
    tags: ['fashion', 'style', 'trends', 'editorial'],
    imageCount: 4
  },
  {
    title: 'Documentary Storytelling',
    subtitle: 'Truth through the lens',
    category: 'Documentary',
    tags: ['documentary', 'storytelling', 'social', 'truth'],
    imageCount: 3
  },
  {
    title: 'Macro Photography Wonders',
    subtitle: 'Discovering the small world',
    category: 'Macro',
    tags: ['macro', 'close-up', 'detail', 'nature'],
    imageCount: 2
  },
  {
    title: 'Landscape Photography Guide',
    subtitle: 'Capturing nature\'s beauty',
    category: 'Landscape',
    tags: ['landscape', 'nature', 'outdoor', 'scenic'],
    imageCount: 3
  },
  {
    title: 'Street Photography Ethics',
    subtitle: 'Responsible image making',
    category: 'Ethics',
    tags: ['street', 'ethics', 'responsibility', 'documentary'],
    imageCount: 2
  },
  {
    title: 'Color Theory in Photography',
    subtitle: 'Understanding visual harmony',
    category: 'Theory',
    tags: ['color', 'theory', 'composition', 'design'],
    imageCount: 4
  },
  {
    title: 'Black and White Mastery',
    subtitle: 'The timeless monochrome',
    category: 'Black & White',
    tags: ['black-white', 'monochrome', 'classic', 'contrast'],
    imageCount: 3
  },
  {
    title: 'Food Photography Styling',
    subtitle: 'Making meals look delicious',
    category: 'Food',
    tags: ['food', 'styling', 'commercial', 'appetizing'],
    imageCount: 3
  },
  {
    title: 'Architectural Photography',
    subtitle: 'Lines, shapes, and structures',
    category: 'Architecture',
    tags: ['architecture', 'building', 'geometric', 'urban'],
    imageCount: 2
  },
  {
    title: 'Wildlife Photography Tips',
    subtitle: 'Patience and preparation',
    category: 'Wildlife',
    tags: ['wildlife', 'nature', 'animals', 'patience'],
    imageCount: 3
  },
  {
    title: 'Concert Photography',
    subtitle: 'Capturing live music energy',
    category: 'Concert',
    tags: ['concert', 'music', 'live', 'energy'],
    imageCount: 4
  },
  {
    title: 'Travel Photography Essentials',
    subtitle: 'Documenting your journeys',
    category: 'Travel',
    tags: ['travel', 'adventure', 'culture', 'exploration'],
    imageCount: 3
  },
  {
    title: 'Product Photography Basics',
    subtitle: 'Commercial image making',
    category: 'Commercial',
    tags: ['product', 'commercial', 'advertising', 'studio'],
    imageCount: 2
  },
  {
    title: 'Sports Photography Action',
    subtitle: 'Freezing the perfect moment',
    category: 'Sports',
    tags: ['sports', 'action', 'motion', 'athletics'],
    imageCount: 3
  },
  {
    title: 'Fine Art Photography',
    subtitle: 'Personal creative expression',
    category: 'Fine Art',
    tags: ['fine-art', 'creative', 'artistic', 'expression'],
    imageCount: 4
  },
  {
    title: 'Aerial Photography Perspectives',
    subtitle: 'The world from above',
    category: 'Aerial',
    tags: ['aerial', 'drone', 'perspective', 'landscape'],
    imageCount: 3
  }
];

// Generate full blog posts with content and images
const fullPosts = blogPosts.map((template, index) => {
  const images = getRandomImages(template.imageCount);
  const loremText = generateLoremIpsum(400);
  
  // Split lorem into paragraphs and insert images
  const paragraphs = loremText.match(/.{1,200}[.!?]/g) || [loremText];
  let content = '';
  
  paragraphs.forEach((para, i) => {
    content += para + '\n\n';
    
    // Insert image after every 2 paragraphs
    if ((i + 1) % 2 === 0 && images[Math.floor(i / 2)]) {
      content += `<img src="${images[Math.floor(i / 2)]}" alt="Image ${Math.floor(i / 2) + 1}" />\n\n`;
    }
  });
  
  // Add any remaining images at the end
  const usedImages = Math.floor(paragraphs.length / 2);
  images.slice(usedImages).forEach((img, i) => {
    content += `<img src="${img}" alt="Image ${usedImages + i + 1}" />\n\n`;
  });
  
  return {
    id: 21 + index,
    title: template.title,
    subtitle: template.subtitle,
    subtitlePosition: 'after',
    category: template.category,
    date: new Date(2024, 0, 1 + index).toISOString().split('T')[0],
    tags: template.tags,
    coverImage: images[0],
    content: content.trim(),
    images: images
  };
});

// Write to a JSON file
const outputPath = path.join(__dirname, 'new-blog-posts.json');
fs.writeFileSync(outputPath, JSON.stringify(fullPosts, null, 2));

console.log(`\n✅ Created ${fullPosts.length} blog posts!`);
console.log(`📄 Saved to: ${outputPath}`);
console.log('\nTo import these posts:');
console.log('1. Go to http://localhost:3001/admin');
console.log('2. Use the import function to load new-blog-posts.json');
console.log('\nOr copy the JSON content and paste it into the admin panel.');
