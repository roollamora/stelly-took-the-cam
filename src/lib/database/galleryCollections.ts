// Comprehensive Gallery Collections with Detailed Tags
// 17 collections with 6-20 images each, fully tagged

import { GalleryCollection } from './schema'

// Helper function to create image with tags
const createImage = (
  id: number,
  url: string,
  tags: string[],
  sortOrder: number
) => ({
  id,
  url,
  alt: `Image ${id}`,
  tags,
  dimensions: { width: 1200, height: 800, aspectRatio: 1.5 },
  metadata: {
    fileSize: 200000,
    mimeType: 'image/jpeg' as const,
    originalName: `image-${id}.jpg`,
    uploadedAt: new Date().toISOString()
  },
  sortOrder,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isActive: true
})

export const comprehensiveGalleryCollections: Omit<GalleryCollection, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Collection 1: Urban Night Photography
  {
    name: 'Urban Nights',
    description: 'City life after dark - neon lights and urban landscapes',
    coverImage: '/filler/BTC_1.6.jpeg',
    category: 'Urban',
    images: [
      createImage(1, '/filler/BTC_1.6.jpeg', ['urban', 'night', 'outdoor', 'landscape', 'cool-tones', 'wide-angle'], 0),
      createImage(2, '/filler/BTC_1.7.jpeg', ['urban', 'night', 'outdoor', 'portrait', 'warm-tones', 'standard'], 1),
      createImage(3, '/filler/BTC_1.8.jpeg', ['urban', 'night', 'indoor', 'detail', 'cool-tones', 'macro'], 2),
      createImage(4, '/filler/BTC_1.9.jpeg', ['urban', 'night', 'outdoor', 'street', 'mixed-tones', 'wide-angle'], 3),
      createImage(5, '/filler/BTC_2.0.jpeg', ['urban', 'night', 'outdoor', 'architecture', 'cool-tones', 'standard'], 4),
      createImage(6, '/filler/DUO_5.0.jpeg', ['urban', 'night', 'outdoor', 'people', 'warm-tones', 'portrait'], 5),
      createImage(7, '/filler/DUO_5.1.jpeg', ['urban', 'night', 'outdoor', 'landscape', 'cool-tones', 'wide-angle'], 6),
      createImage(8, '/filler/DUO_5.2.jpeg', ['urban', 'night', 'indoor', 'detail', 'warm-tones', 'macro'], 7),
    ],
    isPublic: true,
    sortOrder: 1,
    seo: {
      keywords: ['urban', 'night', 'city', 'photography'],
      metaTitle: 'Urban Nights Photography Collection',
      metaDescription: 'City life after dark - neon lights and urban landscapes'
    },
    isActive: true,
    slug: 'urban-nights'
  },

  // Collection 2: Portrait Studio Sessions
  {
    name: 'Studio Portraits',
    description: 'Professional portrait photography in controlled studio environment',
    coverImage: '/filler/DUO_1.0.jpeg',
    category: 'Portrait',
    images: [
      createImage(1, '/filler/DUO_1.0.jpeg', ['portrait', 'day', 'indoor', 'model-female', 'warm-tones', 'standard'], 0),
      createImage(2, '/filler/DUO_1.1.jpeg', ['portrait', 'day', 'indoor', 'model-male', 'cool-tones', 'standard'], 1),
      createImage(3, '/filler/DUO_1.2.jpeg', ['portrait', 'day', 'indoor', 'model-female', 'warm-tones', 'close-up'], 2),
      createImage(4, '/filler/DUO_1.3.jpg', ['portrait', 'day', 'indoor', 'model-male', 'mixed-tones', 'standard'], 3),
      createImage(5, '/filler/DUO_1.4.jpeg', ['portrait', 'day', 'indoor', 'model-female', 'warm-tones', 'portrait'], 4),
      createImage(6, '/filler/DUO_1.5.jpeg', ['portrait', 'day', 'indoor', 'model-male', 'cool-tones', 'standard'], 5),
      createImage(7, '/filler/DUO_1.6.jpeg', ['portrait', 'day', 'indoor', 'model-female', 'warm-tones', 'close-up'], 6),
      createImage(8, '/filler/DUO_1.7.jpeg', ['portrait', 'day', 'indoor', 'model-male', 'mixed-tones', 'portrait'], 7),
      createImage(9, '/filler/DUO_1.8.jpeg', ['portrait', 'day', 'indoor', 'model-female', 'warm-tones', 'standard'], 8),
      createImage(10, '/filler/DUO_1.9.jpeg', ['portrait', 'day', 'indoor', 'model-male', 'cool-tones', 'close-up'], 9),
    ],
    isPublic: true,
    sortOrder: 2,
    seo: {
      keywords: ['portrait', 'studio', 'professional', 'photography'],
      metaTitle: 'Studio Portrait Photography Collection',
      metaDescription: 'Professional portrait photography in controlled studio environment'
    },
    isActive: true,
    slug: 'studio-portraits'
  },

  // Collection 3: Macro Details
  {
    name: 'Macro World',
    description: 'Extreme close-ups revealing hidden textures and patterns',
    coverImage: '/filler/DETAILS_1.0.jpeg',
    category: 'Macro',
    images: [
      createImage(1, '/filler/DETAILS_1.0.jpeg', ['macro', 'day', 'outdoor', 'nature', 'cool-tones', 'macro'], 0),
      createImage(2, '/filler/DETAILS_1.1.jpeg', ['macro', 'day', 'outdoor', 'texture', 'warm-tones', 'macro'], 1),
      createImage(3, '/filler/DETAILS_1.2.jpeg', ['macro', 'day', 'indoor', 'object', 'cool-tones', 'macro'], 2),
      createImage(4, '/filler/DETAILS_1.3.jpeg', ['macro', 'day', 'outdoor', 'nature', 'mixed-tones', 'macro'], 3),
      createImage(5, '/filler/DETAILS_1.4.jpeg', ['macro', 'day', 'indoor', 'texture', 'warm-tones', 'macro'], 4),
      createImage(6, '/filler/DETAILS_1.5.jpeg', ['macro', 'day', 'outdoor', 'object', 'cool-tones', 'macro'], 5),
      createImage(7, '/filler/DETAILS_1.6.jpeg', ['macro', 'day', 'indoor', 'nature', 'mixed-tones', 'macro'], 6),
      createImage(8, '/filler/DETAILS_1.7.jpeg', ['macro', 'day', 'outdoor', 'texture', 'warm-tones', 'macro'], 7),
      createImage(9, '/filler/DETAILS_1.8.jpeg', ['macro', 'day', 'indoor', 'object', 'cool-tones', 'macro'], 8),
      createImage(10, '/filler/DETAILS_1.9.jpeg', ['macro', 'day', 'outdoor', 'nature', 'mixed-tones', 'macro'], 9),
      createImage(11, '/filler/DETAILS_2.0.jpeg', ['macro', 'day', 'indoor', 'texture', 'warm-tones', 'macro'], 10),
      createImage(12, '/filler/DETAILS_2.1.jpeg', ['macro', 'day', 'outdoor', 'object', 'cool-tones', 'macro'], 11),
    ],
    isPublic: true,
    sortOrder: 3,
    seo: {
      keywords: ['macro', 'detail', 'close-up', 'photography'],
      metaTitle: 'Macro Photography Collection',
      metaDescription: 'Extreme close-ups revealing hidden textures and patterns'
    },
    isActive: true,
    slug: 'macro-world'
  },

  // Collection 4: Street Photography
  {
    name: 'Street Life',
    description: 'Candid moments captured in urban environments',
    coverImage: '/filler/DUO_2.0.jpeg',
    category: 'Street',
    images: [
      createImage(1, '/filler/DUO_2.0.jpeg', ['street', 'day', 'outdoor', 'people', 'warm-tones', 'standard'], 0),
      createImage(2, '/filler/DUO_2.1.jpeg', ['street', 'day', 'outdoor', 'urban', 'cool-tones', 'wide-angle'], 1),
      createImage(3, '/filler/DUO_2.2.jpeg', ['street', 'day', 'outdoor', 'people', 'mixed-tones', 'standard'], 2),
      createImage(4, '/filler/DUO_2.3.jpeg', ['street', 'day', 'outdoor', 'urban', 'warm-tones', 'portrait'], 3),
      createImage(5, '/filler/DUO_2.4.jpeg', ['street', 'day', 'outdoor', 'people', 'cool-tones', 'standard'], 4),
      createImage(6, '/filler/DUO_2.5.jpeg', ['street', 'day', 'outdoor', 'urban', 'mixed-tones', 'wide-angle'], 5),
      createImage(7, '/filler/DUO_2.6.jpeg', ['street', 'day', 'outdoor', 'people', 'warm-tones', 'portrait'], 6),
      createImage(8, '/filler/DUO_2.7.jpeg', ['street', 'day', 'outdoor', 'urban', 'cool-tones', 'standard'], 7),
      createImage(9, '/filler/DUO_2.8.jpeg', ['street', 'day', 'outdoor', 'people', 'mixed-tones', 'standard'], 8),
      createImage(10, '/filler/DUO_2.9.jpeg', ['street', 'day', 'outdoor', 'urban', 'warm-tones', 'wide-angle'], 9),
      createImage(11, '/filler/DUO_3.0.jpeg', ['street', 'day', 'outdoor', 'people', 'cool-tones', 'portrait'], 10),
      createImage(12, '/filler/DUO_3.1.jpeg', ['street', 'day', 'outdoor', 'urban', 'mixed-tones', 'standard'], 11),
      createImage(13, '/filler/DUO_3.2.jpeg', ['street', 'day', 'outdoor', 'people', 'warm-tones', 'standard'], 12),
      createImage(14, '/filler/DUO_3.3.jpeg', ['street', 'day', 'outdoor', 'urban', 'cool-tones', 'wide-angle'], 13),
    ],
    isPublic: true,
    sortOrder: 4,
    seo: {
      keywords: ['street', 'urban', 'candid', 'photography'],
      metaTitle: 'Street Photography Collection',
      metaDescription: 'Candid moments captured in urban environments'
    },
    isActive: true,
    slug: 'street-life'
  },

  // Collection 5: Landscape Vistas
  {
    name: 'Natural Landscapes',
    description: 'Breathtaking views of nature and outdoor scenery',
    coverImage: '/filler/DUO_3.4.jpeg',
    category: 'Landscape',
    images: [
      createImage(1, '/filler/DUO_3.4.jpeg', ['landscape', 'day', 'outdoor', 'nature', 'warm-tones', 'wide-angle'], 0),
      createImage(2, '/filler/DUO_3.5.jpeg', ['landscape', 'day', 'outdoor', 'scenic', 'cool-tones', 'wide-angle'], 1),
      createImage(3, '/filler/DUO_3.6.jpeg', ['landscape', 'day', 'outdoor', 'nature', 'mixed-tones', 'wide-angle'], 2),
      createImage(4, '/filler/DUO_3.7.jpeg', ['landscape', 'day', 'outdoor', 'scenic', 'warm-tones', 'wide-angle'], 3),
      createImage(5, '/filler/DUO_3.8.jpeg', ['landscape', 'day', 'outdoor', 'nature', 'cool-tones', 'wide-angle'], 4),
      createImage(6, '/filler/DUO_3.9.jpeg', ['landscape', 'day', 'outdoor', 'scenic', 'mixed-tones', 'wide-angle'], 5),
      createImage(7, '/filler/DUO_4.0.jpeg', ['landscape', 'day', 'outdoor', 'nature', 'warm-tones', 'wide-angle'], 6),
      createImage(8, '/filler/DUO_4.1.jpeg', ['landscape', 'day', 'outdoor', 'scenic', 'cool-tones', 'wide-angle'], 7),
      createImage(9, '/filler/DUO_4.2.jpeg', ['landscape', 'day', 'outdoor', 'nature', 'mixed-tones', 'wide-angle'], 8),
    ],
    isPublic: true,
    sortOrder: 5,
    seo: {
      keywords: ['landscape', 'nature', 'scenic', 'photography'],
      metaTitle: 'Landscape Photography Collection',
      metaDescription: 'Breathtaking views of nature and outdoor scenery'
    },
    isActive: true,
    slug: 'natural-landscapes'
  },

  // Collection 6: Architecture & Buildings
  {
    name: 'Architectural Forms',
    description: 'Modern and classic architecture from unique perspectives',
    coverImage: '/filler/DUO_4.3.jpeg',
    category: 'Architecture',
    images: [
      createImage(1, '/filler/DUO_4.3.jpeg', ['architecture', 'day', 'outdoor', 'building', 'cool-tones', 'wide-angle'], 0),
      createImage(2, '/filler/DUO_4.4.jpeg', ['architecture', 'day', 'outdoor', 'structure', 'warm-tones', 'standard'], 1),
      createImage(3, '/filler/DUO_4.5.jpeg', ['architecture', 'day', 'outdoor', 'building', 'mixed-tones', 'wide-angle'], 2),
      createImage(4, '/filler/DUO_4.6.jpeg', ['architecture', 'day', 'outdoor', 'geometric', 'cool-tones', 'standard'], 3),
      createImage(5, '/filler/DUO_4.7.jpeg', ['architecture', 'day', 'outdoor', 'building', 'warm-tones', 'wide-angle'], 4),
      createImage(6, '/filler/DUO_4.8.jpeg', ['architecture', 'day', 'outdoor', 'structure', 'mixed-tones', 'standard'], 5),
      createImage(7, '/filler/DUO_4.9.jpeg', ['architecture', 'day', 'outdoor', 'building', 'cool-tones', 'wide-angle'], 6),
      createImage(8, '/filler/DUO_5.0.jpeg', ['architecture', 'night', 'outdoor', 'geometric', 'warm-tones', 'standard'], 7),
      createImage(9, '/filler/DUO_5.1.jpeg', ['architecture', 'night', 'outdoor', 'building', 'cool-tones', 'wide-angle'], 8),
      createImage(10, '/filler/DUO_5.2.jpeg', ['architecture', 'night', 'outdoor', 'structure', 'mixed-tones', 'standard'], 9),
      createImage(11, '/filler/DUO_5.3.jpeg', ['architecture', 'day', 'outdoor', 'building', 'warm-tones', 'wide-angle'], 10),
    ],
    isPublic: true,
    sortOrder: 6,
    seo: {
      keywords: ['architecture', 'building', 'structure', 'photography'],
      metaTitle: 'Architecture Photography Collection',
      metaDescription: 'Modern and classic architecture from unique perspectives'
    },
    isActive: true,
    slug: 'architectural-forms'
  },

  // Collection 7: Fashion & Style
  {
    name: 'Fashion Forward',
    description: 'Contemporary fashion photography and style documentation',
    coverImage: '/filler/DUO_5.4.jpeg',
    category: 'Fashion',
    images: [
      createImage(1, '/filler/DUO_5.4.jpeg', ['fashion', 'day', 'indoor', 'model-female', 'warm-tones', 'portrait'], 0),
      createImage(2, '/filler/DUO_5.5.jpeg', ['fashion', 'day', 'indoor', 'model-male', 'cool-tones', 'standard'], 1),
      createImage(3, '/filler/DUO_5.6.jpeg', ['fashion', 'day', 'outdoor', 'model-female', 'mixed-tones', 'portrait'], 2),
      createImage(4, '/filler/DUO_5.7.jpeg', ['fashion', 'day', 'indoor', 'model-male', 'warm-tones', 'standard'], 3),
      createImage(5, '/filler/DUO_5.8.jpeg', ['fashion', 'day', 'outdoor', 'model-female', 'cool-tones', 'portrait'], 4),
      createImage(6, '/filler/DUO_5.9.jpeg', ['fashion', 'day', 'indoor', 'model-male', 'mixed-tones', 'standard'], 5),
      createImage(7, '/filler/DUO_6.0.jpeg', ['fashion', 'day', 'outdoor', 'model-female', 'warm-tones', 'portrait'], 6),
      createImage(8, '/filler/DUO_6.1.jpeg', ['fashion', 'day', 'indoor', 'model-male', 'cool-tones', 'standard'], 7),
      createImage(9, '/filler/DUO_6.2.jpeg', ['fashion', 'day', 'outdoor', 'model-female', 'mixed-tones', 'portrait'], 8),
      createImage(10, '/filler/DUO_6.3.jpeg', ['fashion', 'day', 'indoor', 'model-male', 'warm-tones', 'standard'], 9),
      createImage(11, '/filler/DUO_6.4.jpeg', ['fashion', 'day', 'outdoor', 'model-female', 'cool-tones', 'portrait'], 10),
      createImage(12, '/filler/DUO_6.5.jpeg', ['fashion', 'day', 'indoor', 'model-male', 'mixed-tones', 'standard'], 11),
    ],
    isPublic: true,
    sortOrder: 7,
    seo: {
      keywords: ['fashion', 'style', 'model', 'photography'],
      metaTitle: 'Fashion Photography Collection',
      metaDescription: 'Contemporary fashion photography and style documentation'
    },
    isActive: true,
    slug: 'fashion-forward'
  },

  // Collection 8: Black & White Classics
  {
    name: 'Monochrome Moments',
    description: 'Timeless black and white photography',
    coverImage: '/filler/DETAILS_1.5.jpg',
    category: 'Black & White',
    images: [
      createImage(1, '/filler/DETAILS_1.5.jpg', ['black-white', 'day', 'outdoor', 'landscape', 'monochrome', 'wide-angle'], 0),
      createImage(2, '/filler/DETAILS_1.7.jpg', ['black-white', 'day', 'outdoor', 'portrait', 'monochrome', 'standard'], 1),
      createImage(3, '/filler/DETAILS_1.9.jpg', ['black-white', 'day', 'indoor', 'detail', 'monochrome', 'macro'], 2),
      createImage(4, '/filler/DETAILS_2.1.jpg', ['black-white', 'day', 'outdoor', 'street', 'monochrome', 'standard'], 3),
      createImage(5, '/filler/DUO_1.3.jpg', ['black-white', 'day', 'indoor', 'portrait', 'monochrome', 'close-up'], 4),
      createImage(6, '/filler/DUO_1.9.jpg', ['black-white', 'day', 'outdoor', 'landscape', 'monochrome', 'wide-angle'], 5),
      createImage(7, '/filler/DUO_2.2.jpg', ['black-white', 'day', 'outdoor', 'street', 'monochrome', 'standard'], 6),
      createImage(8, '/filler/DUO_3.2.jpg', ['black-white', 'day', 'indoor', 'detail', 'monochrome', 'macro'], 7),
      createImage(9, '/filler/DUO_3.4.jpg', ['black-white', 'day', 'outdoor', 'portrait', 'monochrome', 'standard'], 8),
      createImage(10, '/filler/DUO_3.7.jpg', ['black-white', 'day', 'outdoor', 'landscape', 'monochrome', 'wide-angle'], 9),
      createImage(11, '/filler/DUO_3.9.jpg', ['black-white', 'day', 'indoor', 'street', 'monochrome', 'standard'], 10),
      createImage(12, '/filler/DUO_4.0.jpg', ['black-white', 'day', 'outdoor', 'detail', 'monochrome', 'macro'], 11),
    ],
    isPublic: true,
    sortOrder: 8,
    seo: {
      keywords: ['black-white', 'monochrome', 'classic', 'photography'],
      metaTitle: 'Black & White Photography Collection',
      metaDescription: 'Timeless black and white photography'
    },
    isActive: true,
    slug: 'monochrome-moments'
  },

  // Collection 9: Documentary Series
  {
    name: 'Real Stories',
    description: 'Documentary photography capturing authentic moments',
    coverImage: '/filler/BTC_1.6.jpeg',
    category: 'Documentary',
    images: [
      createImage(1, '/filler/BTC_1.6.jpeg', ['documentary', 'day', 'outdoor', 'people', 'warm-tones', 'standard'], 0),
      createImage(2, '/filler/BTC_1.7.jpeg', ['documentary', 'day', 'outdoor', 'street', 'cool-tones', 'wide-angle'], 1),
      createImage(3, '/filler/BTC_1.8.jpeg', ['documentary', 'day', 'indoor', 'people', 'mixed-tones', 'standard'], 2),
      createImage(4, '/filler/BTC_1.9.jpeg', ['documentary', 'day', 'outdoor', 'street', 'warm-tones', 'wide-angle'], 3),
      createImage(5, '/filler/BTC_2.0.jpeg', ['documentary', 'day', 'indoor', 'people', 'cool-tones', 'standard'], 4),
      createImage(6, '/filler/DUO_2.0.jpeg', ['documentary', 'day', 'outdoor', 'street', 'mixed-tones', 'wide-angle'], 5),
      createImage(7, '/filler/DUO_2.1.jpeg', ['documentary', 'day', 'outdoor', 'people', 'warm-tones', 'standard'], 6),
      createImage(8, '/filler/DUO_2.2.jpeg', ['documentary', 'day', 'indoor', 'street', 'cool-tones', 'standard'], 7),
      createImage(9, '/filler/DUO_2.3.jpeg', ['documentary', 'day', 'outdoor', 'people', 'mixed-tones', 'portrait'], 8),
      createImage(10, '/filler/DUO_2.4.jpeg', ['documentary', 'day', 'outdoor', 'street', 'warm-tones', 'standard'], 9),
      createImage(11, '/filler/DUO_2.5.jpeg', ['documentary', 'day', 'indoor', 'people', 'cool-tones', 'standard'], 10),
      createImage(12, '/filler/DUO_2.6.jpeg', ['documentary', 'day', 'outdoor', 'street', 'mixed-tones', 'wide-angle'], 11),
      createImage(13, '/filler/DUO_2.7.jpeg', ['documentary', 'day', 'outdoor', 'people', 'warm-tones', 'portrait'], 12),
      createImage(14, '/filler/DUO_2.8.jpeg', ['documentary', 'day', 'indoor', 'street', 'cool-tones', 'standard'], 13),
      createImage(15, '/filler/DUO_2.9.jpeg', ['documentary', 'day', 'outdoor', 'people', 'mixed-tones', 'standard'], 14),
    ],
    isPublic: true,
    sortOrder: 9,
    seo: {
      keywords: ['documentary', 'storytelling', 'authentic', 'photography'],
      metaTitle: 'Documentary Photography Collection',
      metaDescription: 'Documentary photography capturing authentic moments'
    },
    isActive: true,
    slug: 'real-stories'
  },

  // Collection 10: Abstract Art
  {
    name: 'Abstract Visions',
    description: 'Creative abstract photography and experimental compositions',
    coverImage: '/filler/DETAILS_2.0.jpeg',
    category: 'Abstract',
    images: [
      createImage(1, '/filler/DETAILS_2.0.jpeg', ['abstract', 'day', 'indoor', 'texture', 'warm-tones', 'macro'], 0),
      createImage(2, '/filler/DETAILS_2.1.jpeg', ['abstract', 'day', 'outdoor', 'pattern', 'cool-tones', 'macro'], 1),
      createImage(3, '/filler/DETAILS_2.2.jpeg', ['abstract', 'day', 'indoor', 'texture', 'mixed-tones', 'macro'], 2),
      createImage(4, '/filler/DETAILS_1.0.jpeg', ['abstract', 'day', 'outdoor', 'pattern', 'warm-tones', 'macro'], 3),
      createImage(5, '/filler/DETAILS_1.1.jpeg', ['abstract', 'day', 'indoor', 'texture', 'cool-tones', 'macro'], 4),
      createImage(6, '/filler/DETAILS_1.2.jpeg', ['abstract', 'day', 'outdoor', 'pattern', 'mixed-tones', 'macro'], 5),
      createImage(7, '/filler/DETAILS_1.3.jpeg', ['abstract', 'day', 'indoor', 'texture', 'warm-tones', 'macro'], 6),
      createImage(8, '/filler/DETAILS_1.4.jpeg', ['abstract', 'day', 'outdoor', 'pattern', 'cool-tones', 'macro'], 7),
    ],
    isPublic: true,
    sortOrder: 10,
    seo: {
      keywords: ['abstract', 'experimental', 'creative', 'photography'],
      metaTitle: 'Abstract Photography Collection',
      metaDescription: 'Creative abstract photography and experimental compositions'
    },
    isActive: true,
    slug: 'abstract-visions'
  },

  // Collection 11: Golden Hour
  {
    name: 'Golden Hour Magic',
    description: 'Photography captured during the magical golden hour',
    coverImage: '/filler/DUO_3.4.jpeg',
    category: 'Landscape',
    images: [
      createImage(1, '/filler/DUO_3.4.jpeg', ['golden-hour', 'day', 'outdoor', 'landscape', 'warm-tones', 'wide-angle'], 0),
      createImage(2, '/filler/DUO_3.5.jpeg', ['golden-hour', 'day', 'outdoor', 'portrait', 'warm-tones', 'standard'], 1),
      createImage(3, '/filler/DUO_3.6.jpeg', ['golden-hour', 'day', 'outdoor', 'landscape', 'warm-tones', 'wide-angle'], 2),
      createImage(4, '/filler/DUO_3.7.jpeg', ['golden-hour', 'day', 'outdoor', 'portrait', 'warm-tones', 'standard'], 3),
      createImage(5, '/filler/DUO_3.8.jpeg', ['golden-hour', 'day', 'outdoor', 'landscape', 'warm-tones', 'wide-angle'], 4),
      createImage(6, '/filler/DUO_3.9.jpeg', ['golden-hour', 'day', 'outdoor', 'portrait', 'warm-tones', 'standard'], 5),
      createImage(7, '/filler/DUO_4.0.jpeg', ['golden-hour', 'day', 'outdoor', 'landscape', 'warm-tones', 'wide-angle'], 6),
      createImage(8, '/filler/DUO_4.1.jpeg', ['golden-hour', 'day', 'outdoor', 'portrait', 'warm-tones', 'standard'], 7),
      createImage(9, '/filler/DUO_4.2.jpeg', ['golden-hour', 'day', 'outdoor', 'landscape', 'warm-tones', 'wide-angle'], 8),
      createImage(10, '/filler/DUO_4.3.jpeg', ['golden-hour', 'day', 'outdoor', 'portrait', 'warm-tones', 'standard'], 9),
    ],
    isPublic: true,
    sortOrder: 11,
    seo: {
      keywords: ['golden-hour', 'sunset', 'warm-light', 'photography'],
      metaTitle: 'Golden Hour Photography Collection',
      metaDescription: 'Photography captured during the magical golden hour'
    },
    isActive: true,
    slug: 'golden-hour-magic'
  },

  // Collection 12: Indoor Scenes
  {
    name: 'Interior Spaces',
    description: 'Capturing the beauty of indoor environments and interiors',
    coverImage: '/filler/DUO_1.0.jpeg',
    category: 'Interior',
    images: [
      createImage(1, '/filler/DUO_1.0.jpeg', ['interior', 'day', 'indoor', 'design', 'warm-tones', 'wide-angle'], 0),
      createImage(2, '/filler/DUO_1.1.jpeg', ['interior', 'day', 'indoor', 'architecture', 'cool-tones', 'wide-angle'], 1),
      createImage(3, '/filler/DUO_1.2.jpeg', ['interior', 'day', 'indoor', 'design', 'mixed-tones', 'standard'], 2),
      createImage(4, '/filler/DUO_1.4.jpeg', ['interior', 'day', 'indoor', 'architecture', 'warm-tones', 'wide-angle'], 3),
      createImage(5, '/filler/DUO_1.5.jpeg', ['interior', 'day', 'indoor', 'design', 'cool-tones', 'standard'], 4),
      createImage(6, '/filler/DUO_1.6.jpeg', ['interior', 'day', 'indoor', 'architecture', 'mixed-tones', 'wide-angle'], 5),
      createImage(7, '/filler/DUO_1.7.jpeg', ['interior', 'day', 'indoor', 'design', 'warm-tones', 'standard'], 6),
      createImage(8, '/filler/DUO_1.8.jpeg', ['interior', 'day', 'indoor', 'architecture', 'cool-tones', 'wide-angle'], 7),
      createImage(9, '/filler/DUO_1.9.jpeg', ['interior', 'day', 'indoor', 'design', 'mixed-tones', 'standard'], 8),
      createImage(10, '/filler/DETAILS_1.0.jpeg', ['interior', 'day', 'indoor', 'detail', 'warm-tones', 'macro'], 9),
      createImage(11, '/filler/DETAILS_1.1.jpeg', ['interior', 'day', 'indoor', 'texture', 'cool-tones', 'macro'], 10),
      createImage(12, '/filler/DETAILS_1.2.jpeg', ['interior', 'day', 'indoor', 'detail', 'mixed-tones', 'macro'], 11),
      createImage(13, '/filler/DETAILS_1.3.jpeg', ['interior', 'day', 'indoor', 'texture', 'warm-tones', 'macro'], 12),
      createImage(14, '/filler/DETAILS_1.4.jpeg', ['interior', 'day', 'indoor', 'detail', 'cool-tones', 'macro'], 13),
      createImage(15, '/filler/DETAILS_1.5.jpeg', ['interior', 'day', 'indoor', 'texture', 'mixed-tones', 'macro'], 14),
      createImage(16, '/filler/DETAILS_1.6.jpeg', ['interior', 'day', 'indoor', 'detail', 'warm-tones', 'macro'], 15),
      createImage(17, '/filler/DETAILS_1.7.jpeg', ['interior', 'day', 'indoor', 'texture', 'cool-tones', 'macro'], 16),
      createImage(18, '/filler/DETAILS_1.8.jpeg', ['interior', 'day', 'indoor', 'detail', 'mixed-tones', 'macro'], 17),
      createImage(19, '/filler/DETAILS_1.9.jpeg', ['interior', 'day', 'indoor', 'texture', 'warm-tones', 'macro'], 18),
      createImage(20, '/filler/DETAILS_2.0.jpeg', ['interior', 'day', 'indoor', 'detail', 'cool-tones', 'macro'], 19),
    ],
    isPublic: true,
    sortOrder: 12,
    seo: {
      keywords: ['interior', 'indoor', 'architecture', 'photography'],
      metaTitle: 'Interior Photography Collection',
      metaDescription: 'Capturing the beauty of indoor environments and interiors'
    },
    isActive: true,
    slug: 'interior-spaces'
  },

  // Collection 13: Outdoor Adventures
  {
    name: 'Wild & Free',
    description: 'Outdoor adventure and nature photography',
    coverImage: '/filler/DUO_4.4.jpeg',
    category: 'Adventure',
    images: [
      createImage(1, '/filler/DUO_4.4.jpeg', ['adventure', 'day', 'outdoor', 'nature', 'warm-tones', 'wide-angle'], 0),
      createImage(2, '/filler/DUO_4.5.jpeg', ['adventure', 'day', 'outdoor', 'landscape', 'cool-tones', 'wide-angle'], 1),
      createImage(3, '/filler/DUO_4.6.jpeg', ['adventure', 'day', 'outdoor', 'nature', 'mixed-tones', 'standard'], 2),
      createImage(4, '/filler/DUO_4.7.jpeg', ['adventure', 'day', 'outdoor', 'landscape', 'warm-tones', 'wide-angle'], 3),
      createImage(5, '/filler/DUO_4.8.jpeg', ['adventure', 'day', 'outdoor', 'nature', 'cool-tones', 'standard'], 4),
      createImage(6, '/filler/DUO_4.9.jpeg', ['adventure', 'day', 'outdoor', 'landscape', 'mixed-tones', 'wide-angle'], 5),
      createImage(7, '/filler/DUO_5.0.jpeg', ['adventure', 'day', 'outdoor', 'nature', 'warm-tones', 'standard'], 6),
      createImage(8, '/filler/DUO_5.1.jpeg', ['adventure', 'day', 'outdoor', 'landscape', 'cool-tones', 'wide-angle'], 7),
      createImage(9, '/filler/DUO_5.2.jpeg', ['adventure', 'day', 'outdoor', 'nature', 'mixed-tones', 'standard'], 8),
      createImage(10, '/filler/DUO_5.3.jpeg', ['adventure', 'day', 'outdoor', 'landscape', 'warm-tones', 'wide-angle'], 9),
      createImage(11, '/filler/DUO_5.4.jpeg', ['adventure', 'day', 'outdoor', 'nature', 'cool-tones', 'standard'], 10),
    ],
    isPublic: true,
    sortOrder: 13,
    seo: {
      keywords: ['adventure', 'outdoor', 'nature', 'photography'],
      metaTitle: 'Adventure Photography Collection',
      metaDescription: 'Outdoor adventure and nature photography'
    },
    isActive: true,
    slug: 'wild-and-free'
  },

  // Collection 14: Minimalist Compositions
  {
    name: 'Less is More',
    description: 'Minimalist photography emphasizing simplicity and space',
    coverImage: '/filler/DETAILS_2.2.jpeg',
    category: 'Minimalist',
    images: [
      createImage(1, '/filler/DETAILS_2.2.jpeg', ['minimalist', 'day', 'indoor', 'simple', 'cool-tones', 'standard'], 0),
      createImage(2, '/filler/DETAILS_2.1.jpeg', ['minimalist', 'day', 'outdoor', 'clean', 'warm-tones', 'standard'], 1),
      createImage(3, '/filler/DETAILS_2.0.jpeg', ['minimalist', 'day', 'indoor', 'simple', 'mixed-tones', 'standard'], 2),
      createImage(4, '/filler/DETAILS_1.9.jpeg', ['minimalist', 'day', 'outdoor', 'clean', 'cool-tones', 'standard'], 3),
      createImage(5, '/filler/DETAILS_1.8.jpeg', ['minimalist', 'day', 'indoor', 'simple', 'warm-tones', 'standard'], 4),
      createImage(6, '/filler/DETAILS_1.7.jpeg', ['minimalist', 'day', 'outdoor', 'clean', 'mixed-tones', 'standard'], 5),
      createImage(7, '/filler/DETAILS_1.6.jpeg', ['minimalist', 'day', 'indoor', 'simple', 'cool-tones', 'standard'], 6),
      createImage(8, '/filler/DETAILS_1.5.jpeg', ['minimalist', 'day', 'outdoor', 'clean', 'warm-tones', 'standard'], 7),
      createImage(9, '/filler/DETAILS_1.4.jpeg', ['minimalist', 'day', 'indoor', 'simple', 'mixed-tones', 'standard'], 8),
      createImage(10, '/filler/DETAILS_1.3.jpeg', ['minimalist', 'day', 'outdoor', 'clean', 'cool-tones', 'standard'], 9),
      createImage(11, '/filler/DETAILS_1.2.jpeg', ['minimalist', 'day', 'indoor', 'simple', 'warm-tones', 'standard'], 10),
      createImage(12, '/filler/DETAILS_1.1.jpeg', ['minimalist', 'day', 'outdoor', 'clean', 'mixed-tones', 'standard'], 11),
      createImage(13, '/filler/DETAILS_1.0.jpeg', ['minimalist', 'day', 'indoor', 'simple', 'cool-tones', 'standard'], 12),
    ],
    isPublic: true,
    sortOrder: 14,
    seo: {
      keywords: ['minimalist', 'simple', 'clean', 'photography'],
      metaTitle: 'Minimalist Photography Collection',
      metaDescription: 'Minimalist photography emphasizing simplicity and space'
    },
    isActive: true,
    slug: 'less-is-more'
  },

  // Collection 15: Vibrant Colors
  {
    name: 'Color Explosion',
    description: 'Bold and vibrant color photography',
    coverImage: '/filler/DUO_5.5.jpeg',
    category: 'Color',
    images: [
      createImage(1, '/filler/DUO_5.5.jpeg', ['colorful', 'day', 'outdoor', 'vibrant', 'warm-tones', 'standard'], 0),
      createImage(2, '/filler/DUO_5.6.jpeg', ['colorful', 'day', 'outdoor', 'bold', 'cool-tones', 'standard'], 1),
      createImage(3, '/filler/DUO_5.7.jpeg', ['colorful', 'day', 'outdoor', 'vibrant', 'mixed-tones', 'standard'], 2),
      createImage(4, '/filler/DUO_5.8.jpeg', ['colorful', 'day', 'outdoor', 'bold', 'warm-tones', 'standard'], 3),
      createImage(5, '/filler/DUO_5.9.jpeg', ['colorful', 'day', 'outdoor', 'vibrant', 'cool-tones', 'standard'], 4),
      createImage(6, '/filler/DUO_6.0.jpeg', ['colorful', 'day', 'outdoor', 'bold', 'mixed-tones', 'standard'], 5),
      createImage(7, '/filler/DUO_6.1.jpeg', ['colorful', 'day', 'outdoor', 'vibrant', 'warm-tones', 'standard'], 6),
      createImage(8, '/filler/DUO_6.2.jpeg', ['colorful', 'day', 'outdoor', 'bold', 'cool-tones', 'standard'], 7),
      createImage(9, '/filler/DUO_6.3.jpeg', ['colorful', 'day', 'outdoor', 'vibrant', 'mixed-tones', 'standard'], 8),
      createImage(10, '/filler/DUO_6.4.jpeg', ['colorful', 'day', 'outdoor', 'bold', 'warm-tones', 'standard'], 9),
      createImage(11, '/filler/DUO_6.5.jpeg', ['colorful', 'day', 'outdoor', 'vibrant', 'cool-tones', 'standard'], 10),
      createImage(12, '/filler/DUO_4.0.jpeg', ['colorful', 'day', 'outdoor', 'bold', 'mixed-tones', 'standard'], 11),
      createImage(13, '/filler/DUO_4.1.jpeg', ['colorful', 'day', 'outdoor', 'vibrant', 'warm-tones', 'standard'], 12),
      createImage(14, '/filler/DUO_4.2.jpeg', ['colorful', 'day', 'outdoor', 'bold', 'cool-tones', 'standard'], 13),
    ],
    isPublic: true,
    sortOrder: 15,
    seo: {
      keywords: ['colorful', 'vibrant', 'bold', 'photography'],
      metaTitle: 'Vibrant Color Photography Collection',
      metaDescription: 'Bold and vibrant color photography'
    },
    isActive: true,
    slug: 'color-explosion'
  },

  // Collection 16: Candid Moments
  {
    name: 'Unposed Reality',
    description: 'Authentic candid photography capturing real moments',
    coverImage: '/filler/DUO_2.6.jpeg',
    category: 'Candid',
    images: [
      createImage(1, '/filler/DUO_2.6.jpeg', ['candid', 'day', 'outdoor', 'people', 'warm-tones', 'standard'], 0),
      createImage(2, '/filler/DUO_2.7.jpeg', ['candid', 'day', 'outdoor', 'street', 'cool-tones', 'standard'], 1),
      createImage(3, '/filler/DUO_2.8.jpeg', ['candid', 'day', 'outdoor', 'people', 'mixed-tones', 'standard'], 2),
      createImage(4, '/filler/DUO_2.9.jpeg', ['candid', 'day', 'outdoor', 'street', 'warm-tones', 'standard'], 3),
      createImage(5, '/filler/DUO_3.0.jpeg', ['candid', 'day', 'outdoor', 'people', 'cool-tones', 'standard'], 4),
      createImage(6, '/filler/DUO_3.1.jpeg', ['candid', 'day', 'outdoor', 'street', 'mixed-tones', 'standard'], 5),
      createImage(7, '/filler/DUO_3.2.jpeg', ['candid', 'day', 'outdoor', 'people', 'warm-tones', 'standard'], 6),
      createImage(8, '/filler/DUO_3.3.jpeg', ['candid', 'day', 'outdoor', 'street', 'cool-tones', 'standard'], 7),
      createImage(9, '/filler/BTC_1.6.jpeg', ['candid', 'day', 'outdoor', 'people', 'mixed-tones', 'standard'], 8),
      createImage(10, '/filler/BTC_1.7.jpeg', ['candid', 'day', 'outdoor', 'street', 'warm-tones', 'standard'], 9),
      createImage(11, '/filler/BTC_1.8.jpeg', ['candid', 'day', 'outdoor', 'people', 'cool-tones', 'standard'], 10),
      createImage(12, '/filler/BTC_1.9.jpeg', ['candid', 'day', 'outdoor', 'street', 'mixed-tones', 'standard'], 11),
      createImage(13, '/filler/BTC_2.0.jpeg', ['candid', 'day', 'outdoor', 'people', 'warm-tones', 'standard'], 12),
      createImage(14, '/filler/DUO_1.0.jpeg', ['candid', 'day', 'indoor', 'people', 'cool-tones', 'standard'], 13),
      createImage(15, '/filler/DUO_1.1.jpeg', ['candid', 'day', 'indoor', 'people', 'mixed-tones', 'standard'], 14),
    ],
    isPublic: true,
    sortOrder: 16,
    seo: {
      keywords: ['candid', 'authentic', 'real', 'photography'],
      metaTitle: 'Candid Photography Collection',
      metaDescription: 'Authentic candid photography capturing real moments'
    },
    isActive: true,
    slug: 'unposed-reality'
  },

  // Collection 17: Experimental Techniques
  {
    name: 'Creative Experiments',
    description: 'Experimental photography pushing creative boundaries',
    coverImage: '/filler/DETAILS_1.8.jpeg',
    category: 'Experimental',
    images: [
      createImage(1, '/filler/DETAILS_1.8.jpeg', ['experimental', 'day', 'indoor', 'abstract', 'mixed-tones', 'macro'], 0),
      createImage(2, '/filler/DETAILS_1.9.jpeg', ['experimental', 'day', 'outdoor', 'creative', 'warm-tones', 'macro'], 1),
      createImage(3, '/filler/DETAILS_2.0.jpeg', ['experimental', 'day', 'indoor', 'abstract', 'cool-tones', 'macro'], 2),
      createImage(4, '/filler/DETAILS_2.1.jpeg', ['experimental', 'day', 'outdoor', 'creative', 'mixed-tones', 'macro'], 3),
      createImage(5, '/filler/DETAILS_2.2.jpeg', ['experimental', 'day', 'indoor', 'abstract', 'warm-tones', 'macro'], 4),
      createImage(6, '/filler/DETAILS_1.0.jpeg', ['experimental', 'day', 'outdoor', 'creative', 'cool-tones', 'macro'], 5),
      createImage(7, '/filler/DETAILS_1.1.jpeg', ['experimental', 'day', 'indoor', 'abstract', 'mixed-tones', 'macro'], 6),
      createImage(8, '/filler/DETAILS_1.2.jpeg', ['experimental', 'day', 'outdoor', 'creative', 'warm-tones', 'macro'], 7),
      createImage(9, '/filler/DETAILS_1.3.jpeg', ['experimental', 'day', 'indoor', 'abstract', 'cool-tones', 'macro'], 8),
      createImage(10, '/filler/DETAILS_1.4.jpeg', ['experimental', 'day', 'outdoor', 'creative', 'mixed-tones', 'macro'], 9),
      createImage(11, '/filler/DETAILS_1.5.jpeg', ['experimental', 'day', 'indoor', 'abstract', 'warm-tones', 'macro'], 10),
      createImage(12, '/filler/DETAILS_1.6.jpeg', ['experimental', 'day', 'outdoor', 'creative', 'cool-tones', 'macro'], 11),
      createImage(13, '/filler/DETAILS_1.7.jpeg', ['experimental', 'day', 'indoor', 'abstract', 'mixed-tones', 'macro'], 12),
      createImage(14, '/filler/DUO_6.0.jpeg', ['experimental', 'day', 'outdoor', 'creative', 'warm-tones', 'standard'], 13),
      createImage(15, '/filler/DUO_6.1.jpeg', ['experimental', 'day', 'indoor', 'abstract', 'cool-tones', 'standard'], 14),
      createImage(16, '/filler/DUO_6.2.jpeg', ['experimental', 'day', 'outdoor', 'creative', 'mixed-tones', 'standard'], 15),
      createImage(17, '/filler/DUO_6.3.jpeg', ['experimental', 'day', 'indoor', 'abstract', 'warm-tones', 'standard'], 16),
      createImage(18, '/filler/DUO_6.4.jpeg', ['experimental', 'day', 'outdoor', 'creative', 'cool-tones', 'standard'], 17),
      createImage(19, '/filler/DUO_6.5.jpeg', ['experimental', 'day', 'indoor', 'abstract', 'mixed-tones', 'standard'], 18),
    ],
    isPublic: true,
    sortOrder: 17,
    seo: {
      keywords: ['experimental', 'creative', 'artistic', 'photography'],
      metaTitle: 'Experimental Photography Collection',
      metaDescription: 'Experimental photography pushing creative boundaries'
    },
    isActive: true,
    slug: 'creative-experiments'
  },
]