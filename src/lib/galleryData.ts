export interface GalleryItem {
  id: string
  title: string
  category: string
  coverImage: string
  images: string[]
  description?: string
}

// Sample gallery collections
const defaultGalleryCollections: GalleryItem[] = [
  {
    id: 'btc-series',
    title: 'BTC Series',
    category: 'Cryptocurrency',
    coverImage: '/filler/BTC_1.6.jpeg',
    images: [
      '/filler/BTC_1.6.jpeg',
      '/filler/BTC_1.7.jpeg',
      '/filler/BTC_1.8.jpeg',
      '/filler/BTC_1.9.jpeg',
      '/filler/BTC_2.0.jpeg'
    ],
    description: 'A collection exploring the visual representation of cryptocurrency culture and digital finance.'
  },
  {
    id: 'details-collection',
    title: 'Details Collection',
    category: 'Macro',
    coverImage: '/filler/DETAILS_1.0.jpeg',
    images: [
      '/filler/DETAILS_1.0.jpeg',
      '/filler/DETAILS_1.1.jpeg',
      '/filler/DETAILS_1.2.jpeg',
      '/filler/DETAILS_1.3.jpeg',
      '/filler/DETAILS_1.4.jpeg',
      '/filler/DETAILS_1.5.jpeg',
      '/filler/DETAILS_1.6.jpeg',
      '/filler/DETAILS_1.7.jpeg',
      '/filler/DETAILS_1.8.jpeg',
      '/filler/DETAILS_1.9.jpeg',
      '/filler/DETAILS_2.0.jpeg',
      '/filler/DETAILS_2.1.jpeg'
    ],
    description: 'Intimate close-up photography revealing the hidden beauty in everyday objects and textures.'
  },
  {
    id: 'duo-portraits',
    title: 'Duo Portraits',
    category: 'Portrait',
    coverImage: '/filler/DUO_1.0.jpeg',
    images: [
      '/filler/DUO_1.0.jpeg',
      '/filler/DUO_1.1.jpeg',
      '/filler/DUO_1.2.jpeg',
      '/filler/DUO_1.3.jpg',
      '/filler/DUO_1.4.jpeg',
      '/filler/DUO_1.5.jpeg',
      '/filler/DUO_1.6.jpeg',
      '/filler/DUO_1.7.jpeg',
      '/filler/DUO_1.8.jpeg',
      '/filler/DUO_1.9.jpeg',
      '/filler/DUO_2.0.jpeg',
      '/filler/DUO_2.1.jpeg',
      '/filler/DUO_2.2.jpeg',
      '/filler/DUO_2.3.jpeg',
      '/filler/DUO_2.4.jpeg',
      '/filler/DUO_2.5.jpeg',
      '/filler/DUO_2.6.jpeg',
      '/filler/DUO_2.7.jpeg',
      '/filler/DUO_2.8.jpeg',
      '/filler/DUO_2.9.jpeg',
      '/filler/DUO_3.0.jpeg'
    ],
    description: 'A series of portrait photography capturing human connections and individual expressions.'
  },
  {
    id: 'urban-landscapes',
    title: 'Urban Landscapes',
    category: 'Street',
    coverImage: '/filler/DUO_3.1.jpeg',
    images: [
      '/filler/DUO_3.1.jpeg',
      '/filler/DUO_3.2.jpeg',
      '/filler/DUO_3.3.jpeg',
      '/filler/DUO_3.4.jpeg',
      '/filler/DUO_3.5.jpeg',
      '/filler/DUO_3.6.jpeg',
      '/filler/DUO_3.7.jpeg',
      '/filler/DUO_3.8.jpeg',
      '/filler/DUO_3.9.jpeg',
      '/filler/DUO_4.0.jpeg'
    ],
    description: 'Exploring the intersection of architecture, light, and human activity in urban environments.'
  },
  {
    id: 'architectural-studies',
    title: 'Architectural Studies',
    category: 'Architecture',
    coverImage: '/filler/DUO_4.1.jpeg',
    images: [
      '/filler/DUO_4.1.jpeg',
      '/filler/DUO_4.2.jpeg',
      '/filler/DUO_4.3.jpeg',
      '/filler/DUO_4.4.jpeg',
      '/filler/DUO_4.5.jpeg',
      '/filler/DUO_4.6.jpeg',
      '/filler/DUO_4.7.jpeg',
      '/filler/DUO_4.8.jpeg',
      '/filler/DUO_4.9.jpeg',
      '/filler/DUO_5.0.jpeg'
    ],
    description: 'Geometric compositions and structural details that celebrate modern architectural design.'
  },
  {
    id: 'night-series',
    title: 'Night Series',
    category: 'Night',
    coverImage: '/filler/DUO_5.1.jpeg',
    images: [
      '/filler/DUO_5.1.jpeg',
      '/filler/DUO_5.2.jpeg',
      '/filler/DUO_5.3.jpeg',
      '/filler/DUO_5.4.jpeg',
      '/filler/DUO_5.5.jpeg',
      '/filler/DUO_5.6.jpeg',
      '/filler/DUO_5.7.jpeg',
      '/filler/DUO_5.8.jpeg',
      '/filler/DUO_5.9.jpeg',
      '/filler/DUO_6.0.jpeg'
    ],
    description: 'Capturing the mystery and beauty of urban environments after dark.'
  },
  {
    id: 'experimental-series',
    title: 'Experimental Series',
    category: 'Abstract',
    coverImage: '/filler/DUO_6.1.jpeg',
    images: [
      '/filler/DUO_6.1.jpeg',
      '/filler/DUO_6.2.jpeg',
      '/filler/DUO_6.3.jpeg',
      '/filler/DUO_6.4.jpeg',
      '/filler/DUO_6.5.jpeg'
    ],
    description: 'Pushing the boundaries of traditional photography through experimental techniques and perspectives.'
  },
  {
    id: 'minimalist-studies',
    title: 'Minimalist Studies',
    category: 'Minimalism',
    coverImage: '/filler/DETAILS_2.2.jpeg',
    images: [
      '/filler/DETAILS_2.2.jpeg',
      '/filler/DETAILS_2.1.jpeg'
    ],
    description: 'Exploring the power of simplicity and negative space in photographic composition.'
  },
  {
    id: 'color-explorations',
    title: 'Color Explorations',
    category: 'Color',
    coverImage: '/filler/DUO_2.2.jpg',
    images: [
      '/filler/DUO_2.2.jpg',
      '/filler/DUO_1.9.jpg',
      '/filler/DETAILS_1.5.jpg',
      '/filler/DETAILS_1.7.jpg',
      '/filler/DETAILS_1.9.jpg',
      '/filler/DETAILS_2.1.jpg',
      '/filler/DUO_3.2.jpg',
      '/filler/DUO_3.4.jpg',
      '/filler/DUO_3.7.jpg',
      '/filler/DUO_3.9.jpg',
      '/filler/DUO_4.0.jpg'
    ],
    description: 'A vibrant collection focusing on color relationships and chromatic harmony.'
  }
]

export const getGalleryCollections = (): GalleryItem[] => {
  if (typeof window === 'undefined') {
    return defaultGalleryCollections
  }
  
  try {
    const savedCollections = localStorage.getItem('galleryCollections')
    if (savedCollections) {
      const parsed = JSON.parse(savedCollections)
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultGalleryCollections
    }
  } catch (error) {
    console.error('Error loading gallery collections:', error)
  }
  
  return defaultGalleryCollections
}

export const saveGalleryCollections = (collections: GalleryItem[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('galleryCollections', JSON.stringify(collections))
  }
}

export const getGalleryCollection = (id: string): GalleryItem | null => {
  const collections = getGalleryCollections()
  return collections.find(collection => collection.id === id) || null
}

export const getGalleryCategories = (): string[] => {
  const collections = getGalleryCollections()
  const categories = [...new Set(collections.map(collection => collection.category))]
  return categories.sort()
}