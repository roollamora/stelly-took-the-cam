// Seed blog posts into the database
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

console.log('📦 Seeding blog posts into database...');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create blog_posts table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subtitle TEXT,
    subtitlePosition TEXT DEFAULT 'after',
    content TEXT NOT NULL,
    excerpt TEXT,
    coverImage TEXT,
    category TEXT NOT NULL,
    tags TEXT,
    author TEXT NOT NULL,
    publishedAt TEXT,
    status TEXT DEFAULT 'draft',
    viewCount INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    images TEXT,
    seo TEXT,
    isActive INTEGER DEFAULT 1,
    slug TEXT UNIQUE,
    folderPath TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
  CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
  CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
  CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author);
`);

console.log('✅ Blog posts table created/verified');

// Sample blog posts
const samplePosts = [
  {
    title: 'Urban Shadows and Light',
    subtitle: 'Exploring contrast in city photography',
    subtitlePosition: 'after',
    content: `The interplay between light and shadow in urban environments creates some of the most compelling photographic opportunities. Every street corner becomes a stage where drama unfolds through the simple dance of illumination and darkness.

<img src="/filler/DETAILS_1.0.jpeg" alt="Urban detail" />

Walking through the city with a camera teaches you to see differently. You begin to notice how light behaves as it bounces off glass facades, how it filters through fire escapes, how it creates geometric patterns on concrete walls.

<img src="/filler/DUO_1.0.jpeg" alt="Street scene" />

The key to successful urban photography lies in patience and observation. Sometimes you need to wait for the right moment when a person walks into your frame, when a cloud moves to reveal the sun, when the traffic light changes and creates a new color palette.`,
    excerpt: 'The interplay between light and shadow in urban environments creates some of the most compelling photographic opportunities.',
    coverImage: '/filler/BTC_1.6.jpeg',
    category: 'Street Photography',
    tags: JSON.stringify(['urban', 'shadows', 'contrast', 'city']),
    author: 'Stelly',
    publishedAt: '2022-03-15T10:00:00Z',
    status: 'published',
    viewCount: 245,
    likes: 18,
    images: JSON.stringify([
      { id: 1, url: '/filler/DETAILS_1.0.jpeg', alt: 'Urban detail', position: 1 },
      { id: 2, url: '/filler/DUO_1.0.jpeg', alt: 'Street scene', position: 2 }
    ]),
    slug: 'urban-shadows-and-light'
  },
  {
    title: 'The Art of Minimalism',
    subtitle: 'Less is more in visual storytelling',
    subtitlePosition: 'after',
    content: `Minimalism in photography is about stripping away the unnecessary to reveal the essential. It's a discipline that challenges photographers to find beauty in simplicity.

<img src="/filler/DETAILS_1.1.jpeg" alt="Minimal composition" />

Creating minimalist photographs requires a different mindset. Instead of trying to include everything interesting in the frame, you must learn to exclude. Every element that remains must earn its place.

<img src="/filler/DETAILS_1.2.jpeg" alt="Clean lines" />

The challenge lies not in what to include, but in what to leave out. A single flower against a white wall can be more powerful than an entire garden.`,
    excerpt: 'Minimalism in photography is about stripping away the unnecessary to reveal the essential.',
    coverImage: '/filler/DETAILS_1.1.jpeg',
    category: 'Composition',
    tags: JSON.stringify(['minimalism', 'composition', 'simplicity', 'design']),
    author: 'Stelly',
    publishedAt: '2022-07-22T14:30:00Z',
    status: 'published',
    viewCount: 189,
    likes: 23,
    images: JSON.stringify([
      { id: 1, url: '/filler/DETAILS_1.1.jpeg', alt: 'Minimal composition', position: 1 },
      { id: 2, url: '/filler/DETAILS_1.2.jpeg', alt: 'Clean lines', position: 2 }
    ]),
    slug: 'the-art-of-minimalism'
  },
  {
    title: 'Portrait Sessions: Beyond the Surface',
    subtitle: 'Capturing authentic human connections',
    subtitlePosition: 'after',
    content: `Every portrait session is a conversation without words, a dance between photographer and subject where trust and understanding gradually build.

<img src="/filler/DUO_2.1.jpeg" alt="Natural expression" />

The technical aspects of portrait photography – lighting, composition, focus – are just the foundation. The real art lies in creating an environment where authentic emotions can surface.

<img src="/filler/DUO_2.2.jpeg" alt="Candid moment" />

The eyes truly are the windows to the soul in portrait photography. A sharp, well-lit eye can make or break a portrait.`,
    excerpt: 'Every portrait session is a conversation without words, a dance between photographer and subject.',
    coverImage: '/filler/DUO_2.0.jpeg',
    category: 'Portrait',
    tags: JSON.stringify(['portrait', 'people', 'emotion', 'connection']),
    author: 'Stelly',
    publishedAt: '2022-11-08T16:00:00Z',
    status: 'published',
    viewCount: 312,
    likes: 45,
    images: JSON.stringify([
      { id: 1, url: '/filler/DUO_2.1.jpeg', alt: 'Natural expression', position: 1 },
      { id: 2, url: '/filler/DUO_2.2.jpeg', alt: 'Candid moment', position: 2 }
    ]),
    slug: 'portrait-sessions-beyond-the-surface'
  },
  {
    title: 'Golden Hour Magic',
    subtitle: 'Chasing the perfect light',
    subtitlePosition: 'after',
    content: `The golden hour – that magical time just after sunrise and before sunset when the light is soft, warm, and forgiving – is every photographer's favorite time of day.

<img src="/filler/DUO_3.1.jpeg" alt="Golden light landscape" />

Planning for golden hour photography requires dedication and preparation. You need to scout locations in advance, understand how the light will move across your scene.

<img src="/filler/DUO_3.2.jpeg" alt="Portrait in golden light" />

Landscape photographers often plan entire trips around golden hour opportunities. The same mountain or coastline that looks ordinary in harsh midday sun can become breathtaking.`,
    excerpt: 'The golden hour is that magical time when the light is soft, warm, and forgiving.',
    coverImage: '/filler/DUO_3.0.jpeg',
    category: 'Landscape',
    tags: JSON.stringify(['golden hour', 'landscape', 'natural light', 'timing']),
    author: 'Stelly',
    publishedAt: '2023-04-03T09:00:00Z',
    status: 'published',
    viewCount: 428,
    likes: 67,
    images: JSON.stringify([
      { id: 1, url: '/filler/DUO_3.1.jpeg', alt: 'Golden light landscape', position: 1 },
      { id: 2, url: '/filler/DUO_3.2.jpeg', alt: 'Portrait in golden light', position: 2 }
    ]),
    slug: 'golden-hour-magic'
  },
  {
    title: 'Night Photography Adventures',
    subtitle: 'When darkness reveals new worlds',
    subtitlePosition: 'after',
    content: `Night photography opens up a completely different world of creative possibilities. When the sun sets, artificial lights create new color palettes.

<img src="/filler/DUO_5.0.jpeg" alt="City lights at night" />

Urban night photography transforms cities into rivers of light. Car headlights become flowing streams of red and white, neon signs paint buildings in electric colors.

<img src="/filler/DUO_5.1.jpeg" alt="Star trails" />

Long exposure techniques are essential for night photography. They allow photographers to capture star trails, smooth water surfaces, and the movement of clouds.`,
    excerpt: 'Night photography opens up a completely different world of creative possibilities.',
    coverImage: '/filler/DUO_5.0.jpeg',
    category: 'Night Photography',
    tags: JSON.stringify(['night', 'long exposure', 'city lights', 'stars']),
    author: 'Stelly',
    publishedAt: '2024-02-28T20:00:00Z',
    status: 'published',
    viewCount: 567,
    likes: 89,
    images: JSON.stringify([
      { id: 1, url: '/filler/DUO_5.0.jpeg', alt: 'City lights at night', position: 1 },
      { id: 2, url: '/filler/DUO_5.1.jpeg', alt: 'Star trails', position: 2 }
    ]),
    slug: 'night-photography-adventures'
  }
];

// Insert posts
const insertPost = db.prepare(`
  INSERT INTO blog_posts (
    title, subtitle, subtitlePosition, content, excerpt, coverImage,
    category, tags, author, publishedAt, status, viewCount, likes,
    images, slug
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertAll = db.transaction(() => {
  samplePosts.forEach(post => {
    try {
      insertPost.run(
        post.title,
        post.subtitle,
        post.subtitlePosition,
        post.content,
        post.excerpt,
        post.coverImage,
        post.category,
        post.tags,
        post.author,
        post.publishedAt,
        post.status,
        post.viewCount,
        post.likes,
        post.images,
        post.slug
      );
      console.log(`  ✓ Added: ${post.title}`);
    } catch (error) {
      if (error.message.includes('UNIQUE constraint')) {
        console.log(`  ⊘ Skipped (already exists): ${post.title}`);
      } else {
        console.error(`  ✗ Error adding ${post.title}:`, error.message);
      }
    }
  });
});

console.log('\n💾 Inserting blog posts...');
insertAll();

// Verify data
const postCount = db.prepare('SELECT COUNT(*) as count FROM blog_posts').get();

console.log('\n✅ Blog posts seeded successfully!');
console.log(`📊 Total blog posts in database: ${postCount.count}`);

db.close();
