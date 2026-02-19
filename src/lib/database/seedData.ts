// Seed Data for Development and Testing
// This file contains sample data to populate the database for development

import { BlogPost, GalleryCollection } from './schema'
import { comprehensiveGalleryCollections } from './galleryCollections'

export const seedBlogPosts: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Urban Shadows and Light',
    subtitle: 'Exploring contrast in city photography',
    subtitlePosition: 'after',
    content: `The interplay between light and shadow in urban environments creates some of the most compelling photographic opportunities. Every street corner becomes a stage where drama unfolds through the simple dance of illumination and darkness. The harsh midday sun casting sharp shadows between buildings, the soft glow of streetlights painting warm pools on wet pavement, the dramatic silhouettes of pedestrians against bright storefronts.

<img src="/filler/DETAILS_1.0.jpeg" alt="Urban detail" />

Walking through the city with a camera teaches you to see differently. You begin to notice how light behaves as it bounces off glass facades, how it filters through fire escapes, how it creates geometric patterns on concrete walls. The urban landscape is constantly changing, and with it, the quality and direction of light. What appears mundane in flat lighting can become extraordinary when the sun hits it just right.

<img src="/filler/DUO_1.0.jpeg" alt="Street scene" />

The key to successful urban photography lies in patience and observation. Sometimes you need to wait for the right moment when a person walks into your frame, when a cloud moves to reveal the sun, when the traffic light changes and creates a new color palette. These moments of serendipity are what make street photography so addictive and rewarding.`,
    excerpt: 'The interplay between light and shadow in urban environments creates some of the most compelling photographic opportunities.',
    coverImage: '/filler/BTC_1.6.jpeg',
    category: 'Street Photography',
    tags: ['urban', 'shadows', 'contrast', 'city'],
    author: 'Stelly',
    publishedAt: '2022-03-15T10:00:00Z',
    status: 'published',
    viewCount: 245,
    likes: 18,
    images: [
      {
        id: 1,
        url: '/filler/DETAILS_1.0.jpeg',
        alt: 'Urban detail',
        position: 1,
        width: 800,
        height: 600,
        fileSize: 125000,
        mimeType: 'image/jpeg'
      },
      {
        id: 2,
        url: '/filler/DUO_1.0.jpeg',
        alt: 'Street scene',
        position: 2,
        width: 800,
        height: 600,
        fileSize: 135000,
        mimeType: 'image/jpeg'
      }
    ],
    seo: {
      metaTitle: 'Urban Shadows and Light - Street Photography Guide',
      metaDescription: 'Exploring contrast in city photography through the interplay of light and shadow in urban environments.',
      keywords: ['urban photography', 'street photography', 'shadows', 'light', 'city'],
      ogTitle: 'Urban Shadows and Light',
      ogDescription: 'Exploring contrast in city photography',
      ogImage: '/filler/BTC_1.6.jpeg'
    },
    isActive: true,
    slug: 'urban-shadows-and-light',
    folderPath: 'posts/post-1647339600000-urban-shadows-and-light'
  },
  {
    title: 'The Art of Minimalism',
    subtitle: 'Less is more in visual storytelling',
    subtitlePosition: 'after',
    content: `Minimalism in photography is about stripping away the unnecessary to reveal the essential. It's a discipline that challenges photographers to find beauty in simplicity, to tell complete stories with fewer elements, and to create impact through restraint rather than abundance. The power of negative space, the elegance of clean lines, the poetry of a single subject against an uncluttered background.

<img src="/filler/DETAILS_1.1.jpeg" alt="Minimal composition" />

Creating minimalist photographs requires a different mindset. Instead of trying to include everything interesting in the frame, you must learn to exclude. Every element that remains must earn its place, must contribute to the overall message or feeling of the image. This process of elimination often reveals the true essence of your subject.

The challenge lies not in what to include, but in what to leave out. A single flower against a white wall can be more powerful than an entire garden. A lone figure on an empty beach can convey solitude more effectively than a crowd. The space around your subject becomes as important as the subject itself.

<img src="/filler/DETAILS_1.2.jpeg" alt="Clean lines" />

Minimalism also teaches us about the importance of light and shadow in their purest forms. Without the distraction of complex compositions, every subtle gradation of tone becomes significant. The way light falls across a simple surface, the gentle transition from highlight to shadow, the delicate interplay of textures – all of these elements gain prominence when given room to breathe.`,
    excerpt: 'Minimalism in photography is about stripping away the unnecessary to reveal the essential.',
    coverImage: '',
    category: 'Composition',
    tags: ['minimalism', 'composition', 'simplicity', 'design'],
    author: 'Stelly',
    publishedAt: '2022-07-22T14:30:00Z',
    status: 'published',
    viewCount: 189,
    likes: 23,
    images: [
      {
        id: 1,
        url: '/filler/DETAILS_1.1.jpeg',
        alt: 'Minimal composition',
        position: 1,
        width: 800,
        height: 600,
        fileSize: 98000,
        mimeType: 'image/jpeg'
      },
      {
        id: 2,
        url: '/filler/DETAILS_1.2.jpeg',
        alt: 'Clean lines',
        position: 2,
        width: 800,
        height: 600,
        fileSize: 87000,
        mimeType: 'image/jpeg'
      }
    ],
    seo: {
      metaTitle: 'The Art of Minimalism in Photography',
      metaDescription: 'Less is more in visual storytelling - learn the principles of minimalist photography.',
      keywords: ['minimalism', 'photography', 'composition', 'simplicity'],
      ogTitle: 'The Art of Minimalism',
      ogDescription: 'Less is more in visual storytelling'
    },
    isActive: true,
    slug: 'the-art-of-minimalism'
  }
]

export const seedGalleryCollections = comprehensiveGalleryCollections

// Utility function to seed the database
export async function seedDatabase() {
  const { dataService } = await import('./dataService')
  
  console.log('Seeding database with sample data...')
  
  // Clear existing data
  await dataService.clearAllData()
  
  // Seed blog posts
  for (const post of seedBlogPosts) {
    try {
      await dataService.createBlogPost(post)
      console.log(`✓ Created blog post: ${post.title}`)
    } catch (error) {
      console.error(`✗ Failed to create blog post: ${post.title}`, error)
    }
  }
  
  // Seed gallery collections
  for (const collection of seedGalleryCollections) {
    try {
      await dataService.createGalleryCollection(collection)
      console.log(`✓ Created gallery collection: ${collection.name}`)
    } catch (error) {
      console.error(`✗ Failed to create gallery collection: ${collection.name}`, error)
    }
  }
  
  console.log('Database seeding completed!')
  
  // Return stats
  const stats = await dataService.getContentStats()
  return stats
}

// Development helper to reset and seed database
export async function resetAndSeedDatabase() {
  console.log('Resetting and seeding database...')
  const stats = await seedDatabase()
  console.log('Database reset complete:', stats)
  return stats
}